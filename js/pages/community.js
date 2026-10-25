'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   COMMUNITY
══════════════════════════════════════════════════════════════════════════*/
let posts=[
  {author:'priya_sys',color:'#D36A2D',title:'How do you handle eventual consistency in microservices?',body:'Working on a distributed order system. Struggling with consistency across 5 services. Saga vs 2PC — share your experience!',likes:142,comments:38,time:'2h ago',category:'trending'},
  {author:'arch_master',color:'#DA4E3E',title:'My journey designing a system for 10M concurrent users',body:"After 3 years at a unicorn, here's what I learned about scaling Postgres, Kafka, and Redis together. Long thread 🧵",likes:389,comments:72,time:'5h ago',category:'trending'},
  {author:'distributed_dev',color:'#B73223',title:'How we cut p99 latency by 80% with smart caching',body:'Our API was at 800ms p99. After a multi-layer Redis + CDN caching strategy, now at 160ms. Full breakdown inside.',likes:256,comments:44,time:'1d ago',category:'latest'},
  {author:'kafka_queen',color:'#A92E20',title:'Kafka vs Kinesis vs Pulsar: 3-month honest comparison',body:'Tested all three at 1M events/sec for 3 months. Cost, latency, operational complexity — honest results, no sponsorship.',likes:512,comments:91,time:'2d ago',category:'trending'},
  {author:'newbie_arch',color:'#7C7673',title:'Best resources for learning system design from scratch?',body:'Just starting my system design journey. Any recommended books, courses, or projects for a complete beginner?',likes:28,comments:15,time:'3h ago',category:'latest'},
  {author:'scale_ninja',color:'#f43f5e',title:'Hot take: shared databases in microservices are fine',body:'The complexity of DB-per-service is often not worth it for small teams. Fight me in the comments.',likes:198,comments:67,time:'6h ago',category:'trending'},
];
let postF='all';
let npOpen=false;
function setPostF(f,el){
  postF=f;
  document.querySelectorAll('#post-filter .ptab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');renderPosts();
}
function renderPosts(){
  const filtered = postF==='all' ? posts : posts.filter(p=>p.category===postF);
  document.getElementById('post-list').innerHTML=filtered.map((p,i)=>`
    <div class="post">
      <div class="post-hdr">
        <div class="post-av" style="background:${p.color};">${p.author.slice(0,2).toUpperCase()}</div>
        <div><div class="post-author">${p.author}</div><div class="post-time">${p.time}</div></div>
      </div>
      <div class="post-title">${p.title}</div>
      <div class="post-body">${p.body}</div>
      <div class="post-foot">
        <span class="pact" onclick="likePost(${i},this)">❤️ <span>${p.likes}</span></span>
        <span class="pact">💬 ${p.comments}</span>
        <span class="pact">🔗 Share</span>
        <span class="pact" style="margin-left:auto;" onclick="toast('Post bookmarked!')">🔖 Save</span>
      </div>
    </div>`).join('');
}
function likePost(i,el){
  posts[i].likes++;el.querySelector('span').textContent=posts[i].likes;
  if(posts[i].id) apiFetch(`/forum/posts/${posts[i].id}/like`, {method:'POST'}).catch(()=>{});
}
renderPosts();

async function loadPostsFromApi(){
  try{
    const data = await apiFetch('/forum/posts');
    if(Array.isArray(data)){
      posts.length = 0;
      const palette=['#D36A2D','#DA4E3E','#B73223','#A92E20','#7C7673','#f43f5e','#DA4E3E'];
      data.forEach((p,i)=>posts.push({
        id:p.id, author:p.author_name, color:palette[i%palette.length], title:p.title,
        body:p.body, likes:p.likes, comments:p.comments,
        time:new Date(p.created_at).toLocaleString(), category:p.category
      }));
      renderPosts();
    }
  }catch(e){ /* keep static fallback data */ }
}
loadPostsFromApi();

document.getElementById('hot-tags').innerHTML='#kafka #microservices #cap-theorem #sharding #redis #kubernetes #raft #cqrs #grpc #cassandra #dynamo #consistency'.split(' ').map(t=>`<span class="htag">${t}</span>`).join('');

function toggleNewPost(){npOpen=!npOpen;document.getElementById('np-form').classList.toggle('on',npOpen);}
async function submitPost(){
  const title=document.getElementById('np-title').value.trim();
  const body=document.getElementById('np-body').value.trim();
  if(!title||!body){toast('Please fill in both the title and body.');return;}
  if(!currentUser){ toast('Please sign in to post.'); openAuthModal('login'); return; }
  try{
    const p = await apiFetch('/forum/posts', {method:'POST', body:JSON.stringify({title,body})});
    posts.unshift({id:p.id, author:p.author_name, color:'#DA4E3E', title:p.title, body:p.body, likes:p.likes, comments:p.comments, time:'Just now', category:p.category});
  }catch(e){
    posts.unshift({author:currentUser.name,color:'#DA4E3E',title,body,likes:0,comments:0,time:'Just now',category:'latest'});
  }
  document.getElementById('np-title').value='';
  document.getElementById('np-body').value='';
  toggleNewPost();
  setPostF('all',document.querySelector('#post-filter .ptab'));
  toast('Post published! 🎉');
}
