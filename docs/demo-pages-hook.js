(function(){
  if(!/\.github\.io$/.test(location.hostname)) return;
  try{ localStorage.removeItem('token'); }catch(_){}
  function gotoFeed(){ try{ localStorage.setItem('token','demo'); }catch(_){}
    location.hash = '#/feed';
  }
  var origSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function(){ if(location.pathname.endsWith('/login')||location.hash.includes('#/login')){ gotoFeed(); return; } return origSubmit.apply(this, arguments); };
  document.addEventListener('submit', function(e){
    var f=e.target;
    if(!(f && f.tagName==='FORM')) return;
    if(location.pathname.endsWith('/login')||location.hash.includes('#/login')){
      e.preventDefault(); e.stopPropagation();
      gotoFeed();
    }
  }, true);
  document.addEventListener('click', function(e){
    var t=e.target;
    if(t && t.closest && t.closest('form') && (location.pathname.endsWith('/login')||location.hash.includes('#/login'))){
      var f=t.closest('form'); if(!f) return;
      e.preventDefault(); e.stopPropagation();
      gotoFeed();
    }
  }, true);
})();
