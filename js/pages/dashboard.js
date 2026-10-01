'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════════════*/
const PROGRESS=[
  {label:'Load Balancing',pct:100,color:'var(--em)'},
  {label:'Database Design',pct:80,color:'var(--accent)'},
  {label:'Microservices',pct:65,color:'var(--accent)'},
  {label:'Caching Strategies',pct:55,color:'var(--accent)'},
  {label:'Distributed Systems',pct:40,color:'var(--am)'},
  {label:'Event-Driven Architecture',pct:25,color:'var(--rose)'},
  {label:'Auth & Security',pct:20,color:'var(--violet)'},
];
document.getElementById('prog-bars').innerHTML=PROGRESS.map(p=>`
  <div class="prog-item">
    <div class="prog-label"><span>${p.label}</span><span style="color:${p.color};">${p.pct}%</span></div>
    <div class="prog-bar"><div class="prog-fill" style="width:${p.pct}%;background:${p.color};"></div></div>
  </div>`).join('');

const ACTIVITY=[
  {ic:'📖',name:'Completed: CAP Theorem Deep Dive',time:'2 hours ago',pts:'+50 pts'},
  {ic:'🏗️',name:'Built: E-commerce Architecture',time:'Yesterday',pts:'+120 pts'},
  {ic:'⭐',name:'Saved: Netflix Case Study',time:'2 days ago',pts:null},
  {ic:'🏆',name:'Earned: Distributed Systems badge',time:'3 days ago',pts:'Achievement'},
  {ic:'📝',name:'Completed: URL Shortener Project',time:'4 days ago',pts:'+200 pts'},
];
document.getElementById('activity-list').innerHTML=ACTIVITY.map(a=>`
  <div class="rec-item">
    <div class="rec-ic">${a.ic}</div>
    <div style="flex:1;"><div class="rec-name">${a.name}</div><div class="rec-time">${a.time}</div></div>
    ${a.pts?`<span class="rec-pts">${a.pts}</span>`:''}
  </div>`).join('');

const BADGES=[
  {ic:'🚀',n:'First Deploy',earned:true},{ic:'🏗️',n:'Architect',earned:true},
  {ic:'📊',n:'Data Guru',earned:true},{ic:'🌐',n:'Distributed',earned:false},
  {ic:'⚡',n:'Cache Master',earned:true},{ic:'🔐',n:'Security Pro',earned:false},
  {ic:'📨',n:'Queue Expert',earned:true},{ic:'👑',n:'Top 100',earned:false},
  {ic:'⭐',n:'Star Learner',earned:true},{ic:'🔥',n:'Streak 30d',earned:false},
  {ic:'📖',n:'Bookworm',earned:false},{ic:'🤝',n:'Contributor',earned:false},
];
document.getElementById('badge-grid').innerHTML=BADGES.map(b=>`
  <div class="badge-item${b.earned?' earned':''}">
    <div class="badge-ic" style="opacity:${b.earned?1:.3};">${b.ic}</div>
    <div class="badge-n">${b.n}</div>
  </div>`).join('');

function renderSavedProjs(list){
  document.getElementById('saved-projs').innerHTML=list.map(p=>`
  <div style="display:flex;align-items:center;gap:.9rem;padding:.6rem 0;border-bottom:1px solid var(--border);">
    <div style="width:30px;height:30px;border-radius:7px;background:rgba(59,130,246,.14);display:flex;align-items:center;justify-content:center;font-size:13px;">⭐</div>
    <div style="flex:1;"><div style="font-size:13.5px;font-weight:500;color:var(--text);">${p.t||p.title}</div><div style="font-size:11px;color:var(--text3);">⏱ ${p.time||p.time_estimate} · ★ ${p.stars}</div></div>
    <button class="btn-sm" onclick="go('library')">Open →</button>
  </div>`).join('');
}
renderSavedProjs(PROJECTS.slice(0,5));

async function loadDashboard(){
  if(!currentUser) return;
  try{
    const d = await apiFetch('/dashboard/me');
    document.querySelector('#dashboard .dash-stats').innerHTML = `
      <div class="dstat"><div class="dstat-n" style="color:var(--accent2);">${d.projects_completed}</div><div class="dstat-l">Architectures Saved</div></div>
      <div class="dstat"><div class="dstat-n" style="color:var(--em);">${d.learning_progress_pct}%</div><div class="dstat-l">Learning Progress</div></div>
      <div class="dstat"><div class="dstat-n" style="color:var(--am);">${d.badges_earned}</div><div class="dstat-l">Badges Earned</div></div>`;
    document.getElementById('badge-grid').innerHTML=d.badges.map(b=>`
      <div class="badge-item${b.earned?' earned':''}">
        <div class="badge-ic" style="opacity:${b.earned?1:.3};">${b.icon}</div>
        <div class="badge-n">${b.name}</div>
      </div>`).join('');
    renderSavedProjs(d.saved_projects.length ? d.saved_projects : PROJECTS.slice(0,5));
  }catch(e){ /* keep static demo dashboard */ }
}
loadDashboard();
