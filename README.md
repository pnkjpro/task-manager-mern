# TaskFlow — MERN Task Management Application

A production-ready task management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **JWT Authentication** — Register, login, and secure routes with JSON Web Tokens
- **Role-Based Access** — User and Admin roles with different permissions
- **Task CRUD** — Create, read, update, and delete tasks
- **Admin Assignment** — Admins can assign tasks to any user
- **Dashboard** — Stats cards with MongoDB aggregation, filters, sorting, and search
- **Dark/Light Theme** — Toggle with system preference detection and localStorage persistence
- **Responsive Design** — Mobile-friendly layout
- **Pagination** — Paginated task list
- **Toast Notifications** — User feedback for all actions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Redux Toolkit, Tailwind CSS 3 |
| Backend | Node.js, Express 5, Mongoose 9 |
| Database | MongoDB Atlas |
| Auth | JWT + bcrypt |
| Testing | Jest + Supertest (backend), Vitest + React Testing Library (frontend) |

## Getting Started

### Prerequisites

- Node.js 20+ 
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd mern
```

### 2. Setup Server

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
```

### 3. Setup Client

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Admin User (Optional)

```bash
cd server
npm run seed
```

This creates an admin account:
- Email: `admin@taskflow.com`
- Password: `admin123`

### 5. Run Development Servers

**Backend** (port 5000):
```bash
cd server
npm run dev
```

**Frontend** (port 3000):
```bash
cd client
npm run dev
```

## Running Tests

### Backend Tests (Jest + Supertest)
```bash
cd server
npm test
```

### Frontend Tests (Vitest + RTL)
```bash
cd client
npm test
```

## API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |

### Tasks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tasks` | Get tasks (filtered, sorted, paginated) | Private |
| POST | `/api/tasks` | Create task | Private |
| PUT | `/api/tasks/:id` | Update task | Private |
| DELETE | `/api/tasks/:id` | Delete task | Private |
| GET | `/api/tasks/stats` | Get aggregated stats | Private |

### Users
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/users` | List users for assignment | Admin |

**Query parameters for `GET /api/tasks`:**
- `search` — text search in title/description
- `status` — `todo`, `in-progress`, `done`
- `priority` — `low`, `medium`, `high`
- `sortBy` — `dueDate`, `priority`
- `sortOrder` — `asc`, `desc`
- `page` — page number

## Project Structure

```
mern/
├── client/                     # React frontend
│   ├── src/
│   │   ├── app/                # Redux store
│   │   ├── components/         # Shared components (Header, ProtectedRoute, ThemeToggle)
│   │   ├── features/
│   │   │   ├── auth/           # Login, Register, authSlice, authService
│   │   │   ├── tasks/          # Dashboard, TaskCard, TaskForm, TaskFilters, taskSlice
│   │   │   └── users/          # userService
│   │   ├── tests/              # Frontend tests
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css           # Design system (CSS variables + component styles)
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                     # Express backend
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Auth, Task controllers
│   ├── middleware/              # Auth, Error, Logger middleware
│   ├── models/                 # User, Task Mongoose models
│   ├── routes/                 # Auth, Task, User routes
│   ├── tests/                  # Backend tests
│   ├── utils/                  # JWT token generator
│   ├── app.js                  # Express app config
│   ├── server.js               # Entry point (DB + listen)
│   └── seed.js                 # Admin seed script
│
├── memory.md                   # Project memory & execution plan
└── README.md
```

## Scripts

### Server
| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `nodemon server.js` | Development server with hot reload |
| `npm start` | `node server.js` | Production server |
| `npm run seed` | `node seed.js` | Create admin user |
| `npm test` | `jest` | Run backend tests |

### Client
| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | `vite` | Development server |
| `npm run build` | `vite build` | Production build |
| `npm test` | `vitest run` | Run frontend tests |
