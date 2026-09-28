export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400"
    };

    // Handle preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get("url");

    // 1. Proxy mode
    if (target) {
      try {
        const r = await fetch(target, { 
          headers: { "Accept": "application/json, */*" },
          cf: { cacheTtl: 60 }
        });
        const contentType = r.headers.get("content-type") || "application/json";
        const body = await r.text();
        return new Response(body, {
          status: r.status,
          headers: { ...corsHeaders, "Content-Type": contentType }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message, target }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // 2. Landing page mode - serve assets if available
    if (env.ASSETS) {
      try {
        let res = await env.ASSETS.fetch(request);
        // inject CORS to assets too
        let newHeaders = new Headers(res.headers);
        Object.entries(corsHeaders).forEach(([k,v]) => newHeaders.set(k,v));
        return new Response(res.body, { status: res.status, headers: newHeaders });
      } catch {}
    }

    // 3. Fallback
    const html = `<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width'><title>AI Tools Factory - Proxy Ready</title><script src='https://cdn.tailwindcss.com'></script></head><body style='background:#0e1116;color:#e5e7eb'><div style='max-width:900px;margin:40px auto;padding:24px;text-align:center'><h1 style='font-size:36px;font-weight:800'>Proxy Ready ✅</h1><p style='opacity:.6;margin-top:10px'>Use ?url=...</p><code style='display:block;background:#161a23;padding:12px;border-radius:8px;margin-top:20px;word-break:break-all'>${url.origin}/?url=https://wan-ai-wan2-1.hf.space/gradio_api/info</code><div style='margin-top:30px'><a href='/tools/hf-scraper/' style='background:white;color:black;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700'>Open HF Bulk Scraper →</a></div></div></body></html>`;
    return new Response(html, { headers: { ...corsHeaders, "Content-Type": "text/html" } });
  }
}
