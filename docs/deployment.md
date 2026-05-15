# Deployment Notes

This project is split into a few deployable parts:

- `sus-app` for the React frontend
- `sus-app-backend` for the Express API
- `ai-service` for recommendation and eco-score endpoints
- MongoDB Atlas for the database
- Render Key Value for Redis-compatible cache

The frontend is already deployed on Vercel:

```txt
https://sus-app-eosin.vercel.app
```

The backend and AI service are deployed on Render:

```txt
Backend API: https://sustainability-connect-api.onrender.com
AI Service:  https://sustainability-connect-ai.onrender.com
```

## Frontend

Vercel is set up from the `sus-app` folder.

```txt
Root directory: sus-app
Build command: CI=false npm run build
Output directory: build
```

`sus-app/vercel.json` also includes a rewrite rule so React Router pages keep working after a refresh.

Required production environment variable:

```txt
REACT_APP_API_URL=https://your-backend-domain
```

Without this value, the frontend falls back to `http://localhost:4000`, which is only useful while developing locally.

## Render Blueprint

The repository includes `render.yaml` at the root. Use it from the Render dashboard to create:

- `sustainability-connect-api`
- `sustainability-connect-ai`
- `sustainability-connect-cache`

Render will ask for secret values marked with `sync: false`, especially `MONGODB_URI` and any payment/mail credentials you want enabled.

## Backend

The Express API is configured as a Render Docker web service.

Use:

```txt
Root directory: sus-app-backend
Runtime: Docker
Health check: /health
```

Required environment variables:

```txt
MONGODB_URI
JWT_SECRET
JWT_REFRESH_SECRET
CLIENT_URL
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
MAIL_USER
MAIL_PASS
```

Set `CLIENT_URL` to the Vercel frontend URL:

```txt
https://sus-app-eosin.vercel.app
```

`AI_SERVICE_URL` is populated from the AI service in `render.yaml`.

## AI Service

The FastAPI service is configured as a Render Docker web service.

Use:

```txt
Root directory: ai-service
Runtime: Docker
Health check: /health
```

Required environment variables:

```txt
MONGODB_URI
MONGODB_DB
```

After this service is live, set the backend's `AI_SERVICE_URL` to the hosted AI service URL.

## Database And Cache

Use MongoDB Atlas for the database. Add the backend and AI service host IPs to Atlas Network Access, or use the host's recommended allowlist setup.

Render Key Value is included in `render.yaml` for Redis-compatible cache. Redis is also included in Docker Compose for local development.

## Vercel After Backend Deploy

The Vercel frontend uses this production environment variable:

```txt
REACT_APP_API_URL=https://sustainability-connect-api.onrender.com
```

This is the setting that stops the live app from calling `http://localhost:4000`.

## Local Docker Run

Create local env files:

```powershell
copy .env.example .env
copy sus-app-backend\.env.example sus-app-backend\.env
copy ai-service\.env.example ai-service\.env
```

Run everything:

```powershell
docker compose up --build
```

Services:

```txt
Frontend:    http://localhost:3000
Backend API: http://localhost:4000
AI Service:  http://localhost:8000
Redis:       localhost:6379
```

## Before Sharing Publicly

- Keep real `.env` files out of Git.
- Rotate any secret that was ever committed by mistake.
- Store production secrets in the hosting provider dashboard.
- Use HTTPS URLs for `CLIENT_URL`, `REACT_APP_API_URL`, and `AI_SERVICE_URL`.
- Check `GET /health` on the backend and AI service after deploying.
