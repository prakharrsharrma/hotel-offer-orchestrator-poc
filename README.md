# hotel-offer-orchestrator-poc

A high-performance orchestrator that aggregates supplier data, deduplicates hotels, and serves the best-priced offers via Redis.

## Containerized stack

This project includes a full Docker Compose setup for:

1. API server (`app`)
2. Temporal worker (`worker`)
3. Temporal server (`temporal`)
4. Redis cache (`redis`)

### Prerequisites

1. Docker Desktop (or Docker Engine + Compose plugin)

### Run with Docker Compose

```bash
npm run docker:up
```

or directly:

```bash
docker compose up --build
```

### Stop the stack

```bash
npm run docker:down
```

or directly:

```bash
docker compose down
```

### Service endpoints

1. API: `http://localhost:8000`
2. Temporal gRPC: `localhost:7233`
3. Redis: `localhost:6379`

### Running locally without Docker

If you run the API directly (`npm run dev` or `npm start`), make sure Redis is running at `127.0.0.1:6379` or set `REDIS_URL` to a reachable instance. Without Redis, cache reads/writes are skipped and requests are still served from Temporal workflows.

### Notes

1. The worker runs as a separate process/container using `src/temporal/worker.ts`.
2. Inside Compose, the worker calls supplier endpoints via `http://app:8000`.
3. Redis data is persisted in a named Docker volume `redis-data`.
