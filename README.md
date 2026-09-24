#  Crystal Clear Beauty — Backend API 💄💅

The REST API server for **Crystal Clear Beauty**, an e-commerce platform for cosmetics. Built with **Node.js**, **Express**, and **MongoDB (Mongoose)**, it handles authentication, product catalog management, orders, and customer reviews.

> 🔗 Frontend repo:https://github.com/Sashika71/cbc-frontend.git

---

## ✨ Features

- 🔐 JWT-based authentication with role-based access control (`user` / `admin`)
- 🔑 Google OAuth 2.0 login
- 🛍️ Product catalog CRUD (admin-only write access)
- 📦 Order creation with auto-incrementing order IDs and per-item stock lookups
- ⭐ Customer review system (CRUD)
- 🌐 CORS-enabled REST API, ready to pair with any frontend

---

## 🧱 Tech Stack

| Layer          | Technology                    |
|----------------|--------------------------------|
| Runtime        | Node.js (ES Modules)          |
| Framework      | Express 4                     |
| Database       | MongoDB + Mongoose             |
| Auth           | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` for password hashing |
| OAuth          | Google OAuth (via `axios` to Google's userinfo endpoint) |
| Dev tooling    | Nodemon                        |
| Containerized  | Docker                         |

---
## 🏗️ System Architecture

```
                         ┌──────────────────────────────┐
                         │        Client Browser         │
                         └───────────────┬────────────────┘
                                          │ HTTPS
                                          ▼
                         ┌──────────────────────────────┐
                         │  cbc-frontend (React + Vite)  │
                         └───────┬────────────────┬───────┘
                                 │                │
                    REST/JSON    │                │  Direct upload
                    (Axios,      │                │  (Supabase JS SDK)
                    Bearer JWT)  │                │
                                 ▼                ▼
              ┌───────────────────────────┐  ┌─────────────────────────┐
              │   cbc-backend (Express)    │  │   Supabase Storage       │
              │───────────────────────────│  │   (product images)       │
              │  /api/user                 │  └─────────────────────────┘
              │  /api/product               │
              │  /api/order                 │
              │  /api/review                │
              │  ▲ JWT verify middleware    │
              └──────────────┬──────────────┘
                              │ Mongoose ODM
                              ▼
                   ┌───────────────────────┐
                   │      MongoDB            │
                   │  users · products ·     │
                   │  orders · reviews        │
                   └───────────────────────┘

              External: Google OAuth 2.0  ──►  used by /api/user/google
```

**Request flow (typical):** browser → React app → Axios call with `Authorization: Bearer <token>` → Express route → `verifyJWT` middleware decodes the token onto `req.user` → controller checks role/ownership → Mongoose model → MongoDB.

---

## 🔌 API Reference

Base path: `/api`

### Auth & Users — `/api/user`
| Method | Endpoint         | Access        | Description                          |
|--------|-------------------|---------------|----------------------------------------|
| POST   | `/api/user`        | Public*       | Register a new user                    |
| POST   | `/api/user/login`   | Public        | Login with email & password → JWT       |
| POST   | `/api/user/google`  | Public        | Login/register via Google OAuth        |

\* Creating a user with `role: "admin"` requires an authenticated admin token.

### Products — `/api/product`
| Method | Endpoint            | Access       | Description               |
|--------|-----------------------|--------------|-----------------------------|
| GET    | `/api/product`         | Public       | List all products           |
| GET    | `/api/product/:id`      | Public       | Get a single product         |
| POST   | `/api/product`          | Logged in    | Create a product              |
| PUT    | `/api/product/:id`       | Admin        | Update a product               |
| DELETE | `/api/product/:id`       | Admin        | Delete a product                |

### Orders — `/api/order`
| Method | Endpoint                | Access       | Description                                  |
|--------|---------------------------|--------------|-------------------------------------------------|
| POST   | `/api/order`                | Logged in    | Place an order (auto-generates `ORDxxxx` ID)    |
| GET    | `/api/order`                 | Logged in    | Admins see all orders; users see their own       |
| PUT    | `/api/order/:orderId`         | Admin        | Update order status                              |

### Reviews — `/api/review`
| Method | Endpoint             | Access   | Description             |
|--------|------------------------|----------|----------------------------|
| GET    | `/api/review`            | Public   | List all reviews             |
| GET    | `/api/review/:id`         | Public   | Get a single review           |
| POST   | `/api/review`             | Public   | Submit a review                |
| PUT    | `/api/review/:id`          | Public   | Edit a review                   |
| DELETE | `/api/review/:id`          | Public   | Delete a review                  |

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in your own values — **never commit `.env`**:

```
MONGODB_URI=   # your MongoDB connection string
JWT_KEY=       # a long, random secret used to sign JWTs
```

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# then edit .env with your MongoDB URI and JWT secret
```

### 3. Run in development
```bash
npm start
```
The API will be available at `http://localhost:5000`.

### 🐳 Run with Docker
This service is also wired up in the root [`docker-compose.yml`](../docker-compose.yml) alongside MongoDB and the frontend:
```bash
docker compose up --build
```

---

## 🔒 Security Checklist Before Going Public

- [ ] Move the JWT secret fully into `.env` (see note above) and rotate it
- [ ] Never commit `.env` — it's already excluded via `.gitignore`
- [ ] Restrict `cors()` to your actual frontend origin(s) in production instead of allowing all origins
- [ ] Review MongoDB user permissions if using Atlas (least privilege)

---
