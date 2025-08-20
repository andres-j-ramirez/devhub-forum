(function(){
  if(!(location.hostname.endsWith("github.io"))) return;
  const realFetch = window.fetch.bind(window);
  window.fetch = async function(input, init){
    const url = typeof input === "string" ? input : input.url;
    const method = (init && init.method ? init.method : "GET").toUpperCase();

    if((/\/auth\/login\b/.test(url) || /\/login\b/.test(url)) && method === "POST"){
      let body = {};
      try{
        if(init && init.body){
          body = init.body instanceof FormData ? Object.fromEntries(init.body) : JSON.parse(init.body);
        }
      }catch(_e){}
      const u = (body.email || body.username || "").toString().toLowerCase();
      const p = (body.password || body.pass || "").toString();
      if(u === "test@example.com" && p === "devhub"){
        try{ localStorage.setItem("token","demo"); }catch(_e){}
        return new Response(JSON.stringify({ token: "demo" }), { status: 200, headers: { "Content-Type": "application/json" }});
      }
      return new Response(JSON.stringify({ error: "invalid" }), { status: 401, headers: { "Content-Type": "application/json" }});
    }

    if((/\/feed\b/.test(url) || /\/posts\b/.test(url)) && method === "GET"){
      const posts = [
        { id: 1, title: "Welcome to DevHub (Demo)", body: "Static demo running on GitHub Pages.", author: "Admin", createdAt: new Date().toISOString() },
        { id: 2, title: "Try Dark Mode", body: "Use the toggle in the navbar.", author: "Admin", createdAt: new Date().toISOString() }
      ];
      return new Response(JSON.stringify({ posts: posts }), { status: 200, headers: { "Content-Type": "application/json" }});
    }

    return realFetch(input, init);
  };
})();
