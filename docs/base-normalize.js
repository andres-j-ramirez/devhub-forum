(function () {
  if (!/\.github\.io$/.test(location.hostname)) return;
  var base = '/devhub-forum/';
  var atRoot = location.pathname === base;
  // If we're not at the SPA root, jump there but keep the hash (or send to #/login)
  if (!atRoot) {
    var h = location.hash && location.hash.trim() ? location.hash : '#/login';
    location.replace(base + h);
  }
})();
