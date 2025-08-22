(function(){
  if(!/\.github\.io$/.test(location.hostname)) return;
  const realFetch = window.fetch.bind(window);
  function json(data, status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}})}
  window.fetch = async (input, init={})=>{
    const url = typeof input==='string'?input:input.url;
    const method = (init.method||'GET').toUpperCase();

    // Demo auth
    if (/\/api\/auth\/login\b/.test(url) && method==='POST'){
      let body={};
      try{ body = init.body ? JSON.parse(init.body) : {} }catch(_){}
      const u=(body.email||'').toLowerCase(), p=(body.password||'');
      if (u==='test@example.com' && p==='devhub') {
        try{ localStorage.setItem('token','demo'); }catch(_){}
        return json({ token:'demo', user:{ email:u } }, 200);
      }
      return json({ error:'invalid' }, 401);
    }

    // Demo feed
    if (/\/api\/posts\b/.test(url) && method==='GET'){
      return json({ posts:[
        { id:1, title:'Welcome to DevHub (Demo)', body:'Static demo on GitHub Pages', author:'Admin', createdAt:new Date().toISOString() },
        { id:2, title:'Try Dark Mode', body:'Use the toggle in the navbar.', author:'Admin', createdAt:new Date().toISOString() },
      ]});
    }

    return realFetch(input, init);
  };
})();
