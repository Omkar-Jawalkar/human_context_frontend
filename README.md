# Human Context Frontend

Next.js frontend for [Human Context](../human_context_backend) — import Claude chat exports and query your conversation history with semantic search (RAG).

## Prerequisites

- Node.js 20+
- [Human Context backend](../human_context_backend) running at `http://localhost:8000`

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | FastAPI origin (default `http://localhost:8000`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID (optional; omit to hide Google sign-in) |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | GitHub OAuth client ID for this environment (optional; omit to hide GitHub sign-in) |

OAuth client secrets belong on the backend only. Redirect URIs must match exactly, e.g. `http://localhost:3000/auth/callback/google` and `http://localhost:3000/auth/callback/github`.

## Project structure

```text
human_context/
├── human_context_backend/   # FastAPI API
└── human_context_frontend/    # This app
```

The frontend talks to the backend only via `NEXT_PUBLIC_API_URL`.

## Tenant flow (manual test)

1. Start the backend (see backend README) with CORS allowing `http://localhost:3000`.
2. **Register** at `/register` → redirected to join organization.
3. **Create an org** via backend Swagger (`/docs`) as super admin, then **join** at `/join-organization` with the org UUID (or use `?org=<uuid>`).
4. **Import** a Claude export JSON at `/imports` → job polls until `completed`.
5. **Query** at `/query` → answer and cited sources render.
6. **Sign out** → protected routes redirect to `/login`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## API reference

See [backend docs/API.md](../human_context_backend/docs/API.md).
