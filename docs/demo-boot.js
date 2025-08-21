(function(){
  if(!/\.github\.io$/.test(location.hostname)) return;
  var base='/devhub-forum/';
  var p=location.pathname.replace(/\/+$/,''); var b=base.replace(/\/$/,'');
  if(p===b+'/login'){location.replace(base+'#/login');return;}
  if(p===b+'/register'){location.replace(base+'#/register');return;}
  document.addEventListener('DOMContentLoaded',function(){
    var lnks=document.querySelectorAll('a[href="/login"],a[href="/login/"],a[href="/register"],a[href="/register/"]');
    lnks.forEach(function(a){var t=a.getAttribute('href'); a.setAttribute('href',t.indexOf('login')>-1?'#/login':'#/register');});
    function hook(){
      var form=document.querySelector('form');
      var email=document.querySelector('input[type="email"],input[name="email"]');
      var pass=document.querySelector('input[type="password"],input[name="password"]');
      var btn=document.querySelector('button[type="submit"],button,input[type="submit"]');
      function finish(){try{localStorage.setItem('token','demo');}catch(e){} location.hash='#/feed';}
      function ok(){var u=(email&&email.value||'').trim().toLowerCase(); var p=(pass&&pass.value||''); return (u==='test@example.com'&&p==='devhub');}
      if(form && !form.__demoBound){
        form.__demoBound=true;
        form.addEventListener('submit',function(e){if(ok()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();finish();}},true);
      }
      if(btn && !btn.__demoBound){
        btn.__demoBound=true;
        btn.addEventListener('click',function(e){if(ok()){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();finish();}},true);
      }
    }
    hook();
    var iv=setInterval(hook,300);
    setTimeout(function(){clearInterval(iv)},8000);
  });
})();
