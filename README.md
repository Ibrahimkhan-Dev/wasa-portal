# WASA Smart Portal

A full-stack web application for the Water and Sanitation Authority (WASA) to digitize operations including consumer billing, complaint management, employee verification, and public services.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | NestJS 10, TypeScript |
| Database | PostgreSQL 15 |
| ORM | Prisma 5 |
| Auth | JWT (access + refresh tokens) |

---

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ running locally (or connection string to remote DB)
- npm

---

## Project Structure

```
wasa-portal/
├── backend/          # NestJS API server
│   ├── src/
│   │   ├── auth/         # JWT authentication
│   │   ├── users/        # User management
│   │   ├── roles/        # Role management
│   │   ├── permissions/  # Permission management
│   │   ├── consumers/    # Consumer records
│   │   ├── billing/      # Billing batches and bills
│   │   ├── employees/    # Employee and QR management
│   │   ├── complaints/   # Complaint workflow
│   │   ├── reports/      # Dashboard and reports
│   │   ├── audit-logs/   # Activity logging
│   │   └── prisma/       # Prisma client service
│   └── prisma/
│       ├── schema.prisma # Full database schema
│       └── seed.ts       # Demo data seed script
└── frontend/         # Next.js frontend
    └── src/
        ├── app/          # App Router pages
        ├── components/   # Reusable UI components
        ├── hooks/        # Custom React hooks
        ├── lib/          # API client and utilities
        └── types/        # TypeScript interfaces
```

---

## Setup Instructions

### Step 1 — Clone and configure environment

```bash
# Copy the example env file
cp .env.example backend/.env
cp .env.example frontend/.env.local
```

Edit `backend/.env` with your PostgreSQL connection string:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/wasa_portal?schema=public"
```

---

### Step 2 — Set up the backend

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed demo data
npx prisma db seed
```

---

### Step 3 — Set up the frontend

```bash
cd frontend

# Install dependencies
npm install
```

---

### Step 4 — Run the project

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd backend
npm run start:dev
# API running at http://localhost:3001/api
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Website running at http://localhost:3000
```

---

## Demo Login Accounts

All demo accounts use password: `Wasa@1234`

| Email | Role |
|---|---|
| superadmin@wasa.gov.pk | Super Admin |
| admin@wasa.gov.pk | Admin |
| billing@wasa.gov.pk | Billing Officer |
| complaints@wasa.gov.pk | Complaint Officer |
| technician@wasa.gov.pk | Field Technician |
| supervisor@wasa.gov.pk | Area Supervisor |

---

## API Endpoints (Phase 1)

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/logout` | Logout and invalidate token |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/refresh` | Refresh access token |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create user |
| PATCH | `/api/users/:id` | Update user |
| PATCH | `/api/users/:id/status` | Change user status |

### Roles & Permissions
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/roles` | List all roles |
| POST | `/api/roles` | Create role |
| PATCH | `/api/roles/:id/permissions` | Assign permissions to role |
| GET | `/api/permissions` | List all permissions |

### Consumers (public + protected)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/consumers` | List consumers (auth required) |
| GET | `/api/consumers/by-number/:cn` | Lookup by consumer number (public) |

### Billing
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/billing/batches` | List billing batches |
| GET | `/api/billing/bills` | List bills |
| GET | `/api/billing/bills/consumer/:cn` | Bills by consumer number (public) |

### Employees & QR
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | List employees |
| POST | `/api/employees/:id/qr` | Generate QR for employee |
| GET | `/api/public/employees/:slug` | Public verification page (public) |

### Complaints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/complaints/public` | Submit complaint (public) |
| GET | `/api/complaints` | List complaints |
| PATCH | `/api/complaints/:id/status` | Update complaint status |
| PATCH | `/api/complaints/:id/assign` | Assign complaint to employee |

### Reports
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/dashboard` | Dashboard statistics |
| GET | `/api/reports/billing` | Billing summary |
| GET | `/api/reports/complaints` | Complaint summary |

---

## Database Schema (20+ tables)

- `users`, `roles`, `permissions`, `role_permissions`, `refresh_tokens`
- `consumers`, `consumer_connections`, `tariff_plans`, `zones`
- `billing_batches`, `billing_batch_errors`, `bills`, `bill_items`
- `employees`, `departments`, `qr_profiles`
- `complaints`, `complaint_status_history`
- `notices`, `audit_logs`

---

## Phase 2 Roadmap

- Excel upload billing flow (with `xlsx` parsing and bill calculation)
- Bill PDF generation
- Full consumer management CRUD
- Full employee management CRUD
- Complaint management UI
- Reports module with charts
- Settings module (departments, zones, categories, tariff plans)
- Audit logs viewer

---

## Security Notes

- Passwords are hashed with bcrypt (cost factor 12)
- JWT access tokens expire in 15 minutes
- Refresh tokens expire in 7 days and are stored in the database
- All admin routes are protected by JWT guard + permission guard
- Public routes are limited to: bill lookup, complaint submission, QR verification, notices
- Role-based access control is enforced on both frontend and backend
