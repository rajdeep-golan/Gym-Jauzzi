# Pump Up Muscles — Setup Guide

## Prerequisites
- Go 1.21+ installed → https://go.dev/dl/
- Node.js 18+ installed → https://nodejs.org/
- GCC / Xcode Command Line Tools (required by go-sqlite3's CGo binding)
  - macOS: run `xcode-select --install` in Terminal

---

## Step 1 — Set up the Go backend

Open a Terminal window and run:

```bash
cd ~/pum\ gym/backend
go mod tidy          # downloads go-sqlite3 (takes ~30s first time)
go run main.go       # starts the API server on http://localhost:8080
```

You should see:
```
Database initialized: pump_up_muscles.db
Pump Up Muscles backend running on http://localhost:8080
```

Leave this terminal window open.

---

## Step 2 — Set up the React frontend

Open a **second** Terminal window and run:

```bash
cd ~/pum\ gym/frontend
npm install          # installs React, Vite, Tailwind, etc.
npm run dev          # starts the dev server on http://localhost:5173
```

You should see:
```
VITE v5.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## Step 3 — Open the app

Open your browser and visit:  **http://localhost:5173**

The frontend proxies all `/api/*` requests to the Go backend on port 8080.

---

## File layout

```
pum gym/
├── backend/
│   ├── main.go              ← entire Go API server
│   ├── go.mod
│   └── pump_up_muscles.db   ← auto-created on first run
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── types.ts
    │   ├── index.css
    │   ├── main.tsx
    │   └── components/
    │       ├── MembersScreen.tsx
    │       ├── MemberModal.tsx
    │       └── ExpensesScreen.tsx
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── tsconfig.json
```

---

## REST API reference

| Method | URL                    | Description              |
|--------|------------------------|--------------------------|
| GET    | /api/members           | List all members         |
| POST   | /api/members           | Create a member          |
| PUT    | /api/members/:id       | Update a member          |
| DELETE | /api/members/:id       | Delete a member          |
| GET    | /api/expenses          | List all expenses        |
| POST   | /api/expenses          | Create an expense        |
| PUT    | /api/expenses/:id      | Update an expense        |
| DELETE | /api/expenses/:id      | Delete an expense        |

---

## Troubleshooting

**"cgo: C compiler not found"** — Install Xcode CLI tools: `xcode-select --install`

**"port 8080 already in use"** — Find and kill the process: `lsof -ti:8080 | xargs kill -9`

**"port 5173 already in use"** — `lsof -ti:5173 | xargs kill -9`

**CORS errors in browser** — Make sure the Go backend is running on port 8080 before opening the frontend.
