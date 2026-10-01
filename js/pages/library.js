'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   LIBRARY
══════════════════════════════════════════════════════════════════════════*/
const PROJECTS=[
  {t:'URL Shortener',d:'100M+ redirects/day using consistent hashing, distributed counters, and Redis caching with sub-ms latency.',l:'advanced',time:'3h',stars:'4.8',views:'18.4k',topics:['Hashing','Redis','Zookeeper']},
  {t:'Real-Time Chat',d:'WhatsApp-style messaging with WebSockets, Kafka fan-out, and end-to-end encryption for 50M concurrent users.',l:'intermediate',time:'4h',stars:'4.7',views:'14.2k',topics:['WebSocket','Kafka','E2EE']},
  {t:'Rate Limiter Service',d:'Token bucket, sliding window, and fixed-window rate limiting for API protection. Redis-backed, distributed.',l:'beginner',time:'1h',stars:'4.6',views:'22.1k',topics:['Redis','Algorithms','API']},
  {t:'Distributed Cache',d:'Redis-like system with consistent hashing, LRU eviction, replication, and persistence across 100+ nodes.',l:'advanced',time:'5h',stars:'4.9',views:'11.7k',topics:['Hashing','Replication','LRU']},
  {t:'Search Autocomplete',d:'Typeahead suggestions using distributed tries, inverted indexes, and prefix caching at 100K QPS.',l:'intermediate',time:'3h',stars:'4.7',views:'9.8k',topics:['Trie','Elasticsearch','Cache']},
  {t:'Content Delivery Network',d:'Design Cloudflare-style CDN with PoP nodes, BGP Anycast, cache invalidation, and TLS termination.',l:'enterprise',time:'8h',stars:'5.0',views:'6.3k',topics:['CDN','BGP','TLS']},
  {t:'Payment System',d:'Stripe-like processing with idempotency keys, distributed transactions, ledger design, and fraud ML.',l:'enterprise',time:'10h',stars:'4.9',views:'8.9k',topics:['Transactions','Kafka','Idempotency']},
  {t:'Social Media Feed',d:'Facebook-style news feed with fan-out-on-write vs read, ML ranking, pagination, and ad injection.',l:'intermediate',time:'4h',stars:'4.8',views:'15.6k',topics:['Fan-out','Ranking','Caching']},
  {t:'File Storage Service',d:'S3-like object store with chunking, deduplication, cross-region replication, and presigned URLs.',l:'advanced',time:'6h',stars:'4.8',views:'10.2k',topics:['S3','Replication','Chunking']},
  {t:'Web Crawler',d:'Distributed BFS crawler with URL frontier, politeness policies, Bloom filter dedup, and Kafka coordination.',l:'advanced',time:'5h',stars:'4.7',views:'8.4k',topics:['BFS','Bloom Filter','Kafka']},
  {t:'Push Notification Service',d:'Multi-channel push (iOS, Android, email, SMS) with at-least-once delivery guarantees and templating.',l:'beginner',time:'2h',stars:'4.6',views:'19.8k',topics:['FCM','APNS','Kafka']},
  {t:'Ride Matching System',d:'Uber-like geospatial matching with H3/QuadTree indexing, ETA prediction, and surge pricing ML.',l:'enterprise',time:'9h',stars:'4.9',views:'7.1k',topics:['Geo','QuadTree','WebSocket']},
  {t:'Video Streaming Platform',d:'YouTube-like architecture: ABR encoding pipeline, CDN distribution, comment system, and recommendations.',l:'enterprise',time:'12h',stars:'5.0',views:'5.8k',topics:['HLS','CDN','Encoding']},
  {t:'API Gateway',d:'Custom gateway with routing, auth middleware, rate limiting, circuit breaking, and request tracing.',l:'intermediate',time:'3.5h',stars:'4.7',views:'12.3k',topics:['Proxy','Auth','Tracing']},
  {t:'Distributed Job Scheduler',d:'Celery/Airflow-like scheduler with cron jobs, DAG dependencies, retries, and distributed workers.',l:'intermediate',time:'4h',stars:'4.6',views:'9.2k',topics:['DAG','Redis','Workers']},
  {t:'Pub/Sub Message Broker',d:'Kafka-like broker with partitioning, consumer groups, at-least-once delivery, and compacted topics.',l:'advanced',time:'6h',stars:'4.8',views:'8.7k',topics:['Partitioning','Replication','Offsets']},
  {t:'Distributed ID Generator',d:'Snowflake-style unique ID generation across distributed nodes without coordination overhead.',l:'beginner',time:'1.5h',stars:'4.7',views:'25.4k',topics:['Snowflake','Clocks','UUID']},
  {t:'E-Commerce Order System',d:'Full order lifecycle with saga-pattern distributed transactions, inventory reservation, and fulfillment.',l:'advanced',time:'7h',stars:'4.8',views:'9.3k',topics:['Saga','Events','ACID']},
];
let libF='all';
function setLibF(f,el){
  libF=f;
  document.querySelectorAll('#library .chip').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');renderLib();
}
function renderLib(){
  const q=document.getElementById('lib-q').value.toLowerCase();
  const cls={beginner:'t-b',intermediate:'t-i',advanced:'t-a',enterprise:'t-e'};
  const lbl={beginner:'Beginner',intermediate:'Intermediate',advanced:'Advanced',enterprise:'Enterprise'};
  const filtered=PROJECTS.filter(p=>(libF==='all'||p.l===libF)&&(!q||p.t.toLowerCase().includes(q)||p.d.toLowerCase().includes(q)));
  document.getElementById('lib-grid').innerHTML = filtered.length===0
    ? `<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--text3);">No projects match your search.</div>`
    : filtered.map(p=>`
    <div class="card">
      <span class="tag ${cls[p.l]}">${lbl[p.l]}</span>
      <div style="font-family:var(--fd);font-size:1rem;font-weight:700;color:#fff;margin-bottom:.38rem;">${p.t}</div>
      <p style="font-size:12.5px;color:var(--text2);line-height:1.62;">${p.d}</p>
      <div class="topic-chips">${p.topics.map(t=>`<span class="tc">${t}</span>`).join('')}</div>
      <div class="card-foot"><span class="cm">⏱ ${p.time}</span><span class="cm">★ ${p.stars}</span><span class="cm">👁 ${p.views}</span><span style="margin-left:auto;color:var(--accent2);">→</span></div>
    </div>`).join('');
}
renderLib();

async function loadProjectsFromApi(){
  try{
    const data = await apiFetch('/projects');
    if(Array.isArray(data) && data.length){
      PROJECTS.length = 0;
      data.forEach(p=>PROJECTS.push({
        id:p.id, t:p.title, d:p.description, l:p.level, time:p.time_estimate,
        stars:String(p.stars), views:formatViews(p.views), topics:p.topics
      }));
      renderLib();
    }
  }catch(e){ /* keep static fallback data */ }
}
function formatViews(n){ return n>=1000 ? (n/1000).toFixed(1)+'k' : String(n); }
loadProjectsFromApi();
