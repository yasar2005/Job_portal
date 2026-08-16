# 💼 JobPortal — Full-Stack Job Board Application

> A production-ready job portal built with **React**, **Node.js**, **Express**, and **MongoDB** — featuring dual-role authentication, real-time job search, recruiter dashboards, and a modern responsive UI.

[![React](https://img.shields.io/badge/React-17-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)](https://jwt.io/)

---

## 🚀 Live Demo

> **🌐 Live Demo:** [https://job-portal-ebon-seven.vercel.app](https://job-portal-ebon-seven.vercel.app)  
> **Backend API:** [https://job-portal-api.onrender.com](https://job-portal-api.onrender.com)

---

## ✨ Features

### 👤 Applicant
- Register/Login with JWT authentication
- Browse & search jobs by title, skill, salary, type, duration
- Filter & sort jobs (salary, duration, rating)
- Apply with a Statement of Purpose (SOP)
- Bookmark/save jobs (localStorage)
- Track application status (applied → shortlisted → accepted/rejected)
- Rate accepted jobs
- Upload resume (PDF) and profile photo
- Manage education history and skills

### 🏢 Recruiter
- Post new job listings with skill requirements, salary, deadline
- Manage all posted jobs (edit/delete)
- View and filter applicants per job
- Shortlist, accept, or reject applicants
- View accepted employees dashboard
- Company profile management

### 🎨 UI/UX
- Modern gradient navbar with dark/light mode toggle
- Responsive card-based job listings with hover effects
- Job type badges (Full Time / Part Time / WFH)
- Skill chips, salary display, deadline tracking
- Animated hero landing page with stats
- Empty state illustrations
- Toast notifications for all actions

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 17, Material-UI v4, React Router v5 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Authentication | JWT (JSON Web Tokens), Passport.js |
| File Uploads | Multer (resume + profile photo) |
| HTTP Client | Axios |
| Styling | Material-UI `makeStyles`, CSS-in-JS |

---

## 📂 Project Structure

```
job-portal/
├── backend/
│   ├── db/               # Mongoose models (User, Job, Application, Rating...)
│   ├── routes/           # apiRoutes, authRoutes, uploadRoutes, downloadRoutes
│   ├── lib/              # JWT auth, Passport config
│   └── server.js         # Express entry point (port 4444)
└── frontend/
    └── src/
        ├── component/
        │   ├── recruiter/    # CreateJobs, MyJobs, JobApplications, AcceptedApplicants
        │   ├── Home.js       # Job listing with search & filters
        │   ├── Applications.js
        │   ├── SavedJobs.js
        │   ├── Welcome.js    # Landing page
        │   ├── Login.js / Signup.js
        │   └── Navbar.js
        └── lib/              # apiList, isAuth, reusable inputs
```

---

## ⚡ Getting Started (Local)

### Prerequisites
- Node.js >= 14
- MongoDB running locally on `mongodb://localhost:27017`

### 1. Clone the repo
```bash
git clone https://github.com/yasar2005/Job_portal.git
cd Job_portal
```

### 2. Backend
```bash
cd backend
npm install
npm start
# API runs on http://localhost:4444
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## ☁️ Deployment Guide

### Frontend → Vercel (Free)
```bash
# In /frontend
npm run build
# Push to GitHub, connect repo on vercel.com → auto-deploys
```
Set environment variable in Vercel:
```
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Backend → Render (Free)
1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo, set root to `backend/`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/jobportal
JWT_SECRET=your_secret_key
```

### Database → MongoDB Atlas (Free)
1. Create cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` for Render access
3. Copy connection string to `MONGO_URI`

---

## 🔑 Environment Variables

**Backend (`backend/.env`)**
```env
MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_jwt_secret
PORT=4444
```

---

## 📸 Screenshots

| Landing Page | Job Listings | Recruiter Dashboard |
|---|---|---|
| Hero with CTA & stats | Search, filter, bookmark | Post jobs, manage applicants |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first.

---

## 👨‍💻 Author

**Yasar** — [GitHub @yasar2005](https://github.com/yasar2005)

---

## 📄 License

MIT License — free to use and modify.
