from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.models import Badge, Post, Project, User

PROJECTS = [
    ("URL Shortener", "100M+ redirects/day using consistent hashing, distributed counters, and Redis caching with sub-ms latency.", "advanced", "3h", 4.8, 18400, ["Hashing", "Redis", "Zookeeper"]),
    ("Real-Time Chat", "WhatsApp-style messaging with WebSockets, Kafka fan-out, and end-to-end encryption for 50M concurrent users.", "intermediate", "4h", 4.7, 14200, ["WebSocket", "Kafka", "E2EE"]),
    ("Rate Limiter Service", "Token bucket, sliding window, and fixed-window rate limiting for API protection. Redis-backed, distributed.", "beginner", "1h", 4.6, 22100, ["Redis", "Algorithms", "API"]),
    ("Distributed Cache", "Redis-like system with consistent hashing, LRU eviction, replication, and persistence across 100+ nodes.", "advanced", "5h", 4.9, 11700, ["Hashing", "Replication", "LRU"]),
    ("Search Autocomplete", "Typeahead suggestions using distributed tries, inverted indexes, and prefix caching at 100K QPS.", "intermediate", "3h", 4.7, 9800, ["Trie", "Elasticsearch", "Cache"]),
    ("Content Delivery Network", "Design Cloudflare-style CDN with PoP nodes, BGP Anycast, cache invalidation, and TLS termination.", "enterprise", "8h", 5.0, 6300, ["CDN", "BGP", "TLS"]),
    ("Payment System", "Stripe-like processing with idempotency keys, distributed transactions, ledger design, and fraud ML.", "enterprise", "10h", 4.9, 8900, ["Transactions", "Kafka", "Idempotency"]),
    ("Social Media Feed", "Facebook-style news feed with fan-out-on-write vs read, ML ranking, pagination, and ad injection.", "intermediate", "4h", 4.8, 15600, ["Fan-out", "Ranking", "Caching"]),
    ("File Storage Service", "S3-like object store with chunking, deduplication, cross-region replication, and presigned URLs.", "advanced", "6h", 4.8, 10200, ["S3", "Replication", "Chunking"]),
    ("Web Crawler", "Distributed BFS crawler with URL frontier, politeness policies, Bloom filter dedup, and Kafka coordination.", "advanced", "5h", 4.7, 8400, ["BFS", "Bloom Filter", "Kafka"]),
    ("Push Notification Service", "Multi-channel push (iOS, Android, email, SMS) with at-least-once delivery guarantees and templating.", "beginner", "2h", 4.6, 19800, ["FCM", "APNS", "Kafka"]),
    ("Ride Matching System", "Uber-like geospatial matching with H3/QuadTree indexing, ETA prediction, and surge pricing ML.", "enterprise", "9h", 4.9, 7100, ["Geo", "QuadTree", "WebSocket"]),
    ("Video Streaming Platform", "YouTube-like architecture: ABR encoding pipeline, CDN distribution, comment system, and recommendations.", "enterprise", "12h", 5.0, 5800, ["HLS", "CDN", "Encoding"]),
    ("API Gateway", "Custom gateway with routing, auth middleware, rate limiting, circuit breaking, and request tracing.", "intermediate", "3.5h", 4.7, 12300, ["Proxy", "Auth", "Tracing"]),
    ("Distributed Job Scheduler", "Celery/Airflow-like scheduler with cron jobs, DAG dependencies, retries, and distributed workers.", "intermediate", "4h", 4.6, 9200, ["DAG", "Redis", "Workers"]),
    ("Pub/Sub Message Broker", "Kafka-like broker with partitioning, consumer groups, at-least-once delivery, and compacted topics.", "advanced", "6h", 4.8, 8700, ["Partitioning", "Replication", "Offsets"]),
    ("Distributed ID Generator", "Snowflake-style unique ID generation across distributed nodes without coordination overhead.", "beginner", "1.5h", 4.7, 25400, ["Snowflake", "Clocks", "UUID"]),
    ("E-Commerce Order System", "Full order lifecycle with saga-pattern distributed transactions, inventory reservation, and fulfillment.", "advanced", "7h", 4.8, 9300, ["Saga", "Events", "ACID"]),
]

BADGES = [
    ("First Deploy", "🚀"), ("Architect", "🏗️"), ("Data Guru", "📊"), ("Distributed", "🌐"),
    ("Cache Master", "⚡"), ("Security Pro", "🔐"), ("Queue Expert", "📨"), ("Top 100", "👑"),
    ("Star Learner", "⭐"), ("Streak 30d", "🔥"), ("Bookworm", "📖"), ("Contributor", "🤝"),
]

FORUM_POSTS = [
    ("priya_sys", "How do you handle eventual consistency in microservices?", "Working on a distributed order system. Struggling with consistency across 5 services. Saga vs 2PC — share your experience!", "trending", 142, 38),
    ("arch_master", "My journey designing a system for 10M concurrent users", "After 3 years at a unicorn, here's what I learned about scaling Postgres, Kafka, and Redis together.", "trending", 389, 72),
    ("distributed_dev", "How we cut p99 latency by 80% with smart caching", "Our API was at 800ms p99. After a multi-layer Redis + CDN caching strategy, now at 160ms.", "latest", 256, 44),
    ("kafka_queen", "Kafka vs Kinesis vs Pulsar: 3-month honest comparison", "Tested all three at 1M events/sec for 3 months. Cost, latency, operational complexity — honest results.", "trending", 512, 91),
    ("newbie_arch", "Best resources for learning system design from scratch?", "Just starting my system design journey. Any recommended books, courses, or projects for a complete beginner?", "latest", 28, 15),
    ("scale_ninja", "Hot take: shared databases in microservices are fine", "The complexity of DB-per-service is often not worth it for small teams. Fight me in the comments.", "trending", 198, 67),
]


def seed_database(db: Session) -> None:
    if not db.query(Badge).first():
        db.add_all(Badge(name=n, icon=i) for n, i in BADGES)

    if not db.query(Project).first():
        db.add_all(
            Project(
                title=t, description=d, level=l, time_estimate=te, stars=s, views=v, topics=",".join(tp)
            )
            for t, d, l, te, s, v, tp in PROJECTS
        )

    if not db.query(User).filter(User.email == "admin@architectiq.dev").first():
        db.add(
            User(
                name="Admin",
                email="admin@architectiq.dev",
                hashed_password=hash_password("Admin123!"),
                role="admin",
                status="active",
            )
        )

    db.commit()

    if not db.query(Post).first():
        seed_user = db.query(User).first()
        db.add_all(
            Post(author_id=seed_user.id, title=t, body=b, category=c, likes=lk, comments=cm)
            for author, t, b, c, lk, cm in FORUM_POSTS
        )
        db.commit()
