# 🏘️ Neighborhood Resource Exchange Platform

A full-stack MERN application where community members can **lend and borrow** everyday items with real-time chat, read receipts, typing indicators, and smart notifications.

---
## 🎥 Project Videos

- 🎬 **Code Explanation Video:** https://drive.google.com/file/d/1H-ga7xQ0hl-nz7jGS2aZDtOUJfjH8sot/view?usp=drive_link   
- 📊 **Project Overview Video:** https://drive.google.com/your-project-overview-link
  
---
🌐 **Live Demo:** [https://neighborhood-resource-exchange-platform.onrender.com](https://neighborhood-resource-exchange-platform.onrender.com)

---

## 🛠️ Tech Stack

| Layer         | Technology                                          |
|---------------|-----------------------------------------------------|
| Frontend      | React 18, Vite, Tailwind CSS, React Router DOM      |
| Backend       | Node.js, Express.js                                 |
| Database      | MongoDB Atlas + Mongoose                            |
| Auth          | JWT + bcryptjs (session-based, no cross-tab persist)|
| Real-time     | Socket.io                                           |
| File Uploads  | Cloudinary + Multer                                 |
| HTTP Client   | Axios                                               |
| Notifications | React Toastify                                      |

---

## 📁 Project Structure

```
neighbourhood/
├── package.json            → Root scripts for Render deployment
│
├── backend/
│   ├── config/             → MongoDB & Cloudinary config
│   ├── controllers/        → authController, itemController, requestController,
│   │                          messageController, notificationController, reviewController
│   ├── middleware/         → JWT auth middleware
│   ├── models/             → User, Item, BorrowRequest, Message, Notification, Review schemas
│   ├── routes/             → auth, items, requests, messages, upload, reviews, notifications
│   ├── seedData.js         → Script to seed demo users and items
│   ├── server.js           → Express + Socket.io server (serves frontend in production)
│   ├── .env                → Environment variables (not committed)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     → Navbar, ItemCard, NotificationBell, ReviewStars, ProtectedRoute
    │   ├── context/        → AuthContext (sessionStorage-based auth)
    │   ├── pages/          → Home, Login, Register, Dashboard, Browse,
    │   │                      ItemDetail, ItemForm, MyItems, Requests,
    │   │                      Messages, Profile
    │   ├── services/       → api.js (Axios), socket.js (Socket.io events)
    │   ├── App.jsx         → Routes
    │   └── main.jsx        → Entry point
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ✅ Features Implemented

### 👤 Authentication & Security
- [x] User Registration & Login with JWT
- [x] Password hashing with bcryptjs
- [x] **Session-based auth** using `sessionStorage` (no cross-tab auto-login)
- [x] Optional **profile image** on registration (URL or file upload)
- [x] Protected routes (frontend + backend middleware)

### 📦 Items & Borrowing
- [x] Item listing with full CRUD (Create, Read, Update, Delete)
- [x] Category filtering and keyword search on Browse page
- [x] Availability status tracking (`available` / `borrowed`)
- [x] Image upload via Cloudinary
- [x] Borrow request system: `pending → approved / rejected → returned`
- [x] Owner review and rating system after return

### 💬 Real-Time Messaging
- [x] Real-time chat with Socket.io
- [x] **Sidebar unread badge** (1, 2, 3...) persisted in database across refreshes
- [x] **Typing indicator** in sidebar and chat window
- [x] **Message read receipts**: Sent → Delivered → Seen
- [x] Sidebar search with "Not available" state
- [x] Conversations list with last message preview

### 🔔 Notifications
- [x] Bell icon badge with unread notification count
- [x] Real-time toast pop-ups for new messages and borrow requests
- [x] Notification types: new messages, request updates
- [x] Mark notifications as read

### 👤 Profile Management
- [x] View and edit name, bio, location
- [x] Change password with show/hide eye toggle
- [x] Change profile image (paste URL or upload a file)
- [x] View community trust ratings & reviews received
- [x] Profile image shown as avatar across the app

### 🎨 UI/UX
- [x] Responsive design (mobile + desktop)
- [x] Interactive "How it works" section with hover animations
- [x] Clean, curated item showcase on homepage
- [x] Dark/light themed components using Tailwind CSS
- [x] Hide default Edge password reveal icon (custom eye icon only)

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js v18+ and npm installed
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Step 1 — Clone the Repository

```bash
git clone https://github.com/himakshi-08/Neighborhood-resource-exchange-platform.git
cd Neighborhood-resource-exchange-platform
```

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

✅ You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected
```

### Step 3 — Frontend Setup

Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

✅ App runs at: **http://localhost:5173**

---

### Step 4 — (Optional) Seed Demo Data

To populate the database with demo users and items:
```bash
cd backend
node seedData.js
```

Demo users created:
| Name  | Email           | Password |
|-------|-----------------|----------|
| Sofia | sofia@gmail.com | sofia@1  |
| John  | john@gmail.com  | john@1   |
| Emma  | emma@gmail.com  | emma@1   |
| Mike  | mike@gmail.com  | mike@1   |

---

## 🌐 API Endpoints

### Auth
| Method | Route               | Access  | Description              |
|--------|---------------------|---------|--------------------------|
| POST   | /api/auth/register  | Public  | Register new user        |
| POST   | /api/auth/login     | Public  | Login user               |
| GET    | /api/auth/profile   | Private | Get logged-in user       |
| PUT    | /api/auth/profile   | Private | Update profile + image   |

### Items
| Method | Route               | Access  | Description            |
|--------|---------------------|---------|------------------------|
| GET    | /api/items          | Public  | Get all items (filter) |
| GET    | /api/items/:id      | Public  | Get single item        |
| GET    | /api/items/my-items | Private | Get my items           |
| POST   | /api/items          | Private | Create item            |
| PUT    | /api/items/:id      | Private | Update item (owner)    |
| DELETE | /api/items/:id      | Private | Delete item (owner)    |

### Borrow Requests
| Method | Route                    | Access  | Description         |
|--------|--------------------------|---------|---------------------|
| POST   | /api/requests            | Private | Send borrow request |
| GET    | /api/requests/received   | Private | Requests I received |
| GET    | /api/requests/sent       | Private | Requests I sent     |
| PUT    | /api/requests/:id/status | Private | Accept/Reject/Return|

### Messages
| Method | Route                       | Access  | Description               |
|--------|-----------------------------|---------|---------------------------|
| GET    | /api/messages/conversations | Private | All conversation partners |
| GET    | /api/messages/:userId       | Private | Chat with specific user   |
| POST   | /api/messages               | Private | Send a message            |

### Reviews & Notifications
| Method | Route                    | Access  | Description              |
|--------|--------------------------|---------|--------------------------|
| POST   | /api/reviews             | Private | Submit a review          |
| GET    | /api/reviews/user/:id    | Private | Get user reviews         |
| GET    | /api/notifications       | Private | Get notifications        |
| PUT    | /api/notifications/:id/read | Private | Mark notification read|

### Upload
| Method | Route       | Access  | Description              |
|--------|-------------|---------|--------------------------|
| POST   | /api/upload | Private | Upload image to Cloudinary|

---

## 🔌 Socket.io Events

| Event          | Direction       | Description                        |
|----------------|-----------------|------------------------------------|
| userOnline     | client → server | Register user as online            |
| onlineUsers    | server → client | List of online user IDs            |
| sendMessage    | client → server | Send a chat message                |
| receiveMessage | server → client | Receive a chat message             |
| typing         | client → server | User is typing                     |
| typing         | server → client | Notify receiver of typing          |
| markDelivered  | client → server | Mark message as delivered          |
| markSeen       | client → server | Mark conversation messages as seen |
| messageStatus  | server → client | Real-time status update (delivered)|
| messagesSeen   | server → client | Real-time seen confirmation        |

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
{ "_id", "senderId", "receiverId", "message", "status", "requestId", "timestamp" }
```
> `status` can be: `sent` | `delivered` | `seen`

### Notifications
```json
{ "_id", "userId", "type", "message", "read", "createdAt" }
```

### Reviews
```json
{ "_id", "reviewerId", "reviewedId", "itemId", "rating", "comment", "createdAt" }
```

---

## ☁️ Deployment (Render — Single Service)

Both frontend and backend are deployed as a **single Render Web Service**. Express serves the React build in production.

- **Build Command:** `npm run build && cd backend && npm install`
- **Start Command:** `npm start`
- **Environment:** Node

### Required Environment Variables on Render:
```
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=https://neighborhood-resource-exchange-platform.onrender.com
```

---

## 💡 User Flow

**Lender:** Register → Add Item with Photo → Receive Requests → Accept/Reject → Mark as Returned → Receive Review

**Borrower:** Register → Browse Items → Send Request with Message → Chat with Owner → Borrow Item → Leave Review

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection fails | Check `MONGO_URI` in `.env`, whitelist your IP in Atlas |
| CORS errors locally | Backend must run on port 5000, frontend on 5173 |
| Socket not connecting | Ensure backend is running before frontend |
| Images not loading | Check Cloudinary credentials in `.env` |
| npm install fails | Use Node.js 18 or higher |
| Vite not found on Render | Ensure build command uses `npm install --include=dev` |

---

## 📦 Key npm Packages

**Backend:** `express` `mongoose` `jsonwebtoken` `bcryptjs` `cors` `dotenv` `nodemon` `socket.io` `cloudinary` `multer` `multer-storage-cloudinary`

**Frontend:** `react` `react-router-dom` `axios` `socket.io-client` `react-toastify` `react-icons` `tailwindcss` `vite`
