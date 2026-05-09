# Sustainability Connect AI

Sustainability Connect AI is a full-stack sustainable marketplace where users can discover eco-friendly products, search by intent, get recommendations, understand product impact, and track sustainability behavior.

## Architecture

- React frontend in `sus-app`
- Node.js Express API gateway in `sus-app-backend`
- FastAPI AI microservice in `ai-service`
- MongoDB Atlas for product, user, order, interaction, recommendation, and embedding data
- Redis for cache, rate-limit/session foundations, and future worker queues
- Docker Compose for local multi-service development
- GitHub Actions for CI checks

## Docker, CI/CD, Deployment

This repo now includes:

- Dockerfiles for frontend, backend, and AI service
- `docker-compose.yml` for frontend, backend, AI service, Redis, and persistent upload/cache volumes
- Optional local env loading from `sus-app-backend/.env` and `ai-service/.env`
- Health checks for backend, AI service, and Redis
- GitHub Actions workflow at `.github/workflows/ci.yml`
- Deployment guide at `docs/deployment.md`

##  Collaborative Filtering + Hybrid Ranking

The recommendation engine now combines content-based ranking with collaborative filtering from the `interactions` collection.

Hybrid formula:

```txt
Final Score =
  0.35 * content_similarity
+ 0.25 * collaborative_score
+ 0.20 * eco_score
+ 0.10 * popularity
+ 0.10 * freshness
```

Collaborative filtering uses a user/session-product interaction matrix built from weighted events such as views, cart additions, purchases, wishlist actions, and cart removals. It compares users or sessions with cosine similarity and recommends products that similar eco-shoppers interacted with.

See [docs/week9-hybrid-recommendations.md](docs/week9-hybrid-recommendations.md) for the interview explanation.

## Local Setup

Create local env files:

```powershell
copy .env.example .env
copy sus-app-backend\.env.example sus-app-backend\.env
copy ai-service\.env.example ai-service\.env
```

Update the service env files with your real MongoDB Atlas URI, JWT secrets, payment keys, and mail credentials. The root `.env` controls Compose project name and host ports.

Run everything with Docker:

```powershell
docker compose up --build
```

Default URLs:

```txt
Frontend:    http://localhost:3000
Express API: http://localhost:4000
AI Service:  http://localhost:8000
Redis:       localhost:6379
```

Health endpoints:

```txt
GET http://localhost:4000/health
GET http://localhost:8000/health
```

## Useful Local Commands

Frontend build:

```powershell
cd sus-app
npm.cmd run build
```

Backend syntax check:

```powershell
cd sus-app-backend
node --check index.js
```

AI service compile check:

```powershell
cd ai-service
python -m compileall app
```

Docker Compose validation:

```powershell
docker compose config
```

## Production Targets

- Frontend: Vercel or Netlify
- Express API: Render, Railway, or AWS ECS
- FastAPI AI service: Render, Railway, or AWS ECS
- MongoDB: MongoDB Atlas
- Redis: Upstash Redis or Redis Cloud
- CI/CD: GitHub Actions
- Monitoring: Sentry, OpenTelemetry, Grafana/Prometheus

See [docs/deployment.md](docs/deployment.md) for the full deployment checklist.



## Contact

- rohitrajaksnd@gmail.com
- suryakantmani28@gmail.com
