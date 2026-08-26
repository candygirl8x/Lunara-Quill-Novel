# 🪶 Lunara Quill — AI Novel & Story Generator Platform

> A full-stack AI-driven web platform for generating cohesive, realistic, and anti-repetitive novel chapters in both English and Hindi.

---

## 📖 Overview

**Lunara Quill** combines a distraction-free client interface with a backend continuity engine. It prevents repetitive tropes, recycled environments, time loops, and redundant character emotions across novels spanning from 1 to 20 chapters.

---

## ✨ Features

- **Anti-Repetition Validation:** Actively filters n-gram phrase collisions, duplicate settings, and emotional stagnation across chapters.
- **Bilingual Generation:** High-quality literary English and Hindi chapters.
- **Dynamic Story Continuity:** Maintains evolving relationship dynamics, sensory registries, and world rules.
- **On-Demand Chapter Creation:** Seamlessly outline and write sequential chapters as readers progress.
- **Offline & Cloud Storage Support:** Supports local in-memory/localStorage caching as well as persistent Firebase Firestore syncing.
- **Modern Reader UI:** Customizable themes (Light, Dark, Sepia), Text-to-Speech (TTS), bookmarks, personal chapter notes, and TXT export.

---

## 🏗️ Architecture

```text
Frontend (index.html)
   │
   ▼ HTTP (JSON API)
Express.js Backend (server.js)
   │
   ├── Continuity Engine (Tracks Places, Emotions, Time & Plot State)
   ├── AI Novelist Engine (Groq / Qwen 3.6 / OpenAI)
   ├── Anti-Repetition Validator (N-Gram & Setting Check)
   │
   ▼
Firestore / Local Database Sync
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or later)
- An API Key from Groq Console or OpenAI Platform

---

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/candygirl8x/Lunara-Quill-Novel.git
   cd Lunara-Quill-Novel/novel-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in `novel-backend/`:
   ```env
   PORT=5000
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

4. **Start the development server:**
   ```bash
   node server.js
   ```

---

### Frontend Setup

1. Open `index.html` directly in your browser.
2. Navigate to **Create Novel**, enter your story prompt, and start writing.

---

## 🛠️ Tech Stack

- **Frontend:** Semantic HTML5, Vanilla CSS3, JavaScript (ES6+)
- **Backend:** Node.js, Express.js
- **AI Engine:** Groq Cloud API
- **Database:** Firebase Firestore / In-Memory Store

---

## 🛡️ License

MIT License
