# AI Study Assistant 🧠

A professional, full-stack AI-powered study platform for B.Tech CSE students.

## ⚡ Quick Start (30 seconds)

### Option 1 — Double-click to run
```
Double-click: ai-study-assistant/backend/start.bat
Then open: http://localhost:5000
```

### Option 2 — Command line
```bash
cd ai-study-assistant/backend
npm install        # (already done if you got this from the project)

# Windows
start.bat

# Mac/Linux  
PORT=5000 JWT_SECRET=mysecret node server.js
```

Then open **http://localhost:5000** in your browser.

---

## 🔑 Demo Login
Click **"Demo Login"** on the login page — no account needed.

Or register a new account at http://localhost:5000/pages/register.html

---

## 📄 Pages

| URL | Page |
|-----|------|
| `http://localhost:5000` | Landing Page |
| `/pages/login.html` | Login |
| `/pages/register.html` | Register |
| `/pages/dashboard.html` | Dashboard |
| `/pages/ai-tutor.html` | AI Tutor (ChatGPT-style) |
| `/pages/notes.html` | Notes Summarizer + Library |
| `/pages/quiz.html` | Quiz Generator |
| `/pages/flashcards.html` | Flashcards |
| `/pages/planner.html` | Study Planner |
| `/pages/progress.html` | Progress & Analytics |
| `/pages/subjects.html` | Subject Management |
| `/pages/profile.html` | Profile |
| `/pages/settings.html` | Settings |

---

## 🗄️ Database

The app works in two modes:

| Mode | Description |
|------|-------------|
| **Memory Mode** (default) | No setup needed. Data is lost on server restart. Perfect for demo. |
| **MongoDB Mode** | Install MongoDB, uncomment `MONGODB_URI` in `start.bat`. Data persists. |

---

## 🤖 AI Integration

The app works with **realistic mock AI responses** by default.

To use real OpenAI GPT-3.5:
1. Get an API key from https://platform.openai.com
2. Open `backend/start.bat`
3. Uncomment and set: `set OPENAI_API_KEY=sk-your-key-here`
4. Restart the server

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login  
- `GET  /api/auth/me` — Get current user
- `PUT  /api/auth/profile` — Update profile
- `PUT  /api/auth/change-password` — Change password

### AI
- `POST /api/ai/chat` — AI Tutor chat
- `POST /api/ai/summarize` — Notes summarizer
- `POST /api/ai/quiz` — Generate quiz questions
- `POST /api/ai/flashcards` — Generate flashcards
- `GET  /api/ai/recommendations` — Personalised recommendations

### Data
- `GET/POST   /api/notes` — Notes CRUD
- `GET/POST   /api/quiz` — Quiz management
- `PUT        /api/quiz/:id/submit` — Submit quiz answers
- `GET/POST   /api/flashcards` — Flashcard sets
- `GET/POST   /api/planner` — Study plans
- `POST       /api/progress/log` — Log study session
- `GET        /api/progress` — Get progress
- `GET/POST   /api/subjects` — Subject management

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS, Bootstrap 5, Chart.js, Font Awesome |
| Backend | Node.js 18+, Express.js |
| Database | MongoDB + Mongoose (optional — in-memory fallback included) |
| Auth | JWT + bcrypt |
| AI | OpenAI GPT-3.5 (optional — realistic mock fallback included) |

---

## ✅ Features

- ✅ AI Tutor — ChatGPT-style academic chatbot for CSE subjects
- ✅ Notes Summarizer — AI-generated summaries, key points, exam notes
- ✅ Quiz Generator — MCQ with 4 options, explanations, weak topic analysis
- ✅ Flashcards — Flip animation, known/review marking, shuffle
- ✅ Study Planner — AI-generated + manual task management
- ✅ Progress Tracking — Charts, study streak, subject progress
- ✅ Subject Management — Topics, completion tracking
- ✅ Demo Mode — Works without MongoDB or OpenAI API key
- ✅ Responsive Design — Works on mobile and desktop
