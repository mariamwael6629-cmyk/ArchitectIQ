'use strict';

/* ── NAVIGATION ─────────────────────────────────────────────────────────────*/
function go(id){
  document.querySelectorAll('.pg').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.remove('on'));
  document.getElementById(id).classList.add('on');
  const n=document.getElementById('n-'+id);
  if(n)n.classList.add('on');
  window.scrollTo(0,0);
}
function toggleMobileNav(){
  document.getElementById('mobile-nav').classList.toggle('on');
  document.getElementById('mb-btn').textContent=document.getElementById('mobile-nav').classList.contains('on')?'✕':'☰';
}
