# Sustainability Connect Frontend

This is the React app for Sustainability Connect. It handles the storefront, product pages, cart, login/signup, orders, recycling center pages, and the community section.

Live site:

```txt
https://sus-app-eosin.vercel.app
```

## Run Locally

```powershell
npm.cmd install
npm.cmd start
```

The app runs at:

```txt
http://localhost:3000
```

## Build

```powershell
npm.cmd run build
```

The production files are written to `build/`.

## API URL

The frontend reads the backend URL from:

```txt
REACT_APP_API_URL
```

For local development, it falls back to:

```txt
http://localhost:4000
```

For Vercel, set `REACT_APP_API_URL` to the hosted backend URL and redeploy.

## Vercel

This folder includes `vercel.json` with the production build command and React Router rewrite.

```txt
Build command: CI=false npm run build
Output directory: build
```
