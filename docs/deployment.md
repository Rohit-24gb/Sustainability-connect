# Week 8 Deployment Guide

Sustainability Connect now has a deployable multi-service architecture:

- React frontend
- Express API gateway
- FastAPI AI service
- Redis cache/queue foundation
- MongoDB Atlas database

## Local Docker Compose

Create local env files first:

```powershell
copy .env.example .env
copy sus-app-backend\.env.example sus-app-backend\.env
copy ai-service\.env.example ai-service\.env
```

Update both service `.env` files with a real MongoDB Atlas URI and secrets. The
root `.env` only controls Docker Compose project name and exposed host ports.

Run the stack:

```powershell
docker compose up --build
```

Stop the stack:

```powershell
docker compose down
```

Services:

```txt
Frontend:    http://localhost:3000
Express API: http://localhost:4000
AI Service:  http://localhost:8000
Redis:       localhost:6379
```

Health checks:

```txt
GET http://localhost:4000/health
GET http://localhost:8000/health
```

## Production Recommendation

Frontend:

- Vercel or Netlify
- Build command: `npm run build`
- Publish directory: `build`
- Env: `REACT_APP_API_URL=https://your-api-domain`

Express API:

- Render, Railway, or AWS ECS
- Root directory: `sus-app-backend`
- Start command: `npm start`
- Required env vars:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `CLIENT_URL`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `MAIL_USER`
  - `MAIL_PASS`

FastAPI AI service:

- Render, Railway, or AWS ECS
- Root directory: `ai-service`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Required env vars:
  - `MONGODB_URI`
  - `MONGODB_DB`

Redis:

- Upstash Redis or Redis Cloud
- Use for future caching, token blacklist, recommendation cache, and worker queues.

MongoDB:

- MongoDB Atlas
- Add API and AI service deployment IPs to Atlas Network Access.
- Use separate database users for production when possible.

## CI/CD

GitHub Actions workflow:

```txt
.github/workflows/ci.yml
```

It verifies:

- Express API syntax
- React production build
- FastAPI Python compile
- Docker Compose configuration
- Docker image builds

## Security Checklist Before Deployment

- Remove tracked `.env` files from Git:

```powershell
git rm --cached sus-app-backend/.env
git rm --cached ai-service/.env
```

- Rotate any secrets that were ever committed.
- Keep only `.env.example` in Git.
- Set real secrets in hosting provider dashboards.
- Restrict MongoDB Atlas network access.
- Use HTTPS domains in `CLIENT_URL` and `REACT_APP_API_URL`.

## Interview Talking Point

This phase containerized the full-stack AI marketplace using Docker Compose, added CI/CD validation with GitHub Actions, and documented production deployment across frontend, API gateway, AI microservice, MongoDB Atlas, and Redis.
