/**
 * XMM AI — Groq API proxy for Cloudflare Workers
 * 1. Cloudflare dashboard -> your Worker -> paste this file -> Deploy
 * 2. Settings -> Variables and Secrets, add:
 *      GROQ_API_KEY  (secret)   = your Groq API key (starts with gsk_)
 *      MAX_OUT       (optional) = max output tokens per request (default 16384 = the model's ceiling)
 * 3. The model is forced to qwen/qwen3.8-27b for every request.
 *
 * NOTE: the old version clamped max_tokens to 900, which cut every generated file off.
 * The browser now decides how much to ask for (it knows your Groq tier); this Worker
 * only enforces the model's real ceiling.
 */

const MODEL = "qwen/qwen3.8-27b";
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL_MAX_OUT = 16384; // Groq's documented max completion tokens for this model

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(request) });
    }

    const ceiling = Math.min(Number(env.MAX_OUT) || MODEL_MAX_OUT, MODEL_MAX_OUT);

    // Image generation (Cloudflare Workers AI, free daily allowance, no extra key)
    if (new URL(request.url).pathname === "/image") return handleImage(request, env);

    // Health check: open the Worker URL in a browser to see how it is configured
    if (request.method === "GET") {
      return json(request, 200, {
        ok: true,
        has_key: !!(env.GROQ_API_KEY || env.API_KEY),
        api_url: GROQ_URL,
        model: MODEL,
        max_output_tokens: ceiling
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: cors(request) });
    }

    const origin = request.headers.get("Origin") || "";
    const allowed = [
      "https://xmm-ai.com",
      "https://www.xmm-ai.com",
      "https://xmmai.vercel.app",
      "https://xmm-ai.pages.dev",
      "https://xmmai.freedev.app",
      "https://app-xmmai.github.io",
      "https://xmmcraft.qzz.io",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ];
    const ok =
      !origin ||
      allowed.includes(origin) ||
      origin.endsWith(".vercel.app") || origin.endsWith(".pages.dev") ||
      origin.endsWith(".workers.dev");
    if (!ok) {
      return new Response("Forbidden", { status: 403, headers: cors(request) });
    }

    const KEY = env.GROQ_API_KEY || env.API_KEY;
    if (!KEY) {
      return json(request, 500, { error: { message: "GROQ_API_KEY missing on Worker" } });
    }

    let payload;
    try { payload = await request.json(); } catch { payload = {}; }
    if (!payload || typeof payload !== "object") payload = {};

    payload.model = MODEL;
    // Respect what the client asks for, but never exceed the model's real limit.
    payload.max_tokens = Math.max(16, Math.min(Number(payload.max_tokens) || 1024, ceiling));
    delete payload.max_completion_tokens;
    delete payload.response_format;
    delete payload.reasoning_format;
    // No hidden thinking = much faster first token (the client also sends /no_think).
    if (!payload.reasoning_effort) payload.reasoning_effort = "none";

    let groqRes = await callGroq(payload, KEY);

    // If this model/account rejects reasoning_effort, retry once without it.
    if (groqRes.status === 400 && payload.reasoning_effort) {
      const txt = await groqRes.clone().text();
      if (/reasoning/i.test(txt)) {
        delete payload.reasoning_effort;
        groqRes = await callGroq(payload, KEY);
      }
    }

    if (!groqRes.ok) {
      const txt = await groqRes.text();
      let msg = txt.slice(0, 300);
      try {
        const j = JSON.parse(txt);
        msg = (j.error && (j.error.message || j.error)) || j.message || msg;
      } catch {}
      return json(request, groqRes.status, {
        error: {
          message: `Upstream ${groqRes.status} from ${new URL(GROQ_URL).host} (model ${MODEL}): ${
            typeof msg === "string" ? msg : JSON.stringify(msg)
          }`
        }
      });
    }

    const headers = new Headers(groqRes.headers);
    Object.entries(cors(request)).forEach(([k, v]) => headers.set(k, v));
    return new Response(groqRes.body, { status: groqRes.status, headers });
  }
};

function callGroq(payload, key) {
  return fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(payload)
  });
}

function json(request, status, obj) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { ...cors(request), "Content-Type": "application/json" }
  });
}

function cors(request) {
  const origin = request.headers.get("Origin") || "https://xmmai.vercel.app";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}


/* ---------- IMAGES: Cloudflare Workers AI (free DAILY allowance, works from Iran) ----------
 * Setup: Worker -> Settings -> Bindings -> Add -> Workers AI -> Variable name: AI
 * Free plan: 10,000 neurons per day, resets every day (no monthly limit).
 * One image per 20 seconds per user IP address.
 */
const IMG_COOLDOWN = 20; // seconds, per user IP

async function handleImage(request, env) {
  if (request.method !== "POST") return json(request, 405, { error: "POST only" });
  const origin = request.headers.get("Origin") || "";
  const okOrigin =
    !origin ||
    origin.endsWith(".vercel.app") || origin.endsWith(".pages.dev") ||
    origin.endsWith(".workers.dev") ||
    origin.endsWith(".freedev.app") ||
    origin === "https://app-xmmai.github.io" ||
    origin === "https://xmmcraft.qzz.io" ||
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1");
  if (!okOrigin) return json(request, 403, { error: "Forbidden origin" });
  if (!env.AI) return json(request, 500, { error: "Workers AI binding missing: add a binding named AI" });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const cache = caches.default;
  const ckey = new Request("https://xmm-cooldown.local/" + encodeURIComponent(ip));
  const hit = await cache.match(ckey);
  if (hit) {
    const t = Number(hit.headers.get("X-Until")) || 0;
    const wait = Math.max(1, Math.ceil((t - Date.now()) / 1000));
    return json(request, 429, { error: "Cool down: wait " + wait + "s", wait });
  }
  await cache.put(ckey, new Response("1", {
    headers: { "Cache-Control": "max-age=" + IMG_COOLDOWN, "X-Until": String(Date.now() + IMG_COOLDOWN * 1000) }
  }));

  let b = {};
  try { b = await request.json(); } catch {}
  const prompt = String(b.prompt || "").slice(0, 1000);
  if (!prompt) return json(request, 400, { error: "No prompt" });
  const snap = (n) => Math.max(256, Math.min(1024, Math.round((Number(n) || 1024) / 64) * 64));
  const w = snap(b.width), h = snap(b.height);

  const flux = () => env.AI.run("@cf/black-forest-labs/flux-1-schnell", { prompt, steps: 6 });
  const sdxl = () => env.AI.run("@cf/bytedance/stable-diffusion-xl-lightning", { prompt, width: w, height: h });
  const dream = () => env.AI.run("@cf/lykon/dreamshaper-8-lcm", { prompt, width: Math.min(w, 768), height: Math.min(h, 768) });
  const runs = w === h ? [flux, sdxl, dream] : [sdxl, flux, dream];

  let lastErr = "";
  for (const run of runs) {
    try {
      const out = await run();
      let data;
      if (out && typeof out === "object" && out.image) data = "data:image/jpeg;base64," + out.image;
      else {
        const u8 = new Uint8Array(await new Response(out).arrayBuffer());
        let bin = "";
        for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
        data = "data:image/png;base64," + btoa(bin);
      }
      if (data.length > 2000) return json(request, 200, { image: data });
    } catch (e) {
      lastErr = String((e && e.message) || e).slice(0, 160);
    }
  }
  await cache.delete(ckey);
  return json(request, 502, { error: "Image engines failed: " + lastErr });
}
