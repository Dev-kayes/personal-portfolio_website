# Portfolio Client

The client is a React single-page application built with Vite. It contains the public portfolio and the `/admin` content-management interface.

## Requirements

- Node.js and npm
- The portfolio API running locally or a deployed API URL

## Setup

From this directory, install dependencies and configure the API URL:

```powershell
npm install
Copy-Item .env.example .env
```

Set `VITE_SERVER_URI` in `.env` to the server's base URL. The server defaults to `http://localhost:9000` in local development, so use:

```dotenv
VITE_SERVER_URI=http://localhost:9000
```

Vite reads this value when it starts or builds the app. Restart the dev server after changing it.

## Run locally

```powershell
npm run dev
```

Vite prints the local URL when it starts (normally `http://localhost:5173`).

## Build and preview

```powershell
npm run build
npm run preview
```

The production build is written to `dist/`.

## Other scripts

```powershell
npm run lint
```

## Main routes

- `/` — Public portfolio
- `/projects` — Projects
- `/admin/login` — Admin sign-in
- `/admin` — Admin dashboard and portfolio management

The client calls the API under `/api` using `VITE_SERVER_URI`. The server's CORS configuration currently allows `http://localhost:5173` and the deployed portfolio origin.
