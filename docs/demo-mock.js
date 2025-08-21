(function(){
  if(!/\.github\.io$/.test(location.hostname)) return;

  function ok(u,p){return (u||"").toLowerCase()==="test@example.com" && p==="devhub";}

  var realOpen = XMLHttpRequest.prototype.open;
  var realSend = XMLHttpRequest.prototype.send;

  function respond(xhr, status, body){
    setTimeout(function(){
      Object.defineProperty(xhr,'readyState',{value:4});
      Object.defineProperty(xhr,'status',{value:status});
      Object.defineProperty(xhr,'responseText',{value:body});
      Object.defineProperty(xhr,'response',{value:body});
      xhr.onreadystatechange && xhr.onreadystatechange();
      xhr.onload && xhr.onload();
    },0);
  }

  XMLHttpRequest.prototype.open = function(method, url){
    this.__demo = { method:(method||'GET').toUpperCase(), url:String(url||'') };
    return realOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function(data){
    try{
      var m = this.__demo.method, u = this.__demo.url;
      if(m==='POST' && /\/api\/auth\/login\b/.test(u)){
        var body={};
        try{
          if(typeof data==='string') body=JSON.parse(data);
          else if(data instanceof FormData) body=Object.fromEntries(data);
        }catch(_){}
        if(ok(body.email, body.password)){
          try{ localStorage.setItem('token','demo'); }catch(_){}
          return respond(this,200,JSON.stringify({token:'demo'}));
        }
        return respond(this,401,JSON.stringify({error:'invalid'}));
      }
    }catch(_){}
    return realSend.apply(this, arguments);
  };
})();
