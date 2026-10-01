'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   LEARNING HUB
══════════════════════════════════════════════════════════════════════════*/
const TOPICS={
  lb:{title:'⚖️ Load Balancing',html:`
    <h2 style="font-family:var(--fd);font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:.9rem;">Load Balancing</h2>
    <p style="color:var(--text2);font-size:13.5px;line-height:1.8;margin-bottom:.9rem;">Load balancing distributes incoming traffic across multiple servers to prevent bottlenecks and ensure high availability. The algorithm choice significantly impacts latency, resource utilization, and session handling.</p>
    <div class="concept-grid">
      <div class="concept-card"><div class="concept-title" style="color:var(--accent2);">Round Robin</div><div class="concept-body">Requests distributed sequentially: A→B→C→A→B→C. Simple but ignores server capacity or current load. Best for homogeneous servers.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--em);">Least Connections</div><div class="concept-body">Routes to the server with fewest active connections. Ideal for long-lived connections — WebSockets, database pools, streaming sessions.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--am);">Consistent Hashing</div><div class="concept-body">hash(client_ip) → same server always. Enables session affinity without a lookup store. Used by CDNs, Redis Cluster, Cassandra for shard routing.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--violet);">Weighted Round Robin</div><div class="concept-body">Proportional traffic by server capacity. 16-core server gets 2× traffic vs 8-core. Handles heterogeneous fleets with mixed hardware generations.</div></div>
    </div>
    <div class="viz-box" style="margin-top:1rem;">
      <div style="font-size:12px;color:var(--text3);margin-bottom:.75rem;font-family:var(--fm);">// Consistent hashing with virtual nodes (Python)</div>
      <div class="code-b" style="margin-top:0;">ring = SortedDict() <span class="cmt"># hash → server_id</span>
<br><span class="kw">for</span> server <span class="kw">in</span> servers:
<br>  <span class="kw">for</span> v <span class="kw">in</span> range(150): <span class="cmt"># 150 virtual nodes per server</span>
<br>    h = md5(f<span class="str">"{server}-{v}"</span>).hexdigest()
<br>    ring[h] = server
<br>
<br><span class="kw">def</span> route(request_ip):
<br>  h = md5(request_ip).hexdigest()
<br>  <span class="kw">return</span> ring.ceiling_key(h) <span class="cmt"># nearest clockwise node</span></div>
    </div>
    <div style="margin-top:1rem;padding:1rem;background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.18);border-radius:8px;">
      <div style="font-size:13px;font-weight:700;color:var(--accent3);margin-bottom:.4rem;">💡 Key Insight</div>
      <div style="font-size:12.5px;color:var(--text2);line-height:1.7;">Adding/removing a server with consistent hashing only remaps <strong style="color:var(--text);">1/N of keys</strong> — vs. <strong style="color:var(--text);">all keys</strong> with modulo hashing. This is critical for zero-downtime scaling of distributed caches.</div>
    </div>`},
  cache:{title:'⚡ Caching Strategies',html:`
    <h2 style="font-family:var(--fd);font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:.9rem;">Caching Strategies</h2>
    <p style="color:var(--text2);font-size:13.5px;line-height:1.8;margin-bottom:.9rem;">Caching reduces latency and database load by serving frequently accessed data from fast storage (Redis, Memcached). Strategy choice depends on read/write ratios and consistency requirements.</p>
    <div class="concept-grid">
      <div class="concept-card"><div class="concept-title" style="color:var(--accent2);">Cache-Aside (Lazy)</div><div class="concept-body">App checks cache → miss → query DB → populate cache. Most common. Risk: <strong style="color:var(--text);">thundering herd</strong> on cold start — use jittered TTL to spread load.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--em);">Write-Through</div><div class="concept-body">Writes go to cache AND database synchronously. Strong consistency but adds write latency. Good for read-heavy, write-occasional data like product catalogs.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--am);">Write-Behind (Async)</div><div class="concept-body">Writes go to cache immediately; DB updated asynchronously. Very fast writes. Risk: data loss if cache fails before flush. Use with durable write-ahead log.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--rose);">Read-Through</div><div class="concept-body">Cache sits transparently in front of DB. On miss, cache loads from DB automatically. Simplifies application code but less flexible than cache-aside.</div></div>
    </div>
    <div class="viz-box" style="margin-top:1rem;">
      <div class="code-b" style="margin-top:0;"><span class="kw">def</span> get_user(user_id):
<br>  key = f<span class="str">"user:{user_id}"</span>
<br>  cached = redis.get(key)
<br>  <span class="kw">if</span> cached: <span class="kw">return</span> json.loads(cached) <span class="cmt"># cache hit</span>
<br>
<br>  user = db.query(<span class="str">"SELECT * FROM users WHERE id=?"</span>, user_id)
<br>  ttl = 3600 + random.randint(0, 600) <span class="cmt"># jitter to avoid stampede</span>
<br>  redis.setex(key, ttl, json.dumps(user))
<br>  <span class="kw">return</span> user</div>
    </div>
    <div style="margin-top:1rem;padding:1rem;background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.18);border-radius:8px;">
      <div style="font-size:13px;font-weight:700;color:var(--am);margin-bottom:.4rem;">⚠ Cache Invalidation</div>
      <div style="font-size:12.5px;color:var(--text2);line-height:1.7;">Phil Karlton: <em style="color:var(--text);">"There are only two hard things in CS: cache invalidation and naming things."</em> Strategies: TTL expiry, event-driven invalidation via Kafka, versioned cache keys, and cache-busting on mutations.</div>
    </div>`},
  shard:{title:'🗃️ Database Sharding',html:`
    <h2 style="font-family:var(--fd);font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:.9rem;">Database Sharding</h2>
    <p style="color:var(--text2);font-size:13.5px;line-height:1.8;margin-bottom:.9rem;">Sharding (horizontal partitioning) splits a large database across multiple servers. Each shard holds a subset of rows. When a single DB can't handle the load — typically >5TB or >100K writes/sec — sharding is necessary.</p>
    <div class="concept-grid">
      <div class="concept-card"><div class="concept-title" style="color:var(--accent2);">Range Sharding</div><div class="concept-body">userId 1–1M → Shard 1, 1M–2M → Shard 2. Simple to reason about. Problem: hotspots — sequential IDs mean most writes hit the last shard.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--em);">Hash Sharding</div><div class="concept-body">shard = hash(userId) % N. Even distribution eliminates hotspots. Problem: adding shards requires rehashing all keys (use consistent hashing to minimize remapping).</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--am);">Directory Sharding</div><div class="concept-body">Lookup table maps entity → shard. Maximum flexibility; can rebalance shards without rehashing. Extra latency for every request to consult the directory.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--violet);">Geo Sharding</div><div class="concept-body">Shard by geography: EU users → EU shard, US → US shard. Reduces latency and satisfies data residency laws (GDPR). Used by Uber, Airbnb, Shopify.</div></div>
    </div>
    <div class="viz-box" style="margin-top:1rem;">
      <div class="code-b" style="margin-top:0;"><span class="cmt">// Cross-shard query problem</span>
<br><span class="cmt">// "Find all orders for user 42 in the last 7 days"</span>
<br><span class="cmt">// If sharded by order_id, must query ALL shards:</span>
<br>results = []
<br><span class="kw">for</span> shard <span class="kw">in</span> all_shards:
<br>  results += shard.query(<span class="str">"SELECT * WHERE user_id=42 AND ..."</span>)
<br>
<br><span class="cmt">// Solution: shard by user_id for user-centric queries</span>
<br><span class="cmt">// Or maintain a secondary index shard for cross-shard access</span></div>
    </div>`},
  repl:{title:'🔄 Database Replication',html:`
    <h2 style="font-family:var(--fd);font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:.9rem;">Database Replication</h2>
    <p style="color:var(--text2);font-size:13.5px;line-height:1.8;margin-bottom:.9rem;">Replication maintains copies of data across multiple nodes for fault tolerance, read scaling, and geographic distribution. The core tradeoff: stronger consistency ↔ higher latency.</p>
    <div class="concept-grid">
      <div class="concept-card"><div class="concept-title" style="color:var(--accent2);">Leader-Follower</div><div class="concept-body">All writes → leader, async replicated to followers. Followers serve reads. Simple. Leader is SPOF. Used by: PostgreSQL streaming replication, MySQL binlog.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--em);">Multi-Leader</div><div class="concept-body">Multiple leaders accept writes simultaneously. Requires conflict resolution (LWW, CRDTs, custom merge). Used for multi-region active-active setups.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--am);">Leaderless (Dynamo)</div><div class="concept-body">Any node accepts reads/writes. Quorum: W + R > N guarantees overlap. No SPOF. Used by: Cassandra (W=1,R=1 → fast; W=2,R=2 → consistent), DynamoDB.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--violet);">Sync vs Async</div><div class="concept-body">Sync: leader waits for follower ACK before confirming write. Zero data loss, higher latency (+5–50ms). Async: returns immediately, may lose recent writes on failover.</div></div>
    </div>
    <div style="margin-top:1rem;padding:1rem;background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.18);border-radius:8px;">
      <div style="font-size:13px;font-weight:700;color:var(--em);margin-bottom:.4rem;">🔢 Quorum Math (Cassandra)</div>
      <div style="font-size:12.5px;color:var(--text2);line-height:1.75;font-family:var(--fm);">N=3 replicas<br>W=2 (write to 2) + R=2 (read from 2) > N=3 ✓ → strong consistency<br>W=1 + R=1 → eventual consistency (max performance)<br>W=3 + R=1 → writes always consistent (slow writes)</div>
    </div>`},
  event:{title:'📨 Event-Driven Architecture',html:`
    <h2 style="font-family:var(--fd);font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:.9rem;">Event-Driven Architecture</h2>
    <p style="color:var(--text2);font-size:13.5px;line-height:1.8;margin-bottom:.9rem;">Event-driven systems communicate through immutable events rather than direct calls, decoupling producers from consumers. This enables independent scaling, resilience, and temporal decoupling.</p>
    <div class="concept-grid">
      <div class="concept-card"><div class="concept-title" style="color:var(--accent2);">Event Sourcing</div><div class="concept-body">State = replay of immutable events. Every change is stored as an event. Full audit trail, time travel debugging, temporal queries. Used in: banking, e-commerce order history.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--em);">CQRS</div><div class="concept-body">Separate read and write models. Commands mutate state (write side). Queries read from optimized read models updated via events. Maximizes both read and write performance independently.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--am);">Saga Pattern</div><div class="concept-body">Distributed transaction as a sequence of local transactions + compensating rollbacks. Choreography (event-driven) or Orchestration (central coordinator). Solves 2PC's blocking problem.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--violet);">Outbox Pattern</div><div class="concept-body">Write event to an outbox table in the same DB transaction as the state change. A CDC poller (Debezium) publishes to Kafka. Guarantees exactly-once delivery without 2PC.</div></div>
    </div>
    <div class="viz-box" style="margin-top:1rem;">
      <div class="code-b" style="margin-top:0;"><span class="cmt">// Kafka producer (Order Service)</span>
<br>producer.send(topic=<span class="str">"order-events"</span>, key=order_id,
<br>  value={<span class="str">"type"</span>:<span class="str">"ORDER_PLACED"</span>, <span class="str">"orderId"</span>:123,
<br>         <span class="str">"userId"</span>:456, <span class="str">"items"</span>:[...], <span class="str">"total"</span>:99.99})
<br>
<br><span class="cmt">// Consumer (Inventory Service)</span>
<br>@consumer(topics=[<span class="str">"order-events"</span>], group=<span class="str">"inventory"</span>)
<br><span class="kw">def</span> handle(event):
<br>  <span class="kw">if</span> event[<span class="str">"type"</span>] == <span class="str">"ORDER_PLACED"</span>:
<br>    reserve_inventory(event[<span class="str">"items"</span>]) <span class="cmt"># idempotent</span></div>
    </div>`},
  micro:{title:'⚙️ Microservices Patterns',html:`
    <h2 style="font-family:var(--fd);font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:.9rem;">Microservices Patterns</h2>
    <p style="color:var(--text2);font-size:13.5px;line-height:1.8;margin-bottom:.9rem;">Microservices decompose a monolith into independently deployable services, each owning its data. The architecture introduces new challenges: resilience patterns are essential to prevent cascade failures.</p>
    <div class="concept-grid">
      <div class="concept-card"><div class="concept-title" style="color:var(--accent2);">Circuit Breaker</div><div class="concept-body">State machine: Closed → Open → Half-Open. On repeated failures, open the circuit: fast-fail requests with a fallback. Prevents cascade failure. Implementations: Hystrix, Resilience4j.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--em);">Service Mesh (Istio)</div><div class="concept-body">Sidecar proxies handle mTLS, retries, timeouts, circuit breaking, and distributed tracing transparently. Services don't implement this logic. Envoy proxy is the standard sidecar.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--am);">Saga Pattern</div><div class="concept-body">Distributed transactions via compensating actions. Choreography: services react to events. Orchestration: a Saga coordinator sends commands. Avoids distributed locks and 2PC entirely.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--violet);">Bulkhead Pattern</div><div class="concept-body">Isolate resources (thread pools, connection pools) per downstream service. If one downstream is slow/down, it can't exhaust shared resources for other services. Named after ship hull compartments.</div></div>
    </div>
    <div style="margin-top:1rem;padding:1rem;background:rgba(244,63,94,.07);border:1px solid rgba(244,63,94,.18);border-radius:8px;">
      <div style="font-size:13px;font-weight:700;color:var(--rose);margin-bottom:.4rem;">⚠ Microservices Tax</div>
      <div style="font-size:12.5px;color:var(--text2);line-height:1.7;">Microservices add complexity: distributed tracing, service discovery, inter-service latency, data consistency, and operational overhead. Sam Newman's rule: <em style="color:var(--text);">start as a monolith, extract services when you feel the pain.</em></div>
    </div>`},
  dist:{title:'🌐 Distributed Systems',html:`
    <h2 style="font-family:var(--fd);font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:.9rem;">Distributed Systems Fundamentals</h2>
    <p style="color:var(--text2);font-size:13.5px;line-height:1.8;margin-bottom:.9rem;">Distributed systems coordinate multiple computers to appear as a unified system. Understanding fundamental impossibility theorems shapes every architectural decision at scale.</p>
    <div class="concept-grid">
      <div class="concept-card"><div class="concept-title" style="color:var(--accent2);">CAP Theorem</div><div class="concept-body">Can't simultaneously guarantee Consistency + Availability + Partition Tolerance. During a network partition, choose: CP (PostgreSQL, HBase — returns error) or AP (Cassandra, DynamoDB — returns stale data).</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--em);">Raft Consensus</div><div class="concept-body">Leader election + log replication. Majority quorum (⌊N/2⌋+1) required for writes. Leader handles all writes; followers replicate. Used by: etcd, CockroachDB, TiKV. Easier to understand than Paxos.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--am);">Vector Clocks</div><div class="concept-body">Track causality without synchronized clocks. Each process maintains a vector of logical timestamps. Detect happens-before relationships and conflicting concurrent writes. Used by: Riak, DynamoDB.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--rose);">Two-Phase Commit</div><div class="concept-body">Phase 1: coordinator asks all participants to prepare and lock resources. Phase 2: if all agree, commit; else abort. Blocking on coordinator crash. Avoid at scale — prefer Saga or Outbox pattern.</div></div>
    </div>
    <div style="margin-top:1rem;padding:1rem;background:rgba(59,130,246,.07);border:1px solid rgba(59,130,246,.18);border-radius:8px;">
      <div style="font-size:13px;font-weight:700;color:var(--accent3);margin-bottom:.4rem;">💡 PACELC Extension to CAP</div>
      <div style="font-size:12.5px;color:var(--text2);line-height:1.75;">When there's no partition (normal operation): choose between <strong style="color:var(--text);">Latency vs Consistency</strong>. DynamoDB: PA/EL (available+low latency). CockroachDB: PC/EC (consistent, higher latency). Cassandra: PA/EL by default, tunable.</div>
    </div>`},
  auth:{title:'🔐 Auth & Security',html:`
    <h2 style="font-family:var(--fd);font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:.9rem;">Authentication & Authorization</h2>
    <p style="color:var(--text2);font-size:13.5px;line-height:1.8;margin-bottom:.9rem;">Modern auth must balance security, scalability, and developer experience. JWT + OAuth 2.0 are the de facto standards. At scale, stateless verification is critical to avoid auth becoming a bottleneck.</p>
    <div class="concept-grid">
      <div class="concept-card"><div class="concept-title" style="color:var(--accent2);">JWT (Stateless)</div><div class="concept-body">Header.Payload.Signature. Services verify tokens locally with public key — no DB round-trip. Short expiry (15min access + 7day refresh). Revocation requires a blocklist (Redis) or short TTL.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--em);">OAuth 2.0 + OIDC</div><div class="concept-body">Authorization Code + PKCE for web/mobile. OIDC adds identity (id_token) on top of OAuth. Enables SSO across services. Use a dedicated auth server: Auth0, Keycloak, or self-hosted.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--am);">Rate Limiting</div><div class="concept-body">Token bucket (allows bursts) or sliding window log (precise) per user/IP/API key. Redis ZADD for sliding window. Return 429 with Retry-After header. Apply at API gateway layer.</div></div>
      <div class="concept-card"><div class="concept-title" style="color:var(--violet);">Zero Trust</div><div class="concept-body">"Never trust, always verify" — even inside the private network. mTLS between all services (via service mesh). No implicit trust from network location. Principle of least privilege enforced at API level.</div></div>
    </div>
    <div class="viz-box" style="margin-top:1rem;">
      <div class="code-b" style="margin-top:0;"><span class="cmt">// JWT verification middleware</span>
<br><span class="kw">def</span> verify_token(token: str) -> dict:
<br>  <span class="kw">try</span>:
<br>    payload = jwt.decode(token, PUBLIC_KEY,
<br>                         algorithms=[<span class="str">"RS256"</span>])
<br>    <span class="kw">if</span> payload[<span class="str">"exp"</span>] &lt; time.time():
<br>      <span class="kw">raise</span> TokenExpiredError()
<br>    <span class="kw">if</span> redis.get(f<span class="str">"blocklist:{payload['jti']}"</span>):
<br>      <span class="kw">raise</span> TokenRevokedError()
<br>    <span class="kw">return</span> payload
<br>  <span class="kw">except</span> jwt.InvalidTokenError <span class="kw">as</span> e:
<br>    <span class="kw">raise</span> UnauthorizedError(str(e))</div>
    </div>`},
};
const ARTICLES=[
  {t:'Consistent Hashing Explained with Animations',time:'12 min',level:'beginner',tag:'Fundamentals'},
  {t:'How Kafka Achieves Sub-Millisecond Latency',time:'18 min',level:'deep',tag:'Event-Driven'},
  {t:'Database Sharding: When, Why, and How',time:'22 min',level:'deep',tag:'Databases'},
  {t:'CAP Theorem in Practice: Real-World Examples',time:'15 min',level:'beginner',tag:'Distributed'},
  {t:'Circuit Breakers and Bulkhead Patterns',time:'10 min',level:'beginner',tag:'Resilience'},
  {t:'Designing for 99.999% Uptime (Five Nines)',time:'28 min',level:'deep',tag:'SRE'},
  {t:'Vector Clocks and Lamport Timestamps',time:'20 min',level:'deep',tag:'Distributed'},
  {t:'API Gateway Patterns: A Practical Guide',time:'14 min',level:'beginner',tag:'APIs'},
  {t:'The Dynamo Paper: Key Lessons for 2024',time:'25 min',level:'deep',tag:'Distributed'},
  {t:'Redis Internals: How It Actually Works',time:'16 min',level:'deep',tag:'Caching'},
  {t:'SQL vs NoSQL: Choosing the Right Database',time:'12 min',level:'beginner',tag:'Databases'},
  {t:'gRPC vs REST: When to Use Which',time:'11 min',level:'beginner',tag:'APIs'},
  {t:'The Outbox Pattern: Guaranteed Event Delivery',time:'14 min',level:'deep',tag:'Event-Driven'},
  {t:'Service Mesh with Istio: A Beginner\'s Guide',time:'18 min',level:'beginner',tag:'Microservices'},
];
let artF='all';
function artFilter(f,el){
  artF=f;
  document.querySelectorAll('#art-filter .ptab').forEach(t=>t.classList.remove('on'));
  el.classList.add('on');renderArts();
}
function renderArts(){
  const filtered=ARTICLES.filter(a=>artF==='all'||a.level===artF);
  document.getElementById('art-list').innerHTML=filtered.map((a,i)=>`
    <div class="art-item">
      <span class="art-num">${String(i+1).padStart(2,'0')}</span>
      <div style="flex:1;"><div class="art-title">${a.t}</div><div style="font-size:11px;color:var(--text3);margin-top:1px;">${a.tag}</div></div>
      <span class="art-badge">${a.level==='deep'?'Deep Dive':'Beginner'}</span>
      <span style="font-size:11.5px;color:var(--text3);margin-left:.9rem;white-space:nowrap;">${a.time}</span>
    </div>`).join('');
}
renderArts();

function openTopic(id){
  const t=TOPICS[id];if(!t)return;
  document.getElementById('learn-main').style.display='none';
  document.getElementById('topic-detail').classList.add('on');
  document.getElementById('topic-body').innerHTML=t.html;
}
function closeTopic(){
  document.getElementById('learn-main').style.display='block';
  document.getElementById('topic-detail').classList.remove('on');
}
