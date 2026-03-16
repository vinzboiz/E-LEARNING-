# 📚 E-Learning

> A full-stack E-Learning system with a mobile app (React Native / Expo) and a backend API (Node.js). It manages subjects, courses, lessons, assignments, course registration, submissions, and role-based access for Admins, Teachers, and Students.

[![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Expo](https://img.shields.io/badge/Expo-53+-000020?logo=expo)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Detailed Setup](#-detailed-setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Roles and Permissions](#-roles-and-permissions)
- [API Reference](#-api-reference)
- [Scripts](#-scripts)
- [Common Issues](#-common-issues)
- [Contributing](#-contributing)
- [License and Contact](#-license-and-contact)

---

## 🚀 Quick Start

You need **Node.js 18+**, **PostgreSQL 14+**, and **Expo**. After creating the database and `.env` files in `backend/` and `frontend/`:

```bash
# 1. Create the database and run the schema
psql -U postgres -c "CREATE DATABASE elearning;"
cd backend && psql -U postgres -d elearning -f database/schema.sql

# 2. Backend
cd backend && npm install
cp .env.example .env   # update .env based on the Environment Variables section
npm run dev
# -> http://localhost:3000

# 3. Frontend (new terminal)
cd frontend && npm install
cp .env.example .env   # set EXPO_PUBLIC_API_URL to your backend
npx expo start
```

Open the app with **Expo Go** by scanning the QR code, or press `a` / `i` in the terminal to launch an emulator.

**Repository:** [github.com/vinzboiz/E-LEARNING-](https://github.com/vinzboiz/E-LEARNING-)

**[↑ Back to table of contents](#-table-of-contents)**

---

## ✨ Features

| Area | Description |
|------|-------------|
| **Authentication** | Registration, login, and email OTP verification. |
| **Administration (Admin)** | Manage users, subjects, courses, schedules, and course registration periods. |
| **Teachers** | Manage lessons and assignments; grade and comment on submissions. |
| **Students** | Register for courses, view schedules and course content; submit assignments, view grades, and feedback. |
| **Authorization** | Three roles: Admin, Teacher, and Student with separate permissions. |

**[↑ Back to table of contents](#-table-of-contents)**

---

## 🛠 Tech Stack

| Part | Technology |
|------|------------|
| **Frontend** | React Native, Expo 53, TypeScript, React Navigation, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | PostgreSQL |
| **Authentication** | JWT, bcrypt |
| **Email** | Nodemailer (Gmail) for registration OTP |

**[↑ Back to table of contents](#-table-of-contents)**

---

## 📦 Detailed Setup

### 1. Clone the repository and enter the project folder

```bash
git clone <your-repository-url>
cd E_LEARNING   # or your project folder name
```

### 2. Create the PostgreSQL database

Create a database, for example `elearning`, using `psql`, pgAdmin, or DBeaver:

```sql
CREATE DATABASE elearning;
```

### 3. Run the schema (create tables and seed default data)

```bash
cd backend
psql -U postgres -d elearning -f database/schema.sql
```

*Or:* open `backend/database/schema.sql` in pgAdmin or DBeaver and execute the entire file.

### 4. Configure the backend

Inside `backend`, create a `.env` file (see [Environment Variables](#-environment-variables) below). Example:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/elearning
PORT=3000
JWT_SECRET=your-long-random-secret
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-gmail-app-password
NODE_ENV=development
```

### 5. Install backend dependencies

```bash
cd backend
npm install
```

### 6. Configure the frontend

Inside `frontend`, create a `.env` file:

```env
# Physical device / same network: http://<BACKEND_IP>:3000
# Android Emulator: http://10.0.2.2:3000
# iOS Simulator: http://localhost:3000
EXPO_PUBLIC_API_URL=http://192.168.1.9:3000
```

### 7. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 8. Run the application

- **Terminal 1:** `cd backend && npm run dev` -> API: `http://localhost:3000`
- **Terminal 2:** `cd frontend && npx expo start` -> open the app with Expo Go or an emulator

**[↑ Back to table of contents](#-table-of-contents)**

---

## 🔐 Environment Variables

Create `backend/.env` and `frontend/.env` with the following variables.

**Backend (`backend/.env`):**

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string, for example: `postgresql://user:password@localhost:5432/elearning` |
| `PORT` | No (default: 3000) | Port used by the backend server |
| `JWT_SECRET` | Yes (production) | Secret used to sign JWTs; use a long random value |
| `GMAIL_USER` | Yes (if using OTP) | Gmail address used to send OTP emails |
| `GMAIL_PASS` | Yes (if using OTP) | [Gmail App Password](https://support.google.com/accounts/answer/185833), not your normal login password |
| `NODE_ENV` | No | `development` or `production` |

**Frontend (`frontend/.env`):**

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Yes | Base URL of the backend API (`http://<IP>:3000` for physical devices, `http://10.0.2.2:3000` for Android emulator, `http://localhost:3000` for iOS simulator) |

**[↑ Back to table of contents](#-table-of-contents)**

---

## 📁 Project Structure

```
E_LEARNING/
├── backend/                    # Node.js + Express API
│   ├── config/                 # Database connection
│   ├── controllers/            # Logic: auth, user, course, lesson, assignment, ...
│   ├── database/
│   │   └── schema.sql          # Table creation + role seed data
│   ├── middlewares/            # Auth, authorization, upload
│   ├── models/                 # PostgreSQL queries
│   ├── routes/                 # API route definitions
│   ├── uploads/                # Uploaded files (lessons, PDFs)
│   ├── utils/                  # Email sending, ...
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/                   # React Native app (Expo)
│   ├── api/                    # Axios setup and API modules
│   ├── constants/              # Colors, styles, images
│   ├── navigation/             # Stack and Bottom Tab navigation
│   ├── screens/                # App screens
│   ├── services/               # API service layer
│   ├── utils/
│   ├── .env.example
│   ├── App.tsx
│   └── package.json
│
└── README.md
```

**[↑ Back to table of contents](#-table-of-contents)**

---

## 👥 Roles and Permissions

There are three default roles created when `schema.sql` is executed:

| ID | Role | Description |
|----|------|-------------|
| 1 | Admin | Manages users, subjects, courses, schedules, and course registration periods; has full access. |
| 2 | Student | Registers for courses, views schedules and lessons, submits assignments, and checks grades and feedback. |
| 3 | Teacher | Manages lessons and assignments; grades and comments on submissions. |

After running the schema, you should create at least one Admin account, either by registering through the app and verifying OTP, or by inserting directly into the `users` table with `role_id = 1`.

**[↑ Back to table of contents](#-table-of-contents)**

---

## 📡 API Reference

| Group | Example endpoints | Description |
|------|-------------------|-------------|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/send-otp`, `POST /api/auth/verify-otp`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` | Register, send/verify OTP, login, get user info, logout |
| **Users** | `GET /api/users`, `GET /api/users/teachers`, `GET /api/users/:id`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id` | User CRUD (Admin) |
| **Roles** | `GET /api/roles`, `GET /api/roles/:id`, `POST /api/roles`, `PUT /api/roles/:id`, `DELETE /api/roles/:id`, `GET /api/roles/user/:userId` | Role CRUD |
| **Subjects** | `GET /api/subjects`, `GET /api/subjects/:id`, `POST /api/subjects`, `PUT /api/subjects/:id`, `DELETE /api/subjects/:id` | Subject CRUD |
| **Course** | `GET /api/course/admin/all`, `GET /api/course/student/all`, `GET /api/course/teacher/my-courses`, `GET /api/course/student/:id`, `POST /api/course`, `PUT /api/course/:id`, `DELETE /api/course/:id` | Courses (Admin / Student / Teacher) |
| **Course schedule** | `GET /api/courseschedules`, `GET /api/courseschedules/:id`, `GET /api/courseschedules/teacher/my-schedules`, `GET /api/courseschedules/courseschedules/student`, `PUT /api/courseschedules/:id`, `DELETE /api/courseschedules/:id` | Class schedules |
| **Register course** | `GET /api/registercourse`, `GET /api/registercourse/me`, `GET /api/registercourse/:id`, `POST /api/registercourse`, `PUT /api/registercourse/update-time` | Course registration periods |
| **Class member** | `GET /api/classmember`, `POST /api/classmember`, `DELETE /api/classmember`, `POST /api/classmember/pay`, `GET /api/classmember/paid`, ... | Course cart and payment |
| **Lesson** | `GET /api/lesson`, `GET /api/lesson/student`, `GET /api/lesson/:id`, `POST /api/lesson`, `PUT /api/lesson/:id`, `DELETE /api/lesson/:id` | Lessons |
| **Assignment** | `GET /api/assignment/lesson/:lessonId`, `GET /api/assignment/:id`, `POST /api/assignment`, `PUT /api/assignment/:id`, `DELETE /api/assignment/:id` | Assignments |
| **Submission** | `GET /api/submission/assignment/:assignmentId`, `GET /api/submission/my`, `GET /api/submission/:id`, `POST /api/submission`, `PUT /api/submission/:id`, `PUT /api/submission/:id/grade`, `DELETE /api/submission/:id` | Submission and grading |

Detailed route definitions are available in `backend/routes/`.

**[↑ Back to table of contents](#-table-of-contents)**

---

## 📜 Scripts

**Backend (`backend/`)**

| Command | Description |
|---------|-------------|
| `npm run dev` | Run the server with nodemon (auto-reloads on code changes) |
| `npm start` | Run the server with Node.js |

**Frontend (`frontend/`)**

| Command | Description |
|---------|-------------|
| `npx expo start` | Start the Expo development server |
| `npm run android` | Open on Android emulator |
| `npm run ios` | Open on iOS simulator |
| `npm run web` | Run the web version |
| `npm test` | Run Jest |

**[↑ Back to table of contents](#-table-of-contents)**

---

## 🔧 Common Issues

| Symptom | Suggested fix |
|---------|---------------|
| **Cannot connect to PostgreSQL** | Check `DATABASE_URL` in `backend/.env`, make sure PostgreSQL is running, and confirm the user has database access. |
| **Frontend cannot call the API** | Make sure the backend is running on the correct port and `EXPO_PUBLIC_API_URL` in `frontend/.env` points to the right address (physical device: backend machine IP; Android emulator: `http://10.0.2.2:3000`; iOS: `http://localhost:3000`). |
| **CORS error** | The backend already enables `cors()`. If the error remains, check whether the origin used by Expo Go or the emulator is being blocked. |
| **OTP email sending failed** | Use a [Gmail App Password](https://support.google.com/accounts/answer/185833) for `GMAIL_PASS`, not your normal Gmail password. |
| **Schema ran but some tables are missing** | Re-run `psql -U postgres -d elearning -f backend/database/schema.sql` or execute the full file in pgAdmin/DBeaver. |

**[↑ Back to table of contents](#-table-of-contents)**

---

## 🤝 Contributing

1. **Fork** the repository and clone it locally.
2. Create a **new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3. Install and run the project following [Detailed Setup](#-detailed-setup), and make sure existing features are not broken.
4. **Commit** with a clear message, then **push** your branch.
5. Open a **Pull Request** to the main branch, describing the change and the reason for it. A maintainer will review it.

For questions or bug reports, please open an **Issue** in the repository.

**[↑ Back to table of contents](#-table-of-contents)**

---

## 📄 License and Contact

- **License:** This project uses the ISC license. See the `license` file in each package if available.
- **Contact / Bug Reports / Suggestions:** Open an **Issue** in the repository.

**[↑ Back to table of contents](#-table-of-contents)**

---

*E-Learning — built with React Native (Expo), Express, and PostgreSQL.*
