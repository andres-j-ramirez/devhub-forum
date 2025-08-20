document.addEventListener("DOMContentLoaded",function(){
  function go(){ try{ localStorage.setItem("token","demo"); }catch(e){} location.hash="#/feed"; }
  if(location.hash==="" && /\/login\/?$/.test(location.pathname)){ location.hash="#/login"; }
  var form=document.querySelector("form");
  var btn=document.querySelector('button[type="submit"], .login-btn');
  if(form){ form.addEventListener("submit",function(e){ e.preventDefault(); go(); }); }
  if(btn){ btn.addEventListener("click",function(e){ e.preventDefault(); go(); }); }
  var a=document.createElement("a");
  a.href="#/login"; a.textContent="Demo: Auto-Login";
  a.style.cssText="position:fixed;right:12px;bottom:12px;z-index:9999;padding:8px 12px;background:#2563eb;color:#fff;border-radius:9999px;font:500 12px/1 sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.15)";
  a.onclick=function(e){ e.preventDefault(); go(); };
  document.body.appendChild(a);
});
