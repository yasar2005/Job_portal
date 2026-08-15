# 💼 Job Portal

A full-stack job portal web application built with **React**, **Node.js**, **Express**, and **MongoDB**.

## ✨ Features

- 🔐 JWT-based authentication (Applicant & Recruiter roles)
- 🏠 Modern landing page with stats & feature highlights
- 🌙 Dark mode toggle
- 🔖 Save/bookmark jobs (localStorage)
- 🔍 Search & filter jobs by type, salary, duration
- 📄 Apply to jobs with Statement of Purpose (SOP)
- 📁 Upload resume & profile photo
- ⭐ Rating system for applicants
- 👔 Recruiter dashboard: post jobs, manage applications, accept/reject
- 📱 Responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14
- MongoDB running locally on port 27017

### Backend Setup
```bash
cd backend
npm install
npm start
# Runs on http://localhost:4444
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 17, Material-UI v4 |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, Passport.js |
| File Upload | Multer |

## 📂 Project Structure

```
job-portal/
├── backend/          # Express API server
│   ├── db/           # Mongoose models
│   ├── routes/       # API, auth, upload routes
│   └── server.js
└── frontend/         # React app
    └── src/
        ├── component/  # UI components
        └── lib/        # Utilities & API list
```

## 🌐 Deployment

- Frontend: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Backend: [Render](https://render.com) or [Railway](https://railway.app)
- Database: [MongoDB Atlas](https://www.mongodb.com/atlas)
