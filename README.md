# JobTrackr Pro

JobTrackr Pro is a premium full-stack job application tracking dashboard built for focused candidates who want clean workflows, clear analytics, and fast follow-up execution.

## Screenshots

- `docs/screenshots/dashboard-light.png` (placeholder)
- `docs/screenshots/dashboard-dark.png` (placeholder)
- `docs/screenshots/auth.png` (placeholder)

## Features

- JWT authentication (register/login/logout/me)
- Protected routes and user-scoped data access
- Full applications CRUD with validation on client and server
- Analytics dashboard:
  - Total applications, interviews, offers, rejections, conversion rate
  - Stage distribution bar chart
  - Weekly trend line chart
  - Overdue follow-up reminder widget with pulse badge
- CSV export endpoint
- Premium responsive UI with dark mode, subtle motion, toasts, and skeleton states

## Tech Stack

### Frontend (`client/`)

- React + Vite
- TypeScript
- Tailwind CSS with custom design tokens
- Framer Motion
- Recharts
- lucide-react

### Backend (`server/`)

- Node.js + Express
- MongoDB Atlas + Mongoose
- JWT auth + bcrypt hashing
- Zod validation
- Centralized error middleware

## Monorepo Structure

```text
jobtrackr/
  client/
  server/
  README.md
```

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd jobtrackr
npm install
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Set values:

- `server/.env`
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `CLIENT_URL` (e.g. `http://localhost:5173`)
- `client/.env`
  - `VITE_API_URL` (e.g. `http://localhost:5000/api`)

### 3. Run development servers

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Applications

- `GET /api/apps`
- `POST /api/apps`
- `GET /api/apps/:id`
- `PUT /api/apps/:id`
- `DELETE /api/apps/:id`
- `GET /api/apps/stats`
- `GET /api/apps/export`

## Architecture Notes

- Layered backend (`models`, `controllers`, `routes`, `middleware`, `validators`, `utils`)
- Validation at API boundary with zod
- Consistent API errors via `ApiError` + centralized error handler
- User isolation enforced at query level (`userId` filter on all app operations)
- Frontend app shell + reusable UI primitives for consistent UX

## Deployment (Free Tier)

### 1. MongoDB Atlas (M0)

1. Create a free Atlas cluster.
2. Create a DB user and IP whitelist (or add Render egress as needed).
3. Copy connection string into backend `MONGODB_URI`.

### 2. Backend on Render (Free Web Service)

1. Push repo to GitHub.
2. Create new Web Service in Render.
3. Set **Root Directory** to `server`.
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=10000` (Render default can also be used)
   - `MONGODB_URI=<atlas-uri>`
   - `JWT_SECRET=<strong-secret>`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_URL=<vercel-frontend-url>`

### 3. Frontend on Vercel (Free)

1. Import same GitHub repo into Vercel.
2. Set **Root Directory** to `client`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env var:
   - `VITE_API_URL=<render-backend-url>/api`

### 4. Final CORS check

- Ensure backend `CLIENT_URL` exactly matches deployed frontend URL.
- Redeploy backend if updated.

## Production Checklist

- Use strong `JWT_SECRET`
- Restrict MongoDB network access
- Keep `.env` files out of source control
- Rotate secrets periodically
