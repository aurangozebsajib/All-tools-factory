export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Proxy mode:?url= thakle proxy hisebe kaj korbe
    const target = url.searchParams.get("url");
    if (target) {
      try {
        const r = await fetch(target, { headers: { "Accept":"application/json" } });
        const b = await r.text();
        return new Response(b, { headers: {
          "Content-Type":"application/json",
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Methods":"GET, OPTIONS",
          "Access-Control-Allow-Headers":"*"
        }});
      } catch(e) {
        return new Response(JSON.stringify({error:e.message}), {status:500, headers:{"Access-Control-Allow-Origin":"*"}});
      }
    }

    // 2. Static site mode: Visit link e gele landing page dekhabe
    // Cloudflare assets binding theke file serve korbe
    if (env.ASSETS) {
      return await env.ASSETS.fetch(request);
    }
    // Fallback landing page
    return new Response(`<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width'><title>AI Tools Factory</title><script src='https://cdn.tailwindcss.com'></script></head><body style='background:#0e1116;color:#e5e7eb'><div style='max-width:1100px;margin:0 auto;padding:24px'><h1 style='font-size:42px;font-weight:800'>AI Tools Factory</h1><p style='opacity:.6'>Proxy + Tools - Visit +?url= both working</p><div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:32px'><a href='/tools/hf-scraper/' style='background:#161a23;border:1px solid #ffffff1a;border-radius:16px;padding:20px;display:block;text-decoration:none;color:white'><span style='background:#10b98133;color:#6ee7b7;padding:4px 8px;border-radius:20px;font-size:12px'>● LIVE</span><h3 style='margin-top:12px'>🤗 Hugging Face Data - Bulk Scraper</h3><p style='opacity:.6;font-size:14px;margin-top:8px'>Wan 7, Omni 15, LTX 7 MCP auto detect. Proxy: your worker</p><div style='margin-top:16px;background:white;color:black;text-align:center;padding:10px;border-radius:10px;font-weight:600'>Open Tool →</div></a></div><div style='margin-top:20px;opacity:.4;font-size:12px'>Proxy test: <a style='color:#a78bfa' href='/?url=https://wan-ai-wan2-1.hf.space/gradio_api/info'>/?url=https://wan-ai-wan2-1.hf.space/gradio_api/info</a></div></div></body></html>`, { headers: { "Content-Type":"text/html" }});
  }
}
