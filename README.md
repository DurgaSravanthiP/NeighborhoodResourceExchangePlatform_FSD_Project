# 🏘️ NeighbourShare — Neighborhood Resource Exchange Platform

A full-stack MERN application where community members can **lend and borrow** everyday items with real-time chat.

---

## 🛠️ Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | React 18, Vite, Tailwind CSS, React Router DOM |
| Backend     | Node.js, Express.js                     |
| Database    | MongoDB Atlas + Mongoose                |
| Auth        | JWT + bcryptjs                          |
| Real-time   | Socket.io                               |
| HTTP Client | Axios                                   |
| Notifications | React Toastify                        |

---

## 📁 Project Structure

```
neighbourhood/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → authController, itemController, requestController, messageController
│   ├── middleware/     → JWT auth middleware
│   ├── models/         → User, Item, BorrowRequest, Message schemas
│   ├── routes/         → auth, items, requests, messages
│   ├── server.js       → Express + Socket.io server
│   ├── .env            → Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/ → Navbar, ItemCard, ProtectedRoute
    │   ├── context/    → AuthContext (global auth state)
    │   ├── pages/      → Home, Login, Register, Dashboard, Browse,
    │   │                  ItemDetail, ItemForm, MyItems, Requests,
    │   │                  Messages, Profile
    │   ├── services/   → api.js (Axios), socket.js (Socket.io)
    │   ├── App.jsx     → Routes
    │   └── main.jsx    → Entry point
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+ and npm installed
- Git installed
- Internet connection (for MongoDB Atlas)

---

### Step 1 — Clone / Extract the project

```bash
# If using git
git init
git add .
git commit -m "Initial commit"
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Your `.env` is already configured with:
```
PORT=5000
MONGO_URI=mongodb+srv://chhimakshi_db_user:...@neighbourhood01...
JWT_SECRET=neighbourhood_secret_key_2024_secure
NODE_ENV=development
```

Start the backend:
```bash
npm run dev        # with nodemon (auto-restart)
# OR
npm start          # without nodemon
```

✅ You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: neighbourhood01.fivpnei.mongodb.net
```

---

### Step 3 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

✅ App runs at: **http://localhost:5173**

---

## 🌐 API Endpoints

### Auth
| Method | Route               | Access  | Description         |
|--------|---------------------|---------|---------------------|
| POST   | /api/auth/register  | Public  | Register new user   |
| POST   | /api/auth/login     | Public  | Login user          |
| GET    | /api/auth/profile   | Private | Get logged-in user  |
| PUT    | /api/auth/profile   | Private | Update profile      |

### Items
| Method | Route              | Access  | Description            |
|--------|--------------------|---------|------------------------|
| GET    | /api/items         | Public  | Get all items (filter) |
| GET    | /api/items/:id     | Public  | Get single item        |
| GET    | /api/items/my-items| Private | Get my items           |
| POST   | /api/items         | Private | Create item            |
| PUT    | /api/items/:id     | Private | Update item (owner)    |
| DELETE | /api/items/:id     | Private | Delete item (owner)    |

### Borrow Requests
| Method | Route                     | Access  | Description            |
|--------|---------------------------|---------|------------------------|
| POST   | /api/requests             | Private | Send borrow request    |
| GET    | /api/requests/received    | Private | Requests I received    |
| GET    | /api/requests/sent        | Private | Requests I sent        |
| PUT    | /api/requests/:id/status  | Private | Accept/Reject/Return   |

### Messages
| Method | Route                      | Access  | Description              |
|--------|----------------------------|---------|--------------------------|
| GET    | /api/messages/conversations| Private | All conversation partners|
| GET    | /api/messages/:userId      | Private | Chat with specific user  |
| POST   | /api/messages              | Private | Send a message           |

---

## ✅ Features Implemented

- [x] User Registration & Login with JWT
- [x] Password hashing with bcryptjs
- [x] Protected routes (frontend + backend)
- [x] Item listing with CRUD (Create, Read, Update, Delete)
- [x] Category filtering and search
- [x] Availability status tracking (available / borrowed)
- [x] Borrow request system (pending → approved / rejected → returned)
- [x] Real-time chat with Socket.io
- [x] Typing indicators
- [x] Conversation list
- [x] User profile management
- [x] Responsive UI (mobile + desktop)
- [x] Toast notifications

---

## 🔌 Socket.io Events

| Event          | Direction        | Description                |
|----------------|------------------|----------------------------|
| userOnline     | client → server  | Register user as online    |
| onlineUsers    | server → client  | List of online user IDs    |
| sendMessage    | client → server  | Send a chat message        |
| receiveMessage | server → client  | Receive a chat message     |
| typing         | client → server  | User is typing             |
| typing         | server → client  | Notify receiver of typing  |

---

## 🗃️ MongoDB Collections

### Users
```json
{ "_id", "name", "email", "password(hashed)", "location", "bio", "profileImage", "createdAt" }
```

### Items
```json
{ "_id", "title", "description", "category", "ownerId", "availabilityStatus", "image", "location", "createdAt" }
```

### BorrowRequests
```json
{ "_id", "itemId", "borrowerId", "ownerId", "status", "message", "requestDate" }
```

### Messages
```json
{ "_id", "senderId", "receiverId", "message", "requestId", "timestamp" }
```

---

## 💡 User Flow

**Lender:** Register → Add Item → Receive Requests → Accept/Reject → Mark as Returned

**Borrower:** Register → Browse Items → Send Request → Chat with Owner → Borrow Item

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection fails | Check MONGO_URI in `.env`, ensure your IP is whitelisted in Atlas |
| CORS errors | Backend must run on port 5000, frontend on 5173 |
| Socket not connecting | Ensure backend is running before frontend |
| npm install fails | Use Node.js 18 or higher |

---

## 📦 Key npm Packages

**Backend:** express, mongoose, jsonwebtoken, bcryptjs, cors, dotenv, nodemon, socket.io

**Frontend:** react, react-router-dom, axios, socket.io-client, react-toastify, react-icons, tailwindcss
