'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   BUILDER — full drag, drop, connect, template, save
══════════════════════════════════════════════════════════════════════════*/
let nodes=[], edges=[], dragData=null, connMode=false, connFirst=null, nodeSeq=0;

// Drag from palette
document.querySelectorAll('.comp-btn[draggable]').forEach(btn=>{
  btn.addEventListener('dragstart',e=>{
    dragData={c:btn.dataset.c, e:btn.dataset.e};
  });
});

const bcanvas=document.getElementById('bcanvas');
bcanvas.addEventListener('dragover',e=>e.preventDefault());
bcanvas.addEventListener('drop',e=>{
  e.preventDefault();
  if(!dragData)return;
  const r=bcanvas.getBoundingClientRect();
  const x=Math.max(4, e.clientX-r.left-55);
  const y=Math.max(44, e.clientY-r.top-16);
  addNode(dragData.c, dragData.e, x, y);
  dragData=null;
});

function addNode(name,emoji,x,y){
  document.getElementById('canvas-hint').style.display='none';
  const id='nd_'+(++nodeSeq);
  const el=document.createElement('div');
  el.className='placed'; el.id=id;
  el.style.left=x+'px'; el.style.top=y+'px';
  el.innerHTML=`<span>${emoji}</span><span>${name}</span><span class="del" onclick="removeNode('${id}')">✕</span>`;
  if(connMode) el.addEventListener('click',()=>handleConnClick(id));
  makeDraggable(el,id);
  document.getElementById('canvas-nodes').appendChild(el);
  nodes.push({id,name,emoji,x,y});
  updateInfo();
}

function makeDraggable(el, id){
  let sx,sy,moving=false;
  el.addEventListener('mousedown',e=>{
    if(e.target.classList.contains('del'))return;
    if(connMode){handleConnClick(id);return;}
    e.preventDefault();
    sx=e.clientX-el.offsetLeft; sy=e.clientY-el.offsetTop;
    moving=true;
    document.addEventListener('mousemove',mm);
    document.addEventListener('mouseup',mu);
  });
  function mm(e){
    if(!moving)return;
    const nx=Math.max(0,e.clientX-sx);
    const ny=Math.max(44,e.clientY-sy);
    el.style.left=nx+'px'; el.style.top=ny+'px';
    const n=nodes.find(n=>n.id===id);
    if(n){n.x=nx;n.y=ny;}
    renderEdges();
  }
  function mu(){moving=false;document.removeEventListener('mousemove',mm);document.removeEventListener('mouseup',mu);}
}

function handleConnClick(id){
  if(!connFirst){
    connFirst=id;
    document.getElementById(id).classList.add('sel');
    showConnStatus(`Select second node to connect from <strong>${nodes.find(n=>n.id===id).name}</strong>`);
  } else {
    if(connFirst===id){connFirst=null;clearSelNodes();showConnStatus('');return;}
    // Check duplicate
    if(!edges.find(e=>(e.a===connFirst&&e.b===id)||(e.a===id&&e.b===connFirst))){
      edges.push({a:connFirst,b:id,id:'e'+(Date.now())});
      renderEdges();
      toast('Connection added');
    }
    document.getElementById(connFirst)?.classList.remove('sel');
    connFirst=null;
    showConnStatus('Click a node to start a new connection');
  }
}

function showConnStatus(msg){
  const el=document.getElementById('conn-status');
  el.style.display=msg?'block':'none';
  el.innerHTML=msg;
}
function clearSelNodes(){document.querySelectorAll('.placed.sel').forEach(n=>n.classList.remove('sel'));}

function renderEdges(){
  const svg=document.getElementById('canvas-svg');
  svg.innerHTML='<defs><marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="rgba(99,180,255,0.55)"/></marker></defs>';
  edges.forEach(e=>{
    const na=nodes.find(n=>n.id===e.a);
    const nb=nodes.find(n=>n.id===e.b);
    if(!na||!nb)return;
    const ea=document.getElementById(e.a);
    const eb=document.getElementById(e.b);
    if(!ea||!eb)return;
    const x1=na.x+(ea.offsetWidth||90)/2;
    const y1=na.y+(ea.offsetHeight||30)/2;
    const x2=nb.x+(eb.offsetWidth||90)/2;
    const y2=nb.y+(eb.offsetHeight||30)/2;
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',x1);line.setAttribute('y1',y1);
    line.setAttribute('x2',x2);line.setAttribute('y2',y2);
    line.setAttribute('stroke','rgba(99,180,255,0.45)');
    line.setAttribute('stroke-width','1.5');
    line.setAttribute('stroke-dasharray','5 3');
    line.setAttribute('marker-end','url(#ah)');
    line.style.animation='flow 2s linear infinite';
    svg.appendChild(line);
  });
}

function toggleConnMode(){
  connMode=!connMode;
  connFirst=null;clearSelNodes();
  document.getElementById('bcanvas').classList.toggle('conn-mode',connMode);
  const btn=document.getElementById('conn-btn');
  btn.textContent=connMode?'🔗 Connecting…':'🔗 Connect';
  btn.style.borderColor=connMode?'var(--accent2)':'';
  btn.style.color=connMode?'var(--accent3)':'';
  showConnStatus(connMode?'Click a node to start connecting':'');
}

function clearConnections(){edges=[];renderEdges();toast('Connections cleared');}

function removeNode(id){
  document.getElementById(id)?.remove();
  nodes=nodes.filter(n=>n.id!==id);
  edges=edges.filter(e=>e.a!==id&&e.b!==id);
  renderEdges();
  if(nodes.length===0)document.getElementById('canvas-hint').style.display='flex';
  updateInfo();
}

function clearCanvas(){
  document.getElementById('canvas-nodes').innerHTML='';
  document.getElementById('canvas-svg').innerHTML='';
  nodes=[];edges=[];nodeSeq=0;connFirst=null;connMode=false;
  document.getElementById('bcanvas').classList.remove('conn-mode');
  document.getElementById('conn-btn').textContent='🔗 Connect';
  document.getElementById('conn-btn').style.borderColor='';
  document.getElementById('conn-btn').style.color='';
  document.getElementById('canvas-hint').style.display='flex';
  showConnStatus('');
  updateInfo();
}
function updateInfo(){
  document.getElementById('canvas-info').textContent=nodes.length+' node'+(nodes.length!==1?'s':'')+', '+edges.length+' connection'+(edges.length!==1?'s':'');
}
function undoNode(){if(nodes.length){removeNode(nodes[nodes.length-1].id);}}
async function saveArch(){
  const nm=prompt('Architecture name:','My Architecture '+Date.now().toString().slice(-4));
  if(!nm)return;
  const sl=document.getElementById('saved-archs');
  const d=document.createElement('div');
  d.className='saved-item';
  d.innerHTML=`<span style="font-size:15px;">💾</span><span style="font-size:13px;font-weight:600;color:var(--text);flex:1;">${nm}</span><span style="font-size:11.5px;color:var(--text3);">${nodes.length} nodes · ${edges.length} connections · just now</span>`;
  if(!sl.querySelector('.sect-title')){const h=document.createElement('div');h.className='sect-title';h.style.marginBottom='.75rem';h.textContent='Saved Architectures';sl.prepend(h);}
  sl.appendChild(d);
  if(currentUser){
    try{
      await apiFetch('/dashboard/architectures', {method:'POST', body:JSON.stringify({name:nm, nodes, edges})});
      toast('Architecture saved to your account!');
      loadDashboard();
      return;
    }catch(e){ /* fall through to local-only save */ }
  }
  toast('Architecture saved! (sign in to save to your account)');
}
function exportArch(){
  const out={nodes:nodes.map(n=>({name:n.name,emoji:n.emoji})),edges:edges.map(e=>({from:nodes.find(n=>n.id===e.a)?.name,to:nodes.find(n=>n.id===e.b)?.name}))};
  toast('Export:\n'+JSON.stringify(out,null,2).slice(0,120)+'…');
}

// Templates
const TPLS={
  micro:[{c:'CDN',e:'🌐',x:190,y:55},{c:'Load Balancer',e:'⚖️',x:190,y:120},{c:'API Gateway',e:'🔀',x:190,y:188},{c:'Auth Service',e:'🔐',x:50,y:270},{c:'User Service',e:'⚙️',x:190,y:270},{c:'Feed Service',e:'⚙️',x:330,y:270},{c:'Cache',e:'⚡',x:50,y:355},{c:'Database',e:'🗄️',x:190,y:355},{c:'Message Queue',e:'📨',x:330,y:355},{c:'Monitoring',e:'📊',x:390,y:120}],
  event:[{c:'API Gateway',e:'🔀',x:165,y:55},{c:'Message Queue',e:'📨',x:165,y:140},{c:'Worker A',e:'⚙️',x:45,y:230},{c:'Worker B',e:'⚙️',x:165,y:230},{c:'Worker C',e:'⚙️',x:285,y:230},{c:'Database',e:'🗄️',x:100,y:320},{c:'Cache',e:'⚡',x:245,y:320}],
  chat:[{c:'CDN',e:'🌐',x:195,y:50},{c:'Load Balancer',e:'⚖️',x:195,y:120},{c:'Auth Service',e:'🔐',x:60,y:200},{c:'Chat Service',e:'⚙️',x:195,y:200},{c:'Notification',e:'📊',x:330,y:200},{c:'Message Queue',e:'📨',x:195,y:285},{c:'Database',e:'🗄️',x:80,y:370},{c:'Cache',e:'⚡',x:220,y:370},{c:'Storage',e:'💾',x:360,y:285}],
  cdn:[{c:'DNS',e:'🛜',x:190,y:50},{c:'CDN',e:'🌐',x:190,y:120},{c:'Load Balancer',e:'⚖️',x:190,y:200},{c:'API Gateway',e:'🔀',x:190,y:280},{c:'Rate Limiter',e:'🚦',x:50,y:280},{c:'Microservice',e:'⚙️',x:100,y:370},{c:'Microservice',e:'⚙️',x:280,y:370},{c:'Monitoring',e:'📊',x:370,y:200}],
};
const TPL_EDGES={
  micro:[[0,1],[1,2],[2,3],[2,4],[2,5],[3,6],[4,7],[5,8]],
  event:[[0,1],[1,2],[1,3],[1,4],[2,5],[3,5],[4,6]],
  chat:[[0,1],[1,2],[1,3],[1,4],[3,5],[5,6],[5,7],[3,8]],
  cdn:[[0,1],[1,2],[2,4],[2,3],[3,5],[3,6],[2,7]],
};
function loadTpl(k){
  clearCanvas();
  TPLS[k].forEach(n=>addNode(n.c,n.e,n.x,n.y));
  // Add edges after DOM settles
  setTimeout(()=>{
    (TPL_EDGES[k]||[]).forEach(([ai,bi])=>{
      const na=nodes[ai],nb=nodes[bi];
      if(na&&nb) edges.push({a:na.id,b:nb.id,id:'e'+(Date.now()+Math.random())});
    });
    renderEdges();updateInfo();
  },60);
}
