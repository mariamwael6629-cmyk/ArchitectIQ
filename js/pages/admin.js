'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   ADMIN
══════════════════════════════════════════════════════════════════════════*/
const MAU=[28.4,31.2,29.8,34.1,37.6,39.2,41.8,42.1];
const MONTHS=['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];
const maxMAU=Math.max(...MAU);
document.getElementById('mau-chart').innerHTML=MAU.map((v,i)=>`<div class="bar" title="${v}K users" style="height:${Math.round(v/maxMAU*68)}px;background:${i===MAU.length-1?'var(--accent)':'rgba(59,130,246,0.38)'};" onclick="toast('${MONTHS[i]}: ${v}K active users')"></div>`).join('');
document.getElementById('mau-lbl').innerHTML=`<div style="display:flex;justify-content:space-between;width:100%;">${MONTHS.map(m=>`<span>${m}</span>`).join('')}</div>`;

const CATS=[{l:'Beginner',n:89,c:'var(--em)'},{l:'Intermediate',n:78,c:'var(--accent2)'},{l:'Advanced',n:52,c:'var(--am)'},{l:'Enterprise',n:28,c:'var(--violet)'}];
document.getElementById('cat-bars').innerHTML=CATS.map(c=>`
  <div style="margin-bottom:.85rem;">
    <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px;color:var(--text2);"><span>${c.l}</span><span style="color:${c.c};font-weight:700;">${c.n}</span></div>
    <div style="height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;"><div style="height:100%;width:${Math.round(c.n/89*100)}%;background:${c.c};border-radius:3px;"></div></div>
  </div>`).join('');

const ADMIN_USERS=[
  {name:'Arjun Kumar',email:'arjun@example.com',joined:'Jun 1, 2025',projects:23,status:'active'},
  {name:'Sarah Lin',email:'sarah@example.com',joined:'May 28, 2025',projects:18,status:'active'},
  {name:'Marcus Okafor',email:'marcus@example.com',joined:'May 15, 2025',projects:31,status:'active'},
  {name:'Priya Sharma',email:'priya@example.com',joined:'May 10, 2025',projects:8,status:'pending'},
  {name:'Luca Ferreira',email:'luca@example.com',joined:'Apr 22, 2025',projects:0,status:'inactive'},
  {name:'Yuki Tanaka',email:'yuki@example.com',joined:'Apr 18, 2025',projects:14,status:'active'},
  {name:'Amara Osei',email:'amara@example.com',joined:'Apr 5, 2025',projects:27,status:'active'},
];
const statusClass={active:'pill-a',pending:'pill-p',inactive:'pill-i'};
document.getElementById('users-tb').innerHTML=ADMIN_USERS.map(u=>`
  <tr>
    <td style="font-weight:500;">${u.name}</td>
    <td style="color:var(--text3);">${u.email}</td>
    <td>${u.joined}</td><td>${u.projects}</td>
    <td><span class="pill ${statusClass[u.status]}">${u.status}</span></td>
    <td><button class="btn-sm" onclick="toast('Editing ${u.name}…')">Edit</button></td>
  </tr>`).join('');

const ADMIN_PROJS=[
  {t:'URL Shortener',l:'Advanced',a:'arch_master',v:'18.4k',r:'4.8',s:'active'},
  {t:'Real-time Chat',l:'Intermediate',a:'priya_sys',v:'14.2k',r:'4.7',s:'active'},
  {t:'Rate Limiter',l:'Beginner',a:'distributed_dev',v:'22.1k',r:'4.6',s:'active'},
  {t:'Global CDN Design',l:'Enterprise',a:'kafka_queen',v:'6.3k',r:'5.0',s:'pending'},
  {t:'Payment Gateway',l:'Enterprise',a:'arch_master',v:'8.9k',r:'4.9',s:'active'},
  {t:'Web Crawler',l:'Advanced',a:'scale_ninja',v:'8.4k',r:'4.7',s:'active'},
  {t:'Distributed ID Generator',l:'Beginner',a:'newbie_arch',v:'25.4k',r:'4.7',s:'active'},
];
const tagCls={Advanced:'t-a',Intermediate:'t-i',Beginner:'t-b',Enterprise:'t-e'};
function renderAdminProjTb(rows){
  document.getElementById('proj-tb').innerHTML=rows.map(p=>`
  <tr>
    <td style="font-weight:500;">${p.t}</td>
    <td><span class="tag ${tagCls[p.l]||'t-i'}" style="margin-bottom:0;">${p.l}</span></td>
    <td>${p.a}</td><td>${p.v}</td><td>★ ${p.r}</td>
    <td><span class="pill ${p.s==='active'?'pill-a':'pill-p'}">${p.s}</span></td>
    <td><button class="btn-sm" onclick="toast('Editing ${p.t}…')">Edit</button></td>
  </tr>`).join('');
}
renderAdminProjTb(ADMIN_PROJS.map(p=>({t:p.t,l:p.l.toLowerCase(),a:p.a,v:p.v,r:p.r,s:p.s})));

async function loadAdmin(){
  if(!currentUser || currentUser.role!=='admin') return;
  try{
    const stats = await apiFetch('/admin/stats');
    document.querySelectorAll('#admin .astat-n')[0].textContent = stats.total_users.toLocaleString();
    document.querySelectorAll('#admin .astat-n')[1].textContent = stats.active_projects;
    const users = await apiFetch('/admin/users');
    document.getElementById('users-tb').innerHTML = users.map(u=>`
      <tr>
        <td style="font-weight:500;">${u.name}</td>
        <td style="color:var(--text3);">${u.email}</td>
        <td>${new Date(u.created_at).toLocaleDateString()}</td><td>${u.points}</td>
        <td><span class="pill ${statusClass[u.status]||'pill-a'}">${u.status}</span></td>
        <td><button class="btn-sm" onclick="toast('Editing ${u.name}…')">Edit</button></td>
      </tr>`).join('');
    const projs = await apiFetch('/admin/projects');
    renderAdminProjTb(projs.map(p=>({t:p.title,l:p.level,a:p.author,v:formatViews(p.views),r:p.stars,s:p.status})));
  }catch(e){ /* keep static demo admin data */ }
}
loadAdmin();
