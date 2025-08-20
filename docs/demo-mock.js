(function () {
  if (!location.hostname.endsWith("github.io")) return;

  function ok(json){return new Response(JSON.stringify(json),{status:200,headers:{"Content-Type":"application/json"}})}
  function err(code,msg){return new Response(JSON.stringify({error:msg||"invalid"}),{status:code,headers:{"Content-Type":"application/json"}})}

  function parseBody(raw){
    if(!raw) return {};
    if(typeof raw==="string"){
      try{ return JSON.parse(raw) }catch(_){}
      try{
        const p=new URLSearchParams(raw); const o={}; for(const [k,v] of p) o[k]=v; return o;
      }catch(_){}
      return {};
    }
    if(raw instanceof FormData){ return Object.fromEntries(raw) }
    if(typeof raw==="object") return raw;
    return {};
  }

  function handle(url, method, body){
    method=(method||"GET").toUpperCase();
    try{ url=new URL(url,location.href).pathname.toLowerCase() }catch(_){ url=String(url||"").toLowerCase() }

    if ((url.includes("/auth/login") || url.endsWith("/login") || url.includes("/api/login")) && method==="POST"){
      const b=parseBody(body);
      const email=(b.email||b.username||"").toString().toLowerCase();
      const pass =(b.password||b.pass||"").toString();
      if(email==="test@example.com" && pass==="devhub"){ try{localStorage.setItem("token","demo")}catch(_){}
        return ok({token:"demo"}) }
      return err(401,"invalid");
    }

    if ((url.includes("/feed") || url.includes("/posts")) && method==="GET"){
      return ok({posts:[
        {id:1,title:"Welcome to DevHub (Demo)",body:"Static demo on GitHub Pages.",author:"Admin",createdAt:new Date().toISOString()},
        {id:2,title:"Try Dark Mode",body:"Use the toggle in the navbar.",author:"Admin",createdAt:new Date().toISOString()},
      ]});
    }
    return null;
  }

  const realFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    const url=typeof input==="string"?input:input.url;
    const resp=handle(url,init?.method,init?.body); if(resp) return resp;
    return realFetch(input,init);
  };

  const RealXHR=window.XMLHttpRequest;
  function MockXHR(){
    const x=new RealXHR(); let _method="GET",_url="";
    const o=x.open.bind(x), s=x.send.bind(x);
    x.open=function(m,u){_method=m;_url=u;return o(m,u)};
    x.send=function(d){
      const resp=handle(_url,_method,d); if(resp){
        resp.text().then(t=>{
          Object.defineProperty(x,"status",{value:200});
          Object.defineProperty(x,"responseText",{value:t});
          Object.defineProperty(x,"response",{value:t});
          x.onreadystatechange && x.onreadystatechange(); x.onload && x.onload();
        }); return;
      }
      return s(d);
    };
    return x;
  }
  window.XMLHttpRequest=MockXHR;
})();
