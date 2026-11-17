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

  // Optional extra models to try if the main one fails
  FALLBACK_MODELS: [],

  TEXT_MODEL: "qwen/qwen3.8-27b",
  FAST_MODEL: "qwen/qwen3.8-27b",
  SMART_MODEL: "qwen/qwen3.8-27b",
  CODE_MODEL: "qwen/qwen3.8-27b",
  VISION_MODEL: "qwen/qwen3.8-27b"
};
