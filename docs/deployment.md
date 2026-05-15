# Deployment Notes

This project is split into three deployable parts:

- `sus-app` for the React frontend
- `sus-app-backend` for the Express API
- `ai-service` for recommendation and eco-score endpoints

The frontend is already deployed on Vercel:

```txt
https://sus-app-eosin.vercel.app
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

## Backend

The Express API can be deployed on Render, Railway, AWS, or any host that supports Node.js services.

Use:

```txt
Root directory: sus-app-backend
Start command: npm start
Port: 4000 or the platform-provided PORT
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
AI_SERVICE_URL
```

Set `CLIENT_URL` to the Vercel frontend URL:

```txt
https://sus-app-eosin.vercel.app
```

## AI Service

The FastAPI service can be deployed on Render, Railway, AWS, or another Python-friendly host.

Use:

```txt
Root directory: ai-service
Start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Required environment variables:

```txt
MONGODB_URI
MONGODB_DB
```

After this service is live, set the backend's `AI_SERVICE_URL` to the hosted AI service URL.

## Database And Cache

Use MongoDB Atlas for the database. Add the backend and AI service host IPs to Atlas Network Access, or use the host's recommended allowlist setup.

Redis is included in Docker Compose for local development. In production, use a hosted Redis provider such as Upstash or Redis Cloud if the deployed backend needs cache, rate-limit, or queue behavior.

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
