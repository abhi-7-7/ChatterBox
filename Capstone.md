# 📡 ChatterBox — Full-Stack, AI-Powered Chat Platform
A real-time chat app with multi-user conversations, AI assistants (GPT, Gemini, DeepSeek), profile insights, activity tracking, uploads, and secure auth.

---
## 🧠 Overview
- ⚛️ **React + Vite Frontend** (Dashboard, Sidebar, Chat, Profile, Settings)
- 🛠️ **Node.js + Express Backend** with **Prisma ORM** on **PostgreSQL**
- 🔐 **JWT Authentication** + protected routes
- 🤖 **AI Proxy Endpoints** (GPT / Gemini / DeepSeek) with persistence
- 🌐 **Socket.io-ready** real-time hooks (typing, presence, messages)

---
## 🧩 Features
### 🔐 Authentication
- Signup / Login
- JWT-based protection
- `GET /api/auth/me` to load current user

### 💬 Chat System
- Create chat (with participants) / Delete chat (hard delete: messages + participants)
- Smart sidebar (pinned/suggested/recent/archived-ready)
- Search, unread previews, AI-protected chats

### 🤖 AI Integration
- GPT, Gemini, DeepSeek proxy routes
- Saves AI responses to DB when `chatId` is provided
- Streaming-friendly hooks in frontend

### 📨 Messages
- Send, fetch, update, delete
- Typing indicator ready (socket events)
- Supports AI/system/user senders

### 👤 Profile & Activity
- Avatar, stats, streak calendar
- Info cards (email, user id, member since)
- Logout modal

### 🎨 Theming & Sidebar
- Multi-theme palette
- Collapsible sections, hover spotlight
- Pinned / suggested / recent groupings

---
## 🗄️ Tech Stack
- **Frontend:** React, Vite, Tailwind, Axios
- **Backend:** Node.js, Express, Prisma, PostgreSQL
- **Auth:** JWT, bcryptjs
- **Realtime:** Socket.io (hooks in place)
- **AI:** OpenAI, Google Gemini, DeepSeek (via axios/fetch)

---
## 📂 Project Structure (condensed)
```
ChatterBox/
├── frontend_cap3/
│   ├── src/
│   │   ├── components/ (Sidebar, ChatWindow, Navbar, etc.)
│   │   ├── pages/ (Dashboard, Profile, Settings, ChatPage)
│   │   ├── contexts/ (ChatContext, SocketContext, UserContext)
│   │   └── services/api.js (chatAPI, messageAPI, authAPI)
├── backend_cap3/
│   ├── controllers/ (auth, chat, message, activity, upload, ai)
│   ├── routes/ (auth, chats, messages, participants, ai, uploads)
│   ├── middleware/ (authMiddleware, upload)
│   ├── prisma/ (schema.prisma, migrations/)
│   ├── config/database.js
│   └── server.js (Express + Socket.io setup)
└── capsone.md (this README)
```

---
## 🗄️ Database Schema (Prisma excerpt)
```prisma
model User {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  email        String   @unique
  password     String
  avatarUrl    String?
  createdAt    DateTime @default(now())
  messages     Message[]
  chats        Chat[]            @relation("UserChats")
  participants ChatParticipant[]
  activities   Activity[]
  sessions     Session[]
}

model Chat {
  id           Int      @id @default(autoincrement())
  title        String
  createdAt    DateTime @default(now())
  messages     Message[]
  participants ChatParticipant[]
  user         User     @relation("UserChats", fields: [userId], references: [id])
  userId       Int
}

model Message {
  id        Int      @id @default(autoincrement())
  text      String
  createdAt DateTime @default(now())
  senderId  String?
  type      String   @default("text")
  chat      Chat     @relation(fields: [chatId], references: [id])
  chatId    Int
  user      User?    @relation(fields: [userId], references: [id])
  userId    Int?
}

model ChatParticipant {
  id        Int      @id @default(autoincrement())
  chat      Chat     @relation(fields: [chatId], references: [id])
  chatId    Int
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  role      String?
  createdAt DateTime @default(now())
  @@unique([chatId, userId])
}
```

---
## 🔌 API (current key routes)
### Auth
- `POST /api/auth/signup` → `{ success, token, user }`
- `POST /api/auth/login` → `{ success, token, user }`
- `GET /api/auth/me` (Bearer) → `{ success, user }`

### Chats
- `GET /api/chats` → list (owner or participant)
- `POST /api/chats` → create with `title`, `participantIds[]`
- `POST /api/chats/find-or-create` (AI helpers) → `{ chat }`
- `DELETE /api/chats/:id` → deletes chat + messages + participants

### Messages
- `GET /api/messages/:chatId`
- `POST /api/messages` `{ chatId, text }`
- `PUT /api/messages/:id`
- `DELETE /api/messages/:id`

### AI
- `POST /api/ai/gpt`
- `POST /api/ai/gemini`
- `POST /api/ai/deepseek`
Body: `{ prompt, chatId?, stream? }` (saves AI reply if `chatId` provided)

### Participants
- `POST /api/participants/:chatId` `{ userId }` add
- `DELETE /api/participants/:chatId` `{ userId }` remove

### Uploads
- `POST /api/uploads/avatar` (protected, multer) → `avatarUrl`

---
## 📦 Environment Variables
Create `backend_cap3/.env` based on `.env.example`:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB"
PORT=3000
NODE_ENV=development
JWT_SECRET="replace-me"
JWT_EXPIRE=30d
OPENAI_API_KEY=""
GEMINI_API_KEY=""
DEEPSEEK_API_KEY=""
# optional
CORS_ORIGIN="http://localhost:5173"
```
Frontend `frontend_cap3/.env`:
```
VITE_API_URL="http://localhost:8000"
```

---
## ▶️ Setup & Run
**Backend**
```bash
cd backend_cap3
npm install
npx prisma migrate dev
npm run dev
```

**Frontend**
```bash
cd frontend_cap3
npm install
npm run dev
```

---
## 🧪 Quick Test Flow
1) Signup → Login → Grab token
2) Create chat with participantIds → Receive chat
3) Send messages to `/api/messages` → Fetch history
4) Call AI endpoint with `chatId` → AI reply saved
5) Delete chat → Verify messages + participants removed

---
## 🔒 Security Notes
- JWT auth middleware protects sensitive routes
- Chat deletion enforces ownership and cascades: messages + participants + chat
- Upload avatar route is protected
- AI routes validate prompt and API keys

---
## 🗺️ Roadmap / Nice-to-Haves
- Archive/restore chat toggle
- File attachments in messages
- Reactions and threads
- SSE/Socket streaming for AI
- Presence + typing indicators wired to socket
- Profile update API endpoints

---
## 🤝 Contribution
1. Fork → feature branch
2. Follow existing structure & linting
3. Add/adjust tests where relevant
4. Update docs if API/behavior changes
5. Open PR with clear description

---
## 🧭 Reference Docs in Repo
- `backend_cap3/README.md` — backend setup & endpoints
- `backend_cap3/TESTING.md` — exhaustive test flows
- `backend_cap3/ARCHITECTURE.md` — system design & diagrams
- `backend_cap3/STATUS.md` — deployment & status guide
- `CHANGES_DETAILED.md` — exact code change locations
- `QUICK_START.md` — 2-minute spin-up guide

---
## 🎯 Final Summary: Message Sender & Chat Deletion Implementation

### ✅ Implementation Complete
- Sender headers now show the author above each message; your messages show "You"; AI shows provider names; graceful fallback for unknown senders.
- Chat deletion now removes chat, messages, and participant records to avoid orphaned data.

### 🔧 Code Touchpoints
- Frontend [frontend_cap3/src/pages/ChatPage/ChatPage.jsx](frontend_cap3/src/pages/ChatPage/ChatPage.jsx) — MessageBubble header logic, participant lookup, participant state/load, and passing participants into the message list.
- Backend [backend_cap3/controllers/chatController.js](backend_cap3/controllers/chatController.js) — `deleteChat` now deletes messages then participants then chat.

### 📚 Documentation Produced
- Root docs: INDEX, QUICK_START, IMPLEMENTATION_COMPLETE, CHANGES_DETAILED, FEATURE_SUMMARY, README_MESSAGE_SENDER_AND_DELETION, COMPLETION_SUMMARY, FINAL_SUMMARY (merged here), QUICK_REF, START_HERE.
- Backend docs: MESSAGE_SENDER_AND_DELETE_SUMMARY, DELETE_TEST.

### 🧪 Fast Verification
- Start backend and frontend.
- Create two users, create a chat, exchange messages → sender headers visible.
- Delete the chat → chat gone; API access blocked; DB has no orphaned participants/messages.

### ✅ Quality & Safety
- No new dependencies; JWT-protected routes; deletion respects ownership; AI routes validate payloads.

---
Happy building! 🚀
