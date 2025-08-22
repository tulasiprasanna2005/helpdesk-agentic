# Helpdesk Agentic – Smart AI-Powered Support System

## 📌 Overview
This project implements a **Smart Helpdesk with Agentic Triage**.  
Users can raise support tickets, and an AI agent (stubbed LLM workflow) triages them by:
- Classifying ticket category (billing, tech, shipping, other).
- Retrieving relevant knowledge base (KB) articles.
- Drafting an automated reply with citations.
- Either auto-resolving or assigning to a human support agent.

This was built as part of the **Wexa AI Fresher Assignment**.

---

## 🚀 Features
- **Authentication & Roles**: JWT-based login/signup with roles (Admin, Agent, User).
- **Knowledge Base Management**: Admins can CRUD articles.
- **Ticket Lifecycle**: Users create tickets, view status, and track updates.
- **Agentic Triage**: Automatic classification, KB retrieval, reply drafting.
- **Audit Log**: Every action is logged with timestamps & trace IDs.
- **Agent Review**: Agents can accept/edit AI drafts and resolve tickets.
- **Configurable Settings**: Admins can adjust confidence thresholds & auto-close rules.
- **Dockerized Setup**: Run the entire stack with one command.

---

## 🏗️ Architecture
```mermaid
flowchart LR
  User -->|Create Ticket| Frontend[React + Vite]
  Frontend --> Backend[Node.js + Express + MongoDB]
  Backend --> Agent[Agentic Workflow Stub]
  Backend --> DB[(MongoDB)]
  Agent --> KB[(Knowledge Base)]
  Agent --> Audit[(Audit Logs)]


Frontend: React (Vite, Tailwind optional, React Router for pages)

Backend: Node.js + Express + Mongoose

Database: MongoDB Atlas / local Mongo

Agentic Logic: Stubbed LLM (keyword-based classification + reply drafting)

Containerization: Docker Compose (frontend, backend, MongoDB)

⚙️ Installation & Setup
1️⃣ Clone the repo
git clone https://github.com/tulasiprasanna2005/helpdesk-agentic.git
cd helpdesk-agentic

2️⃣ Environment variables

Create a .env file in the backend folder:

PORT=8080
MONGO_URI=mongodb://mongo:27017/helpdesk
JWT_SECRET=your-secret
AUTO_CLOSE_ENABLED=true
CONFIDENCE_THRESHOLD=0.75
STUB_MODE=true

3️⃣ Run with Docker (Recommended)
docker-compose up --build

4️⃣ Run manually (without Docker)

Backend:

cd backend
npm install
npm run dev


Frontend:

cd frontend
npm install
npm run dev

📂 Project Structure
helpdesk-agentic/
│── backend/
│   ├── agent/          # Agentic workflow logic
│   ├── middleware/     # Auth & validation
│   ├── models/         # Mongoose schemas
│   ├── routes/         # REST APIs
│   ├── server.js       # Express entry point
│   └── package.json
│
│── frontend/
│   ├── src/            # React pages & components
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
│── docker-compose.yml
│── README.md

📚 API Endpoints (Summary)
Auth

POST /api/auth/register

POST /api/auth/login

Knowledge Base

GET /api/kb?query=...

POST /api/kb (Admin)

PUT /api/kb/:id (Admin)

DELETE /api/kb/:id (Admin)

Tickets

POST /api/tickets

GET /api/tickets

GET /api/tickets/:id

POST /api/tickets/:id/reply

POST /api/tickets/:id/assign

Agent

POST /api/agent/triage

GET /api/agent/suggestion/:ticketId

Config

GET /api/config

PUT /api/config

Audit

GET /api/tickets/:id/audit

🧠 Agentic Workflow

Plan – decide steps (classification → retrieval → drafting → decision).

Classify – keyword-based (refund/invoice → billing, error/bug → tech, etc.).

Retrieve KB – simple keyword search.

Draft Reply – generate a templated response with citations.

Decision – auto-close or forward to agent based on confidence.

🧪 Testing
Backend

Run tests with Jest:

cd backend
npm test

Frontend

Run tests with Vitest:

cd frontend
npm test

📹 Demo

🎥 Loom Walkthrough: [Insert Loom Video Link]

🌐 Live App (Optional): [Insert Deployed URL]

✅ Submission Checklist

 Source code pushed

 README with setup & architecture

 Demo video recorded

 Runs locally with STUB_MODE=true
