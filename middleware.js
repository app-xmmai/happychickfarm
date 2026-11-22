// Host router (Vercel Routing Middleware). Runs only for "/".
//   app.xmm-ai.com     -> Chat    (/chat/index.html)
//   auth.xmm-ai.com    -> Login   (/login/index.html)
//   support.xmm-ai.com -> Support (/support/index.html)
//   status.xmm-ai.com  -> Status  (/status/index.html)
//   anything else      -> untouched (main site keeps its normal "/" -> /home rewrite)
// It only ever REWRITES (internal, URL and hostname stay the same). It never redirects.
export const config = { matcher: ['/'] };

const ROOT = 'xmm-ai.com';
const PAGES = {
  app: '/chat/index.html',
  auth: '/login/index.html',
  support: '/support/index.html',
  status: '/status/index.html',
};

export default function middleware(request) {
  try {
    const host = String(request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).hostname)
      .toLowerCase()
      .split(',')[0]
      .trim()
      .split(':')[0];
    const sub = host.endsWith('.' + ROOT) ? host.slice(0, -(ROOT.length + 1)) : '';
    const page = PAGES[sub];
    if (page) {
      return new Response(null, { headers: { 'x-middleware-rewrite': new URL(page, request.url).toString() } });
    }
  } catch (e) {}
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}
