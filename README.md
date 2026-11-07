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
# Portfolio Server

The server is an Express API backed by MongoDB. It serves portfolio data and admin operations, stores uploaded media with Cloudinary, and sends messages from the contact form through Gmail.

## Requirements

- Node.js and npm
- A MongoDB connection string
- Cloudinary credentials for media uploads
- Gmail credentials (an app password) and a destination email for contact-form messages

## Setup

From this directory, install dependencies and create a local environment file:

```powershell
npm install
Copy-Item .env.example .env
```

Add the following values to `.env`:

| Variable | Purpose |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `JWT_SECRET` | Secret used to sign and verify admin tokens |
| `SMTP_USER` | Gmail address used to send contact messages |
| `SMTP_PASS` | Gmail app password |
| `CONTACT_EMAIL` | Address that receives contact-form messages |
| `PORT` | Optional local server port; defaults to `9000` |

Keep credentials private and do not commit `.env`.

## Run locally

The server only starts its HTTP listener when `NODE_ENV` is set to `development`. In PowerShell, run:

```powershell
$env:NODE_ENV = "development"
npm run dev
```

The API listens on `http://localhost:9000` by default, or on the port set by `PORT`.

To run without nodemon:

```powershell
$env:NODE_ENV = "development"
npm start
```

## API areas

- `/api/auth` — Admin authentication
- `/api/user` — Portfolio profile
- `/api/skill` — Skills
- `/api/projects` — Projects
- `/api/experience` — Experience
- `/api/cert` — Certifications
- `/api/topic` — Topics
- `/api/rev` — Reviews
- `/api/contact` — Contact messages

Public content routes are available under the corresponding API areas; the client uses `VITE_SERVER_URI` as the API base URL.
