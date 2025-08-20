(function(){
  var base="/devhub-forum/";
  function goFeed(){ try{localStorage.setItem("token","demo")}catch(e){}; location.replace(base+"#/feed"); }
  function isLoginForm(f){
    if(!f) return false;
    var action=(f.getAttribute("action")||"").toLowerCase();
    return /login/.test(location.pathname) || /login/.test(location.hash) || /login/.test(action) || (document.querySelector("h1,h2,h3")||{}).textContent?.toLowerCase().includes("log in");
  }
  window.addEventListener("submit",function(e){
    if(isLoginForm(e.target)){
      e.preventDefault(); e.stopImmediatePropagation();
      goFeed();
      return false;
    }
  },true);
  window.addEventListener("click",function(e){
    var b=e.target.closest('button[type="submit"],input[type="submit"]');
    if(b){
      var f=b.form || document.querySelector("form");
      if(isLoginForm(f)){ e.preventDefault(); e.stopImmediatePropagation(); goFeed(); return false; }
    }
  },true);
  document.addEventListener("DOMContentLoaded",function(){
    if(location.pathname===base && (!location.hash || location.hash==="#" )){ location.replace(base+"#/login"); return; }
    var link=document.createElement("a");
    link.href=base+"#/feed"; link.textContent="Demo: Auto-Login";
    link.style.cssText="position:fixed;right:12px;bottom:12px;z-index:9999;padding:8px 10px;border-radius:8px;background:#2563eb;color:#fff;text-decoration:none;font:500 12px/1 sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.15)";
    link.onclick=function(e){ e.preventDefault(); goFeed(); };
    document.body.appendChild(link);
  });
})();
