export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");
    if (!target) {
      return new Response(JSON.stringify({
        ready: true,
        message: "Proxy Ready ✅ - Use ?url=...",
        test: "/?url=https://wan-ai-wan2-1.hf.space/gradio_api/info"
      }), { headers: { "Content-Type":"application/json", "Access-Control-Allow-Origin":"*"}});
    }
    try {
      const r = await fetch(target);
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
}
