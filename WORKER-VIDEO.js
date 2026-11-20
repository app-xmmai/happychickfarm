/* XMM AI video backend — Cloudflare Worker (Free plan) — Agnes AI
   Secret needed: AGNES_API_KEY   (Settings > Variables and Secrets > Add > type "Secret")
   Endpoints:  POST /video {prompt,seconds}  -> {id}
               GET  /video?id=...            -> {status:"pending"|"done"|"failed", url?, error?}   */

const MODEL = "agnes-video-2.5-flash";
const API = "https://apihub.agnes-ai.com";
const ALLOWED_ORIGINS = [
  "https://xmmai.vercel.app",
  "https://xmm-ai.com",
  "https://www.xmm-ai.com",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5500"
];
const CREATE_LIMIT = { max: 4, windowMs: 10 * 60 * 1000 };   // 4 new videos / 10 min / IP
const STATUS_LIMIT = { max: 200, windowMs: 10 * 60 * 1000 }; // 200 status checks / 10 min / IP

const hits = new Map(); // free, in-memory, per Worker instance (best effort)
function limited(ip, kind, lim) {
  const now = Date.now(), k = kind + ":" + ip;
  const a = (hits.get(k) || []).filter(t => now - t < lim.windowMs);
  if (a.length >= lim.max) { hits.set(k, a); return Math.ceil((lim.windowMs - (now - a[0])) / 1000); }
  a.push(now); hits.set(k, a);
  if (hits.size > 3000) for (const [key, v] of hits) if (!v.length || now - v[v.length - 1] > lim.windowMs) hits.delete(key);
  return 0;
}

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function send(obj, status, origin, extra) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: Object.assign({ "Content-Type": "application/json", "Cache-Control": "no-store" }, origin ? cors(origin) : {}, extra || {})
  });
}

async function agnes(env, path, init) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 25000);
  try {
    const r = await fetch(API + path, Object.assign({ signal: ac.signal }, init, {
      headers: Object.assign({ Authorization: "Bearer " + env.AGNES_API_KEY }, (init && init.headers) || {})
    }));
    const text = await r.text();
    let j = null; try { j = JSON.parse(text); } catch (e) {}
    return { ok: r.ok, status: r.status, json: j, text };
  } finally { clearTimeout(t); }
}

function pickId(j) {
  if (!j) return null;
  const d = j.data && typeof j.data === "object" ? j.data : {};
  return j.video_id || j.id || j.task_id || d.video_id || d.id || d.task_id || null;
}
function findUrl(o, depth) {
  depth = depth || 0;
  if (!o || depth > 5) return null;
  if (typeof o === "string") return /^https?:\/\//i.test(o) && /(\.mp4|\.webm|\.mov|\/video)/i.test(o) ? o : null;
  if (Array.isArray(o)) { for (const x of o) { const u = findUrl(x, depth + 1); if (u) return u; } return null; }
  if (typeof o === "object") {
    for (const k of ["video_url", "url", "output", "video", "result", "data", "content"]) {
      if (o[k] != null) { const u = findUrl(o[k], depth + 1); if (u) return u; }
    }
    for (const k in o) { const u = findUrl(o[k], depth + 1); if (u) return u; }
  }
  return null;
}
function errText(r) {
  const j = r.json || {};
  const m = (j.error && (j.error.message || j.error)) || j.message || j.detail || r.text || "";
  return String(m).slice(0, 200);
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const okOrigin = ALLOWED_ORIGINS.includes(origin);
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return okOrigin ? new Response(null, { status: 204, headers: cors(origin) }) : new Response(null, { status: 403 });
    }
    if (url.pathname === "/" || url.pathname === "/health") {
      return send({ ok: true, service: "xmm-video", model: MODEL, key: !!env.AGNES_API_KEY }, 200, okOrigin ? origin : "");
    }
    if (origin && !okOrigin) return send({ error: "Origin not allowed", code: 403 }, 403, "");
    const o = okOrigin ? origin : "";
    if (url.pathname !== "/video") return send({ error: "Not found", code: 404 }, 404, o);
    if (!env.AGNES_API_KEY) return send({ error: "Server not configured (missing AGNES_API_KEY)", code: 500 }, 500, o);

    const ip = req.headers.get("CF-Connecting-IP") || "unknown";

    try {
      /* ---- create a video job ---- */
      if (req.method === "POST") {
        const wait = limited(ip, "create", CREATE_LIMIT);
        if (wait) return send({ error: "Too many videos. Try again later.", code: 429, retryAfter: wait }, 429, o, { "Retry-After": String(wait) });

        let b = {}; try { b = await req.json(); } catch (e) {}
        const prompt = String(b.prompt || "").trim().slice(0, 500);
        if (prompt.length < 3) return send({ error: "Prompt is too short", code: 400 }, 400, o);
        const sec = Math.min(12, Math.max(4, Math.round(+b.seconds || 5)));
        const ratio = ["16:9", "21:9", "4:3", "1:1", "3:4", "9:16"].includes(b.aspect) ? b.aspect : "16:9";

        const r = await agnes(env, "/v1/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model: MODEL, prompt, seconds: String(sec), size: "720P", aspect_ratio: ratio })
        });
        if (!r.ok) {
          const code = r.status === 429 ? 429 : r.status === 401 || r.status === 403 ? 502 : r.status >= 500 ? 502 : 400;
          return send({ error: errText(r) || "Agnes error", code, upstream: r.status }, code, o);
        }
        const id = pickId(r.json);
        if (!id) return send({ error: "Agnes returned no video id", code: 502 }, 502, o);
        return send({ id: String(id), status: "pending" }, 200, o);
      }

      /* ---- check a video job ---- */
      if (req.method === "GET") {
        const wait = limited(ip, "status", STATUS_LIMIT);
        if (wait) return send({ error: "Too many requests", code: 429, retryAfter: wait }, 429, o, { "Retry-After": String(wait) });

        const id = url.searchParams.get("id") || "";
        if (!/^[\w.:-]{4,160}$/.test(id)) return send({ error: "Bad id", code: 400 }, 400, o);

        const r = await agnes(env, "/agnesapi?video_id=" + encodeURIComponent(id) + "&model_name=" + MODEL, { method: "GET" });
        if (!r.ok) {
          if (r.status === 404) return send({ status: "failed", error: "Video not found", code: 404 }, 200, o);
          return send({ status: "pending", note: "Agnes busy (" + r.status + ")" }, 200, o); // keep polling
        }
        const j = r.json || {};
        const d = j.data && typeof j.data === "object" ? j.data : {};
        const st = String(j.status || d.status || j.state || d.state || "").toLowerCase();
        const u = findUrl(j);
        if (/fail|error|cancel|reject|timeout|expired/.test(st)) {
          const m = (j.error && (j.error.message || j.error)) || j.message || d.error || d.message || "Generation failed";
          return send({ status: "failed", error: String(m).slice(0, 200), code: 502 }, 200, o);
        }
        if (u && (!st || /done|complete|succe|finish|ready|success/.test(st))) return send({ status: "done", url: u }, 200, o);
        return send({ status: "pending" }, 200, o);
      }

      return send({ error: "Method not allowed", code: 405 }, 405, o);
    } catch (e) {
      const timeout = e && e.name === "AbortError";
      return send({ error: timeout ? "Agnes timed out" : "Server error", code: timeout ? 504 : 500 }, timeout ? 504 : 500, o);
    }
  }
};
