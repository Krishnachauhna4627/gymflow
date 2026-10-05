# GymFlow

- `frontend/` — Angular app (port 4200)
- `backend/` — Node.js + Express API (port 3000)

Requires Node 24 (`nvm use` picks it up from `.nvmrc`).

## Run in development

```bash
# terminal 1
cd backend && npm install && npm run dev

# terminal 2
cd frontend && npm install && npm start
```

Open http://localhost:4200. Requests to `/api/*` are proxied to the backend
(see `frontend/proxy.conf.json`). Health check: http://localhost:3000/api/health
