# E-Learning Platform
A full-stack e-learning system with a mobile client (React Native / Expo) and a REST API (Node.js). It supports subjects, courses, lessons, assignments, enrollment, submissions, and role-based access for administrators, teachers, and students.
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Expo](https://img.shields.io/badge/Expo-53+-000020?logo=expo)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql)](https://www.postgresql.org/)
---
## Table of Contents
- [Quick start](#quick-start)
- [Features](#features)
- [Technology stack](#technology-stack)
- [Setup](#setup)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Roles and permissions](#roles-and-permissions)
- [API overview](#api-overview)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License and contact](#license-and-contact)
---
## Quick start
**Prerequisites:** Node.js 18 or newer, PostgreSQL 14 or newer, and the Expo CLI (via `npx`).
After creating the database and `.env` files in `backend/` and `frontend/`:
```bash
# 1. Create the database and apply the schema
psql -U postgres -c "CREATE DATABASE elearning;"
cd backend && psql -U postgres -d elearning -f database/schema.sql
# 2. Backend
cd backend && npm install
cp .env.example .env   # edit .env; see Environment variables
npm run dev
# API: http://localhost:3000
# 3. Frontend (separate terminal)
cd frontend && npm install
cp .env.example .env   # set EXPO_PUBLIC_API_URL to your backend URL
npx expo start
```
Open the app with Expo Go (QR code) or press `a` / `i` in the terminal to launch an Android or iOS emulator.
**Repository:** [github.com/vinzboiz/E-LEARNING-](https://github.com/vinzboiz/E-LEARNING-)
[Back to top](#table-of-contents)
---
## Features
| Area | Description |
|------|-------------|
| **Authentication** | User registration, login, and email OTP verification. |
| **Administration** | Manage users, subjects, courses, schedules, and course registration windows. |
| **Teachers** | Manage lessons and assignments; grade submissions and provide feedback. |
| **Students** | Enroll in courses, view schedules and content, submit work, and view grades and comments. |
| **Authorization** | Distinct capabilities for Admin, Teacher, and Student roles. |
[Back to top](#table-of-contents)
---
## Technology stack
| Layer | Technologies |
|------|----------------|
| **Mobile app** | React Native, Expo 53, TypeScript, React Navigation, Axios |
| **API** | Node.js, Express 5 |
| **Database** | PostgreSQL |
| **Security** | JWT, bcrypt |
| **Email** | Nodemailer (Gmail) for registration OTP |
[Back to top](#table-of-contents)
---
## Setup
### 1. Clone and enter the project
```bash
git clone <your-repository-url>
cd E_LEARNING   # or your local folder name
```
### 2. Create the PostgreSQL database
Create a database (for example `elearning`) using `psql`, pgAdmin, or another client:
```sql
CREATE DATABASE elearning;
```
### 3. Run the schema
From the `backend` directory:
```bash
psql -U postgres -d elearning -f database/schema.sql
```
Alternatively, execute the full contents of `backend/database/schema.sql` in your SQL client.
### 4. Configure the backend
In `backend`, copy `.env.example` to `.env` and set variables as described in [Environment variables](#environment-variables). Example:
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
In `frontend`, copy `.env.example` to `.env`:
```env
# Physical device / LAN: http://<BACKEND_HOST_IP>:3000
# Android emulator: http://10.0.2.2:3000
# iOS Simulator: http://localhost:3000
EXPO_PUBLIC_API_URL=http://192.168.1.9:3000
```
### 7. Install frontend dependencies
```bash
cd ../frontend
npm install
```
### 8. Run the application
- **Terminal 1:** `cd backend && npm run dev` — API at `http://localhost:3000`
- **Terminal 2:** `cd frontend && npx expo start` — use Expo Go or an emulator
[Back to top](#table-of-contents)
---
## Environment variables
### Backend (`backend/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string, e.g. `postgresql://user:password@localhost:5432/elearning` |
| `PORT` | No (default: 3000) | HTTP port for the API |
| `JWT_SECRET` | Yes in production | Secret for signing JWTs; use a long random value |
| `GMAIL_USER` | Yes if OTP is enabled | Gmail address used to send OTP messages |
| `GMAIL_PASS` | Yes if OTP is enabled | [Gmail App Password](https://support.google.com/accounts/answer/185833), not the account login password |
| `NODE_ENV` | No | `development` or `production` |
### Frontend (`frontend/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Yes | Base URL of the API. Use the machine IP for physical devices, `http://10.0.2.2:3000` for the Android emulator, and `http://localhost:3000` for the iOS Simulator when appropriate. |
[Back to top](#table-of-contents)
---
## Project structure
```
E_LEARNING/
├── backend/                 # Node.js + Express API
│   ├── config/              # Database connection
│   ├── controllers/         # Auth, users, courses, lessons, assignments, etc.
│   ├── database/
│   │   └── schema.sql       # DDL and role seed data
│   ├── middlewares/         # Authentication, authorization, uploads
│   ├── models/              # Data access / PostgreSQL queries
│   ├── routes/              # Route definitions
│   ├── uploads/             # Uploaded lesson files (e.g. PDFs)
│   ├── utils/               # Email helpers, etc.
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/                # React Native (Expo) app
│   ├── api/                 # Axios client and API modules
│   ├── constants/           # Colors, styles, assets
│   ├── navigation/          # Stack and tab navigators
│   ├── screens/             # Screen components
│   ├── services/            # API service layer
│   ├── utils/
│   ├── .env.example
│   ├── App.tsx
│   └── package.json
│
└── README.md
```
[Back to top](#table-of-contents)
---
## Roles and permissions
The schema seeds three roles:
| ID | Role | Capabilities |
|----|------|----------------|
| 1 | Admin | User management; subjects, courses, schedules, and registration windows; broad administrative access. |
| 2 | Student | Course enrollment; schedules and lessons; assignment submission; viewing grades and feedback. |
| 3 | Teacher | Lessons and assignments; grading and comments on submissions. |
After applying the schema, create at least one administrator by registering through the app (with OTP verification) or by inserting a user with `role_id = 1` in the `users` table, consistent with your security policy.
[Back to top](#table-of-contents)
---
## API overview
| Area | Example endpoints | Purpose |
|------|-------------------|---------|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/send-otp`, `POST /api/auth/verify-otp`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` | Registration, OTP, session, current user |
| **Users** | `GET /api/users`, `GET /api/users/teachers`, `GET /api/users/:id`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id` | User CRUD (administrative) |
| **Roles** | `GET /api/roles`, `GET /api/roles/:id`, `POST /api/roles`, `PUT /api/roles/:id`, `DELETE /api/roles/:id`, `GET /api/roles/user/:userId` | Role management |
| **Subjects** | `GET /api/subjects`, `GET /api/subjects/:id`, `POST /api/subjects`, `PUT /api/subjects/:id`, `DELETE /api/subjects/:id` | Subjects |
| **Courses** | `GET /api/course/admin/all`, `GET /api/course/student/all`, `GET /api/course/teacher/my-courses`, `GET /api/course/student/:id`, `POST /api/course`, `PUT /api/course/:id`, `DELETE /api/course/:id` | Courses by role |
| **Schedules** | `GET /api/courseschedules`, `GET /api/courseschedules/:id`, `GET /api/courseschedules/teacher/my-schedules`, `GET /api/courseschedules/courseschedules/student`, `PUT /api/courseschedules/:id`, `DELETE /api/courseschedules/:id` | Class schedules |
| **Registration** | `GET /api/registercourse`, `GET /api/registercourse/me`, `GET /api/registercourse/:id`, `POST /api/registercourse`, `PUT /api/registercourse/update-time` | Registration periods |
| **Enrollment** | `GET /api/classmember`, `POST /api/classmember`, `DELETE /api/classmember`, `POST /api/classmember/pay`, `GET /api/classmember/paid`, … | Enrollment and payment flows |
| **Lessons** | `GET /api/lesson`, `GET /api/lesson/student`, `GET /api/lesson/:id`, `POST /api/lesson`, `PUT /api/lesson/:id`, `DELETE /api/lesson/:id` | Lessons |
| **Assignments** | `GET /api/assignment/lesson/:lessonId`, `GET /api/assignment/:id`, `POST /api/assignment`, `PUT /api/assignment/:id`, `DELETE /api/assignment/:id` | Assignments |
| **Submissions** | `GET /api/submission/assignment/:assignmentId`, `GET /api/submission/my`, `GET /api/submission/:id`, `POST /api/submission`, `PUT /api/submission/:id`, `PUT /api/submission/:id/grade`, `DELETE /api/submission/:id` | Submissions and grading |
For exact paths and payloads, see `backend/routes/`.
[Back to top](#table-of-contents)
---
## Scripts
**Backend (`backend/`)**
| Command | Description |
|---------|-------------|
| `npm run dev` | Run the server with nodemon (reload on file changes) |
| `npm start` | Run the server with Node.js |
**Frontend (`frontend/`)**
| Command | Description |
|---------|-------------|
| `npx expo start` | Start the Expo development server |
| `npm run android` | Launch on Android emulator |
| `npm run ios` | Launch on iOS Simulator |
| `npm run web` | Run the web build |
| `npm test` | Run Jest tests |
[Back to top](#table-of-contents)
---
## Troubleshooting
| Symptom | What to check |
|---------|----------------|
| Cannot connect to PostgreSQL | Verify `DATABASE_URL`, that the server is running, and that the database user has the required privileges. |
| Mobile app cannot reach the API | Confirm the API is listening on the expected host/port and that `EXPO_PUBLIC_API_URL` matches your environment (device IP, `10.0.2.2` for Android emulator, `localhost` for iOS Simulator as applicable). |
| CORS errors | The API enables `cors()` by default; if issues persist, verify the client origin and any proxy or tunnel configuration. |
| OTP email failures | Use a Gmail App Password for `GMAIL_PASS`, not the normal account password. |
| Incomplete schema | Re-run `psql -U postgres -d elearning -f backend/database/schema.sql` or execute the full script in your SQL tool. |
[Back to top](#table-of-contents)
---
## Contributing
1. Fork the repository and clone your fork.
2. Create a branch for your change: `git checkout -b feature/your-feature-name`.
3. Install dependencies, run the app locally, and confirm existing behavior still works.
4. Commit with a clear message and push your branch.
5. Open a pull request against the default branch with a concise description of the change and the motivation.
For defects or feature ideas, open an issue in the repository.
[Back to top](#table-of-contents)
---
## License and contact
- **License:** ISC (see license files in individual packages where applicable).
- **Issues and feedback:** Use the repository issue tracker.
---
*E-Learning — React Native (Expo), Express, PostgreSQL.*
