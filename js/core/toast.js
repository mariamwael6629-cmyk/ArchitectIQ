'use strict';

/* ── TOAST ───────────────────────────────────────────────────────────────────*/
function toast(msg,dur=2800){
  const el=document.createElement('div');
  el.className='toast';el.textContent=msg;
  document.body.appendChild(el);
  setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity .4s';setTimeout(()=>el.remove(),420);},dur);
}
