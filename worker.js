export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get("url");

    // Proxy mode - eita robot/CORS bypass korbe
    if (target) {
      try {
        const r = await fetch(target, { headers: { "Accept": "application/json" } });
        const body = await r.text();
        return new Response(body, {
          status: r.status,
          headers: {...cors, "Content-Type": r.headers.get("content-type") || "application/json" }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: {...cors, "Content-Type": "application/json" } });
      }
    }

    // Landing page serve
    if (env.ASSETS) {
      const res = await env.ASSETS.fetch(request);
      const h = new Headers(res.headers);
      Object.entries(cors).forEach(([k,v])=>h.set(k,v));
      return new Response(res.body, { status: res.status, headers: h });
    }
    return new Response("Proxy Ready - use?url=", { headers: cors });
  }
}
