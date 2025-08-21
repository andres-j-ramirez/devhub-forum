(function(){
  if(!/\.github\.io$/.test(location.hostname)) return;
  var base = '/devhub-forum/';
  var p = location.pathname.replace(/\/+$/,'');
  if (p === base.replace(/\/$/,'') + '/login') {
    location.replace(base + '#/login');
  } else if (p === base.replace(/\/$/,'') + '/register') {
    location.replace(base + '#/register');
  }
})();
