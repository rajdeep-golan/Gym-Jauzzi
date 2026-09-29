# Jacuzzi Spa & Salon — Website & Management System

Premium luxury spa & salon website with complete business management system for two branches in Jamshedpur, Jharkhand.

---

## Project Structure

```
jacuzzi 2/
├── client/          ← React frontend (Vite + Tailwind)
│   └── src/
│       ├── pages/          ← All website & dashboard pages
│       ├── components/     ← Reusable UI components
│       └── store/          ← Zustand state management
├── server/          ← Node.js + Express backend
│   └── src/
│       ├── routes/         ← All API routes
│       ├── middleware/      ← Auth, validation
│       └── db/             ← PostgreSQL pool + schema
└── README.md
```

---

## Quick Start (Development)

### 1. Install dependencies

```bash
cd "jacuzzi 2"
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Set up environment

```bash
cp server/.env.example server/.env
# Edit server/.env with your PostgreSQL credentials
```

### 3. Set up database

```bash
# Create PostgreSQL database
createdb jacuzzi_db

# Run schema
psql -d jacuzzi_db -f server/src/db/schema.sql
```

### 4. Run development

```bash
# Terminal 1 — Frontend
cd client && npm run dev
# Opens at http://localhost:3000

# Terminal 2 — Backend
cd server && npm run dev
# Runs at http://localhost:5000
```

---

## Demo Login

After starting the dev server, visit `/owner-login`:
- **Username:** `owner`
- **Password:** `jacuzzi2024`

---

## Website Pages

| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about` |
| Services | `/services` |
| Gallery | `/gallery` |
| Membership | `/membership` |
| Offers | `/offers` |
| Book Appointment | `/appointments` |
| Contact | `/contact` |
| Privacy Policy | `/privacy-policy` |
| Terms & Conditions | `/terms` |
| Owner Login | `/owner-login` |
| Customer Login | `/customer-login` |

---

## Owner Dashboard Modules

| Module | Route |
|--------|-------|
| Overview | `/dashboard` |
| Payments | `/dashboard/payments` |
| Expenses | `/dashboard/expenses` |
| Inventory | `/dashboard/inventory` |
| Staff | `/dashboard/staff` |
| Customers | `/dashboard/customers` |
| Appointments | `/dashboard/appointments` |
| Equipment | `/dashboard/equipment` |
| Licenses | `/dashboard/licenses` |
| Reports | `/dashboard/reports` |

---

## API Endpoints

```
POST   /api/auth/login
GET    /api/auth/me

GET    /api/dashboard/overview

GET    /api/payments
POST   /api/payments
GET    /api/payments/summary

GET    /api/expenses
POST   /api/expenses

GET    /api/inventory
POST   /api/inventory
PATCH  /api/inventory/:id/stock

GET    /api/staff
POST   /api/staff
POST   /api/staff/attendance

GET    /api/customers
POST   /api/customers
GET    /api/customers/birthdays-today

POST   /api/appointments/book    ← Public (no auth)
GET    /api/appointments
PATCH  /api/appointments/:id/status

GET    /api/equipment
POST   /api/equipment

GET    /api/licenses
POST   /api/licenses

GET    /api/reports/monthly
GET    /api/reports/gst
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| State | Zustand |
| Charts | Recharts |
| HTTP | Axios + TanStack Query |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT (jsonwebtoken) |
| File upload | Multer |

---

## Pending (Owner to provide)

- [ ] Business logo (SVG/PNG)
- [ ] Branch photos
- [ ] Correct email address
- [ ] Complete service price list
- [ ] GST number
- [ ] Final membership package pricing
- [ ] WhatsApp Business API credentials (for notifications)
- [ ] Domain name for production deployment

---

## Production Deployment

Recommended: **Render** (backend), **Vercel** (frontend), **Supabase** or **Railway** (PostgreSQL)

1. Push to GitHub
2. Deploy backend to Render, set env vars
3. Deploy frontend to Vercel, set `VITE_API_URL` env var
4. Configure PostgreSQL connection string

---

## Branches

- **Sakchi:** 3rd Floor, OM Plaza, Thakur Bari Road, Sakchi, Jamshedpur
- **Bistupur:** 1st Floor, Bumbra Enclave, Diagonal Road, Bistupur, Jamshedpur
- **Contact:** +91 7463914973
