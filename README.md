# Sustainability Connect

Sustainability Connect is a marketplace for eco-friendly products and recycling support. It brings together product browsing, cart and order flows, recycling center discovery, and recommendation features built around sustainable shopping behavior.

The frontend is live here:

```txt
https://sus-app-eosin.vercel.app
```

The API services still need a hosted backend URL before every live feature can work end to end. Until then, the deployed frontend can load, but actions that call the API may fail because the app falls back to a local backend during development.

## What Is Inside

```txt
sus-app/          React frontend
sus-app-backend/  Express API, MongoDB models, auth, orders, payments, uploads
ai-service/       FastAPI service for recommendations, search, and eco scoring
docs/             Deployment notes and recommender details
docker-compose.yml
```

## Main Features

- Product catalog with category pages, search, cart, and order screens
- User signup, login, OTP, and password reset flows
- Recycling center listings and recyclable item information
- Product recommendations using shopping activity and sustainability signals
- Admin analytics routes for product and interaction data
- Docker setup for running the frontend, backend, AI service, and Redis together

## Tech Stack

- React and Material UI for the frontend
- Node.js, Express, and Mongoose for the API
- FastAPI for AI/recommendation endpoints
- MongoDB Atlas for application data
- Redis for cache/rate-limit foundations
- Docker Compose for local multi-service setup
- Render Blueprint for backend, AI service, and cache deployment
- GitHub Actions for build checks
- Vercel for the frontend deployment

## Local Setup

Create local environment files:

```powershell
copy .env.example .env
copy sus-app-backend\.env.example sus-app-backend\.env
copy ai-service\.env.example ai-service\.env
```

Then update the backend and AI service env files with your MongoDB URI, JWT secrets, payment keys, and mail credentials.

Run the full stack with Docker:

```powershell
docker compose up --build
```

Local service URLs:

```txt
Frontend:    http://localhost:3000
Backend API: http://localhost:4000
AI Service:  http://localhost:8000
Redis:       localhost:6379
```

Health checks:

```txt
GET http://localhost:4000/health
GET http://localhost:8000/health
```

## Frontend Only

For day-to-day frontend work:

```powershell
cd sus-app
npm.cmd install
npm.cmd start
```

To make the frontend talk to a hosted backend, set this environment variable before building or in Vercel:

```txt
REACT_APP_API_URL=https://your-backend-domain
```

## Useful Checks

```powershell
cd sus-app
npm.cmd run build
```

```powershell
cd sus-app-backend
node --check index.js
```

```powershell
cd ai-service
python -m compileall app
```

```powershell
docker compose config
```

## Deployment

The frontend is deployed on Vercel:

```txt
https://sus-app-eosin.vercel.app
```

Vercel project settings:

```txt
Root directory: sus-app
Build command: CI=false npm run build
Output directory: build
```

The backend, AI service, and cache are described in `render.yaml` for Render. MongoDB should be created in MongoDB Atlas, then its connection string should be added to both Render services as `MONGODB_URI`.

After the backend is live, add its URL to Vercel as `REACT_APP_API_URL` and redeploy the frontend.

More notes are in [docs/deployment.md](docs/deployment.md).
