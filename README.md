# YUMMMZO Backend

A production-ready REST API for a food delivery platform, built with Node.js, Express, Prisma (MySQL), Redis, and BullMQ. It powers the full lifecycle of food ordering — from user registration and restaurant discovery to cart management, order processing, and payment integration.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js 5 |
| Language | TypeScript |
| ORM | Prisma |
| Database | MySQL |
| Cache / Queue Backend | Redis (ioredis) |
| Job Queue | BullMQ |
| Auth | JWT (httpOnly cookies) |
| Password Hashing | bcryptjs |
| Validation | Zod |
| Email | Nodemailer (Gmail SMTP) |
| Payments | Razorpay |
| AI Integration | OpenAI SDK |

---

## Project Structure

```
src/
├── app.ts                  # Express app setup (middleware, routes)
├── server.ts               # Server entry point
├── routes/index.ts         # Route aggregator
├── modules/                # Feature modules (routes → controllers → services)
│   ├── auth/
│   ├── user/
│   ├── restaurant/
│   ├── cart/
│   ├── order/
│   ├── address/
│   ├── coupon/
│   └── favourites/
├── config/                 # DB, Redis, BullMQ, Email config
├── middlewares/            # Auth, error handling
├── queues/                 # BullMQ queues and workers
├── utils/                  # JWT, hashing, responses, email, etc.
└── types/

prisma/
├── schema.prisma           # Database schema
├── migrations/
└── seed/
```

---

## API Reference

Base URL: `/api/v1`

### Health

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| GET | `/auth/verify-email` | Verify email with token |
| POST | `/auth/login` | Login and receive JWT cookie |
| POST | `/auth/logout` | Logout and invalidate token |
| POST | `/auth/forgot-password` | Request password reset email |
| POST | `/auth/reset-password` | Reset password with token |

### User *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/profile` | Get logged-in user profile |
| PATCH | `/user/profile` | Update name |
| PATCH | `/user/avatar` | Upload avatar |
| PATCH | `/user/change-password` | Change password |

### Addresses *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/address` | Get all addresses |
| GET | `/address/:addressId` | Get a specific address |
| POST | `/address` | Add a new address |
| PATCH | `/address/:addressId` | Update an address |
| PATCH | `/address/:addressId/default` | Set as default address |

### Restaurants *(public)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/restaurant` | List restaurants with filters |
| GET | `/restaurant/cuisines` | Get all cuisines |
| GET | `/restaurant/top-picks` | Get top-rated restaurants |
| GET | `/restaurant/:restaurantId` | Get restaurant details |
| GET | `/restaurant/:restaurantId/menu` | Get restaurant menu |

### Cart *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | Get user's cart |
| POST | `/cart/items` | Add item to cart |
| PATCH | `/cart/items/:cartItemId` | Update item quantity |
| DELETE | `/cart` | Clear cart |
| POST | `/cart/coupon` | Apply coupon |
| DELETE | `/cart/coupon` | Remove coupon |

### Coupons *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/coupon` | Get available coupons |
| POST | `/coupon/validate` | Validate a coupon code |

### Orders *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| POST | `/order/:userId` | Place an order |
| GET | `/order/:userId` | Get order history |
| GET | `/order/:userId/:orderId` | Get order details |
| POST | `/order/:userId/:orderId/cancel` | Cancel an order |
| POST | `/order/:userId/:orderId/reorder` | Reorder from history |

### Favourites *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/favourites` | Get favourite restaurants |
| GET | `/favourites/ids` | Get favourite restaurant IDs |
| POST | `/favourites/toggle/:restaurantId` | Toggle favourite |

---

## Database Schema (Key Models)

- **User** — Customers with email, phone, avatar, role
- **Restaurant** — Name, location, rating, hours, delivery time
- **Cuisine** — Many-to-many with restaurants
- **Category** — Menu sections per restaurant
- **Menu_Item** — Food items with price, veg/non-veg, spice level, dietary info
- **Address** — Delivery addresses with lat/long and default flag
- **Cart / Cart_Item** — Active cart per user
- **Order / Order_Item** — Full order with status history, payment info
- **Coupon** — Flat or percentage discounts with validity and constraints
- **Review** — Per-order reviews with rating and images
- **Favorite** — User ↔ restaurant relationship
- **Payment** — Razorpay transaction records
- **Setting** — Per-user notification and UI preferences

**Order Status Flow:**
`PENDING → CONFIRMED → PREPARING → READY → OUT_FOR_DELIVERY → DELIVERED`

**Payment Methods:** `ONLINE`, `COD`

---

## Authentication

- JWT tokens issued on login, stored in **httpOnly cookies** (`jwt_token`)
- Token payload: `{ userId, firstName, lastName, email, role }`
- Token expiry: 24 hours
- Logout invalidates the token via a **Redis blacklist**
- Email must be verified before login is allowed
- Passwords hashed with **bcryptjs** (12 salt rounds)

---

## Background Jobs (BullMQ)

Async email jobs processed by a separate worker process:

| Job Type | Trigger |
|---|---|
| `VERIFICATION_EMAIL` | After registration |
| `WELCOME_EMAIL` | After email verification |
| `PASSWORD_RESET` | Forgot password request |
| `PASSWORD_UPDATED` | After password reset |
| `PASSWORD_CHANGE_NOTIFICATION` | After change-password |
| `ORDER_CONFIRMATION` | After order placement |
| `ORDER_CANCELLATION` | After order cancellation |

- **Retry:** 3 attempts with exponential backoff
- **TTL:** 1 hour for completed jobs, 24 hours for failed

---

## Environment Variables

Copy `.env-example` to `.env` and fill in the values:

```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=https://www.yummmzo.com

# MySQL
DATABASE_URL=mysql://user:password@localhost:3306/yummmzo

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Auth
SECRET_KEY=your-jwt-secret

# Payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## Getting Started

**Prerequisites:** Node.js, MySQL, Redis

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env-example .env
# Fill in .env values

# 3. Run database migrations
npx prisma migrate dev

# 4. (Optional) Seed the database
npx prisma db seed

# 5. Start the development server
npm run dev

# 6. (Optional) Start the email worker in a separate terminal
npm run worker:email
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run worker:email` | Start email worker (dev) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run worker:email:prod` | Start email worker (production) |
