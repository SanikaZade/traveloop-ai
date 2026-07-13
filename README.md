<p align="center">
  <img src="https://img.shields.io/badge/TravelLoop-v1.0.0-4F46E5?style=for-the-badge" alt="TravelLoop" />
  <img src="https://img.shields.io/badge/Stack-MERN-10B981?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/Hackathon-Odoo%202026-F59E0B?style=for-the-badge" alt="Odoo Hackathon 2026" />
</p>

<h1 align="center">✈️ TravelLoop</h1>

<p align="center">
  <strong>A production-grade, AI-era travel planning SaaS platform.</strong><br />
  Plan multi-city itineraries, track budgets, manage packing lists, journal your travels, and share your adventures with the world.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#folder-structure">Structure</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#api">API Reference</a>
</p>

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | JWT-based signup/login with persistent sessions and protected routes |
| 🗺️ **Trip Dashboard** | Create, view, and delete trips with cover images and trip details |
| 🧭 **Itinerary Builder** | Drag-and-drop vertical timeline to reorder city stops dynamically |
| 🏙️ **City Explorer** | Search 12+ destinations and add them to your itinerary in one click |
| 🎯 **Activity Planner** | Browse 30+ activities per city with costs, durations, and types |
| 💰 **Budget Tracker** | Log expenses by category with real-time Recharts donut charts |
| 🎒 **Packing Checklist** | Categorized, auto-saving packing lists with progress tracking |
| 📓 **Trip Journal** | Timestamped notes and travel journal entries per trip |
| 🌍 **Public Sharing** | Generate shareable URLs for read-only public trip views |
| 📋 **Trip Duplication** | Copy any public trip to your own account in one click |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18 + Vite** | Fast SPA with hot module replacement |
| **Tailwind CSS 3** | Utility-first styling with custom glassmorphism design system |
| **Framer Motion** | Smooth page transitions and micro-animations |
| **react-beautiful-dnd** | Drag-and-drop itinerary reordering |
| **Recharts** | Budget analytics pie charts |
| **react-hot-toast** | Global toast notification system |
| **Axios** | HTTP client with request/response interceptors |
| **React Router v6** | Client-side routing with protected routes |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js + Express** | REST API server with MVC architecture |
| **MongoDB + Mongoose** | Document database with schema validation |
| **JWT + bcryptjs** | Authentication and password hashing |
| **express-async-errors** | Global async error handling |
| **Morgan** | HTTP request logging |
| **Zod** | Schema validation |

---

## 📁 Folder Structure

```
TravelLoop/
├── frontend/
│   ├── src/
│   │   ├── components/         # Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   └── Transitions.jsx # PageTransition, LoadingSkeleton, EmptyState
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/           # Login, Signup
│   │   │   ├── city/           # CityExplorer
│   │   │   ├── dashboard/      # Dashboard
│   │   │   ├── public/         # PublicTrip (shareable view)
│   │   │   └── trip/           # ItineraryBuilder, BudgetDashboard,
│   │   │                       # PackingList, TripNotes, TripDetail
│   │   ├── services/           # Axios API service layer
│   │   │   ├── api.js          # Base Axios instance + interceptors
│   │   │   ├── auth.service.js
│   │   │   ├── budget.service.js
│   │   │   ├── city.service.js
│   │   │   ├── itinerary.service.js
│   │   │   ├── note.service.js
│   │   │   ├── packing.service.js
│   │   │   ├── public.service.js
│   │   │   └── trip.service.js
│   │   ├── App.jsx             # Routes + AnimatePresence
│   │   ├── main.jsx            # App entry, BrowserRouter, Toaster
│   │   └── index.css           # Design system + glassmorphism utilities
│   ├── vercel.json             # Vercel SPA routing config
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── api/v1/
    │   │   ├── controllers/    # Business logic
    │   │   │   ├── auth.controller.js
    │   │   │   ├── trip.controller.js
    │   │   │   ├── itinerary.controller.js
    │   │   │   ├── city.controller.js
    │   │   │   ├── budget.controller.js
    │   │   │   ├── packing.controller.js
    │   │   │   ├── note.controller.js
    │   │   │   └── public.controller.js
    │   │   └── routes/         # Express routers
    │   │       ├── index.js    # Master router
    │   │       ├── auth.routes.js
    │   │       ├── trip.routes.js
    │   │       ├── itinerary.routes.js
    │   │       ├── city.routes.js
    │   │       ├── budget.routes.js
    │   │       ├── packing.routes.js
    │   │       ├── note.routes.js
    │   │       └── public.routes.js
    │   ├── config/
    │   │   └── db.js           # MongoDB connection
    │   ├── data/
    │   │   ├── cities.json     # 12 curated destinations
    │   │   └── activities.json # 32 activities
    │   ├── middlewares/
    │   │   └── auth.middleware.js
    │   ├── models/
    │   │   ├── User.model.js
    │   │   ├── Trip.model.js
    │   │   ├── Itinerary.model.js
    │   │   ├── Budget.model.js
    │   │   ├── PackingList.model.js
    │   │   └── Note.model.js
    │   ├── app.js
    │   └── server.js
    ├── .env.example
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local install or [MongoDB Atlas](https://cloud.mongodb.com))
- **npm** v9+

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/travelloop.git
cd travelloop
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL to your backend URL
npm install
npm run dev
```

### 4. Open the app
Navigate to `http://localhost:5173`

---

## 🌐 Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to a GitHub repository
2. Import into [vercel.com](https://vercel.com)
3. Set environment variable:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api/v1
   ```
4. The included `vercel.json` handles SPA routing automatically

### Backend → Render

1. Push the `backend/` folder to a GitHub repository
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from `.env.example`:
   ```
   MONGO_URI = mongodb+srv://...    (MongoDB Atlas connection string)
   JWT_SECRET = <strong-random-string>
   NODE_ENV = production
   PORT = 10000
   ```
<img width="1132" height="896" alt="Screenshot 2026-05-10 142041" src="https://github.com/user-attachments/assets/27df000f-28d0-4b2f-a180-415213637fdb" />
<img width="1052" height="868" alt="Screenshot 2026-05-10 141541" src="https://github.com/user-attachments/assets/1f8d5f87-ba12-493e-82f7-1f7e5eb849c4" />

### MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Whitelist `0.0.0.0/0` (all IPs) for Render deployment
3. Create a database user and copy the connection string to `MONGO_URI`

---

## 📡 API Reference

Base URL: `/api/v1`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Create a new user account |
| `POST` | `/auth/login` | Login and receive JWT token |
| `GET`  | `/auth/me` | Get current authenticated user |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/trips` | Get all trips for the logged-in user |
| `POST` | `/trips` | Create a new trip |
| `GET`  | `/trips/:id` | Get a single trip |
| `PUT`  | `/trips/:id` | Update a trip |
| `DELETE` | `/trips/:id` | Delete a trip |

### Itinerary
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/trips/:tripId/itinerary` | Get the trip itinerary (stops) |
| `PUT`  | `/trips/:tripId/itinerary` | Save/reorder itinerary stops |

### Budget
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/trips/:tripId/budget` | Get the budget and expenses |
| `PUT`  | `/trips/:tripId/budget` | Update total budget |
| `POST` | `/trips/:tripId/budget/expenses` | Add a new expense |
| `DELETE` | `/trips/:tripId/budget/expenses/:expenseId` | Delete an expense |

### Packing List
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/trips/:tripId/packing` | Get the packing list |
| `PUT`  | `/trips/:tripId/packing` | Save the packing list |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/trips/:tripId/notes` | Get all notes |
| `POST` | `/trips/:tripId/notes` | Create a note |
| `PUT`  | `/trips/:tripId/notes/:noteId` | Update a note |
| `DELETE` | `/trips/:tripId/notes/:noteId` | Delete a note |

### Cities
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/cities` | Get all cities |
| `GET`  | `/cities/search?q=tokyo` | Search cities by name |
| `GET`  | `/cities/:cityId/activities` | Get activities for a city |

### Public Sharing
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| `GET`  | `/public/trips/:tripId` | View a public trip | No |
| `POST` | `/public/trips/:tripId/copy` | Copy a public trip | Yes |

---

## 🎨 Design System

TravelLoop uses a custom **glassmorphism** design language:

- **Color Palette**: Deep `#030712` background with `#4F46E5` indigo primary and `#10B981` emerald accent
- **Glass Effect**: Multi-layer backdrop-blur with subtle white border overlays
- **Typography**: Inter font with consistent weight hierarchy (400/500/600/700/800)
- **Animations**: Framer Motion with `easeOut` curves and staggered list reveals
- **Shadows**: Layered box-shadows with color-specific glow effects

---

<p align="center">Made with ❤️ and lots of ✈️ dreams</p>
