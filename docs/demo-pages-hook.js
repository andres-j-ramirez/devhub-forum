document.addEventListener('DOMContentLoaded', function(){
  if(!/\.github\.io$/.test(location.hostname)) return;

  function tryWire(){
    const form = document.querySelector('form');
    const btn  = form ? form.querySelector('button[type="submit"]') : null;
    if(!form || !btn) return;

    const demo = (e)=>{
      // let Vue handle it first; if axios fails, we still demo
      setTimeout(()=>{
        const email = (document.querySelector('input[type="email"]')||{}).value || '';
        const pass  = (document.querySelector('input[type="password"]')||{}).value || '';
        if (email.toLowerCase()==='test@example.com' && pass==='devhub') {
          try{ localStorage.setItem('token','demo'); }catch(_){}
          location.hash = '#/feed';
        }
      }, 200);
    };

    form.addEventListener('submit', demo);
    btn.addEventListener('click', demo);
  }

  // a couple retries to wait for Vue to render
  let tries=0, i=setInterval(()=>{ tryWire(); if(++tries>10) clearInterval(i); }, 150);
});
