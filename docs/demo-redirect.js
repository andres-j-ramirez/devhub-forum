(function(){
  var root="/devhub-forum";
  var p=location.pathname;
  if(p.indexOf(root)===0){
    var rest=p.slice(root.length);
    if(rest && rest!=="\/" && rest.indexOf("/#")!==0){
      location.replace(root+"/#"+rest.replace(/^\/+/,""));
      return;
    }
  }
})();
