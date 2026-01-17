# BuzDealz - Deal Management Platform

A modern full-stack web application for managing deals and wishlists with real-time price tracking and alerts.

## 📋 Project Overview

**BuzDealz** is a comprehensive deal management platform that allows users to:
- Browse and discover deals
- Add deals to personal wishlists
- Track price changes for wishlisted items
- Enable price alerts for deals (premium feature)
- Manage user roles (free/subscriber)

The platform consists of a **React frontend** with **Express.js backend** and **PostgreSQL database**.

---

## 🏗️ Project Structure

```
buzdealz/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   └── Wishlist.tsx
│   │   ├── components/
│   │   │   └── WishlistCard.tsx
│   │   ├── api/
│   │   │   └── wishlist.ts      # API client functions
│   │   ├── assets/
│   │   ├── App.css
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── eslint.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/               # Express + TypeScript + PostgreSQL
│   ├── server.ts          # Express app setup
│   ├── package.json
│   ├── tsconfig.json
│   ├── db/
│   │   ├── migrate.sql    # Database schema & migrations
│   │   └── schema/        # Drizzle ORM schema definitions
│   │       ├── user.ts
│   │       ├── deal.ts
│   │       ├── price.ts
│   │       └── wishlist.ts
│   ├── routes/
│   │   └── wishlist.routes.ts    # Wishlist API endpoints
│   ├── middlewares/
│   │   └── auth.ts        # Authentication middleware
│   ├── validators/
│   │   └── wishlist.validators.ts # Zod schema validation
│   └── utils/
│       ├── db.ts          # Database connection & setup
│       └── analytics.ts   # Event tracking
│
├── index.html
├── package.json           # Root package file
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TanStack React Query** - Data fetching & caching
- **Wouter** - Lightweight routing
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS & Autoprefixer** - CSS processing

### Backend
- **Express.js** - Web server framework
- **TypeScript** - Type safety
- **PostgreSQL** - Relational database
- **Drizzle ORM** - Type-safe database access
- **Zod** - Schema validation
- **ts-node-dev** - Development server with auto-reload

### DevTools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (v12+)
- **npm** or **yarn**

### 1. Clone & Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Return to root
cd ..
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb buzdealz

# Run migrations (create tables)
psql -U postgres -d buzdealz -f backend/db/migrate.sql
```

### 3. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DB_URL=postgresql://username:password@localhost:5432/buzdealz
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### 4. Start Development Servers

**Terminal 1 - Frontend (Vite):**
```bash
npm run dev
```

**Terminal 2 - Backend (Express):**
```bash
cd backend
npm run dev
```

Frontend runs on: `http://localhost:5173`
Backend runs on: `http://localhost:3000`

---

## 🗄️ Database Schema

### Users Table
```sql
id (UUID) - Primary Key
email (TEXT) - Unique email
role (TEXT) - 'free' | 'subscriber'
created_at (TIMESTAMP)
```

### Deals Table
```sql
id (UUID) - Primary Key
title (TEXT) - Deal title
is_active (BOOLEAN) - Active status
expires_at (TIMESTAMP) - Expiration date
created_at (TIMESTAMP)
```

### Prices Table
```sql
id (UUID) - Primary Key
deal_id (UUID) - Foreign Key to deals
amount (INTEGER) - Price in cents
created_at (TIMESTAMP)
```

### Wishlist Table
```sql
id (UUID) - Primary Key
user_id (UUID) - Foreign Key to users
deal_id (UUID) - Foreign Key to deals
alert_enabled (BOOLEAN) - Price alert enabled
created_at (TIMESTAMP)
```

---

## 🔌 API Endpoints

### Wishlist Routes (`/api/wishlist`)

**GET /api/wishlist**
- Fetch all wishlist items for authenticated user
- Returns: Array of wishlist items with active deals and best prices

**POST /api/wishlist**
- Add a deal to wishlist
- Body: `{ dealId: string (UUID), alertEnabled?: boolean }`
- Returns: Created wishlist item
- **Access**: Alerts require 'subscriber' role

**DELETE /api/wishlist/:id**
- Remove item from wishlist
- Returns: Success message

---

## 🔐 Authentication

All API endpoints require authentication via the `authMiddleware`. The middleware:
- Extracts user information from request headers
- Validates user role (free/subscriber)
- Attaches user data to `req.user`

```typescript
// Usage in routes
router.get("/", async (req: any, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  // ...
});
```

---

## ✅ Validation

The project uses **Zod** for schema validation:

### Wishlist Validator
```typescript
addWishlistSchema = z.object({
  dealId: z.string().uuid(),
  alertEnabled: z.boolean().optional(),
})
```

All form inputs and API requests are validated against these schemas before processing.

---

## 📊 Features

### Core Features
✅ User authentication & role-based access control
✅ Wishlist management (add/remove deals)
✅ Real-time price tracking
✅ Active deal filtering (inactive & expired deals hidden)
✅ Best price calculation for each deal

### Premium Features (Subscriber Only)
✅ Price alert notifications
✅ Alert management

### Analytics
- Event tracking system in `backend/utils/analytics.ts`
- Track user actions like wishlist additions, alert enablements

---

## 🚀 Build & Deploy

### Build Frontend
```bash
npm run build
```
Output: `dist/` directory

### Build Backend
```bash
cd backend
# TypeScript compilation via package.json build script
```

### Lint Code
```bash
npm run lint
```

---

## 🐛 Common Issues & Solutions

### Issue: "Failed query" database errors
**Solution**: Run migrations to create database tables
```bash
psql -U postgres -d buzdealz -f backend/db/migrate.sql
```

### Issue: Invalid UUID validation errors
**Solution**: Ensure dealId is a valid UUID format (e.g., `550e8400-e29b-41d4-a716-446655440000`)

### Issue: Authentication errors
**Solution**: Verify auth middleware is passing correct user data in request headers

---

## 📝 Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** in frontend (`src/`) or backend (`backend/`)

3. **Type check**
   ```bash
   npm run build
   ```

4. **Lint**
   ```bash
   npm run lint
   ```

5. **Test locally** before committing

---

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `server.ts` | Express app initialization & middleware setup |
| `db/migrate.sql` | SQL schema & table definitions |
| `db/schema/*.ts` | Drizzle ORM table definitions |
| `routes/wishlist.routes.ts` | Wishlist API endpoints |
| `middlewares/auth.ts` | Authentication & authorization |
| `validators/wishlist.validators.ts` | Input validation schemas |
| `utils/db.ts` | Database connection & queries |
| `utils/analytics.ts` | User event tracking |
| `src/pages/*.tsx` | Page components |
| `src/api/wishlist.ts` | Frontend API client |

---

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Run eslint before committing
4. Test API endpoints with valid UUIDs
5. Ensure migrations are run for database changes

---

## 📄 License

ISC

---

## 👤 Author

BuzDealz Development Team

---

**Last Updated**: January 18, 2026
