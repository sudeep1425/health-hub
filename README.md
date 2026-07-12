# 🌿 Health Hub

**Food Intake Awareness and Health Overview System**

A full-stack web application for tracking daily food intake and water consumption, with a gamified dashboard, achievement system, and a separate admin portal.

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, React Router v6, Axios, Recharts |
| Backend   | Node.js, Express.js               |
| Database  | PostgreSQL (via `pg`)             |
| Auth      | JWT (`jsonwebtoken`) + bcrypt     |
| Styling   | Plain CSS — glassmorphism design system |

---

## Project Structure

```
health-hub/
├── backend/           # Express API server (MVC)
│   ├── config/        # DB pool + init.sql
│   ├── controllers/   # Business logic
│   ├── middleware/     # Auth, validation, error handler
│   ├── models/        # DB queries
│   ├── routes/        # Route definitions
│   └── server.js      # Entry point
│
└── frontend/          # React/Vite SPA
    └── src/
        ├── components/ # Sidebar, forms, cards, table
        ├── hooks/      # useAuth, useDietLogs, useWaterIntake, useAchievements
        ├── pages/      # All 13 screens
        ├── services/   # Axios service calls
        └── styles/     # Global CSS design system
```

---

## Getting Started

### 1. Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally with a database created

### 2. Create the database

```bash
psql -U postgres -c "CREATE DATABASE healthhub;"
psql -U postgres -d healthhub -f backend/config/init.sql
```

This creates all tables and seeds a default admin account:
- **Email:** `admin@healthhub.com`
- **Password:** `admin123`

### 3. Configure the backend

```bash
cd backend
copy .env.example .env
```

Edit `.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/healthhub
JWT_SECRET=change_this_to_a_long_random_string
ADMIN_JWT_SECRET=change_this_to_another_long_random_string
```

### 4. Install & run the backend

```bash
cd backend
npm install
npm run dev
# API running on http://localhost:5000
```

### 5. Install & run the frontend

```bash
cd frontend
npm install
npm run dev
# App running on http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:5000` — no CORS setup needed.

---

## Pages

| Route | Page | Auth |
|-------|------|------|
| `/register` | Sign Up | Public |
| `/login` | Login | Public |
| `/home` | Welcome Home | User |
| `/dashboard` | Real-time Dashboard | User |
| `/bmi` | BMI Calculator | User |
| `/zen` | Zen Mode | User |
| `/achievements` | Badges | User |
| `/daily-log` | Food + Water Log | User |
| `/reports` | Charts + CSV Export | User |
| `/settings` | Profile + Password | User |
| `/alerts` | Notification Info | User |
| `/admin/login` | Admin Login | Public |
| `/admin/dashboard` | Admin Command Center | Admin |

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Diet Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/diet/:userId` | Get all logs |
| GET | `/api/diet/summary` | Get today's summary |
| POST | `/api/diet` | Add entry |
| PUT | `/api/diet/:id` | Update entry |
| DELETE | `/api/diet/:id` | Delete entry |

### Water Intake
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/water/:userId` | Get all logs |
| POST | `/api/water` | Add entry |
| DELETE | `/api/water/:id` | Delete entry |

### Achievements
| Method | Endpoint |
|--------|----------|
| GET | `/api/achievements/:userId` |

### Reports
| Method | Endpoint |
|--------|----------|
| GET | `/api/reports/:userId?days=30` |
| GET | `/api/reports/:userId/export` (CSV) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/users` | All users |
| POST | `/api/admin/users` | Create user |
| DELETE | `/api/admin/users/:id` | Delete user |
| PATCH | `/api/admin/users/:id/toggle` | Toggle active |
| GET | `/api/admin/stats` | Platform stats |

---

## Security

- Passwords are hashed with **bcrypt** (salt rounds: 10)
- User and admin routes use **separate JWT secrets**
- Rate limiting applied to `/api/auth/login` (20/15min) and `/api/admin/login` (10/15min)
- All non-auth routes require a valid Bearer token
- Server-side validation on all POST/PUT endpoints

---
