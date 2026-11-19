// Public settings. API key is NEVER stored here — it lives only in Cloudflare Worker secrets.
window.XMM_CONFIG = {
  // Leave empty. The real key is on Cloudflare Worker.
  GROQ_KEY: "",

  // Your Cloudflare Worker URL (the proxy).
  GROQ_PROXY: "https://xmmai.xbm-bayat.workers.dev",

  // Which Groq plan the Worker's key is on. This sets how big each request may be.
  //   "free" = ~8K tokens/minute (long sites are built in chunks, a few chunks per minute)
  //   "dev"  = Developer plan, 250K tokens/minute (big files in one go, no waiting)
  // Switch to "dev" after you upgrade at console.groq.com — that is the single biggest speed-up.
  TIER: "free",

  // Your Cloudflare image Worker (FLUX). If it fails or hits its daily limit, the site falls back to Pollinations.
  IMAGE_PROXY: "https://xmmai-image.xbm-bayat.workers.dev",

  // Optional: free Hugging Face token (huggingface.co/settings/tokens, type "Read", starts with hf_).
  // Gives your visitors a bigger free image allowance. Leave empty to run without it.
  HF_TOKEN: "",

  // Free community AIs, no API key. Used before Groq:
  // tried FIRST (1st, then 2nd). If both fail the app shows "Server 1 failed, using server 2" and uses Groq.
  FREE_AI: [
    { name: "LLM7", url: "https://api.llm7.io/v1/chat/completions", model: "gpt-4.1-nano-2025-04-14", key: "unused" },
    { name: "Pollinations", url: "https://text.pollinations.ai/openai", model: "openai", key: "" }
  ],

  // Optional extra models to try if the main one fails
  FALLBACK_MODELS: [],

  TEXT_MODEL: "openai/gpt-oss-120b",
  FAST_MODEL: "openai/gpt-oss-120b",
  SMART_MODEL: "openai/gpt-oss-120b",
  CODE_MODEL: "openai/gpt-oss-120b",
  VISION_MODEL: "qwen/qwen3.8-27b"
};
