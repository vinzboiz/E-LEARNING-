# 📚 E-Learning

> Hệ thống E-Learning full-stack: ứng dụng di động (React Native / Expo) và API backend (Node.js). Quản lý học phần, khóa học, bài học, bài tập, đăng ký môn, nộp bài và phân quyền Admin / Giảng viên / Sinh viên.

[![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Expo](https://img.shields.io/badge/Expo-53+-000020?logo=expo)](https://expo.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?logo=postgresql)](https://www.postgresql.org/)

---

## 📋 Mục lục

- [Bắt đầu nhanh](#-bắt-đầu-nhanh)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Cài đặt chi tiết](#-cài-đặt-chi-tiết)
- [Biến môi trường](#-biến-môi-trường)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Phân quyền](#-phân-quyền)
- [API tham khảo](#-api-tham-khảo)
- [Scripts](#-scripts)
- [Xử lý lỗi thường gặp](#-xử-lý-lỗi-thường-gặp)
- [Đóng góp](#-đóng-góp)
- [Giấy phép & Liên hệ](#-giấy-phép--liên-hệ)

---

## 🚀 Bắt đầu nhanh

Cần **Node.js 18+**, **PostgreSQL 14+** và **Expo**. Sau khi tạo database và file `.env` trong `backend/` và `frontend/`:

```bash
# 1. Tạo database và chạy schema
psql -U postgres -c "CREATE DATABASE elearning;"
cd backend && psql -U postgres -d elearning -f database/schema.sql

# 2. Backend
cd backend && npm install
cp .env.example .env   # chỉnh .env theo mục Biến môi trường
npm run dev
# → http://localhost:3000

# 3. Frontend (terminal mới)
cd frontend && npm install
cp .env.example .env   # đặt EXPO_PUBLIC_API_URL trỏ tới backend
npx expo start
```

Mở app bằng **Expo Go** (quét QR) hoặc nhấn `a` / `i` trong terminal để chạy giả lập.

**Repository:** [github.com/vinzboiz/E-LEARNING-](https://github.com/vinzboiz/E-LEARNING-)

**[↑ Về mục lục](#-mục-lục)**

---

## ✨ Tính năng

| Khu vực | Mô tả |
|--------|--------|
| **Xác thực** | Đăng ký, đăng nhập, xác thực OTP qua email. |
| **Quản trị (Admin)** | Quản lý người dùng, môn học, khóa học, lịch học, đợt đăng ký học phần. |
| **Giảng viên** | Quản lý bài học, bài tập; chấm điểm và nhận xét bài nộp. |
| **Sinh viên** | Đăng ký môn học, xem lịch, học phần; nộp bài tập, xem điểm và nhận xét. |
| **Phân quyền** | Ba vai trò: Admin, Giảng viên, Sinh viên với quyền hạn tương ứng. |

**[↑ Về mục lục](#-mục-lục)**

---

## 🛠 Công nghệ

| Phần | Công nghệ |
|------|-----------|
| **Frontend** | React Native, Expo 53, TypeScript, React Navigation, Axios |
| **Backend** | Node.js, Express 5 |
| **Database** | PostgreSQL |
| **Xác thực** | JWT, bcrypt |
| **Gửi email** | Nodemailer (Gmail) — OTP đăng ký |

**[↑ Về mục lục](#-mục-lục)**

---

## 📦 Cài đặt chi tiết

### 1. Clone và vào thư mục

```bash
git clone <url-repository-của-bạn>
cd E_LEARNING   # hoặc tên thư mục dự án
```

### 2. Tạo database PostgreSQL

Tạo database (ví dụ tên `elearning`). Dùng `psql`, pgAdmin hoặc DBeaver:

```sql
CREATE DATABASE elearning;
```

### 3. Chạy schema (tạo bảng + dữ liệu mặc định)

```bash
cd backend
psql -U postgres -d elearning -f database/schema.sql
```

*Hoặc:* mở file `backend/database/schema.sql` trong pgAdmin/DBeaver và thực thi toàn bộ.

### 4. Cấu hình backend

Trong thư mục `backend`, tạo file `.env` (xem [Biến môi trường](#-biến-môi-trường) bên dưới). Ví dụ:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/elearning
PORT=3000
JWT_SECRET=chuoi-bi-mat-dai-ngau-nhien
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=app-password-gmail
NODE_ENV=development
```

### 5. Cài đặt backend

```bash
cd backend
npm install
```

### 6. Cấu hình frontend

Trong thư mục `frontend`, tạo file `.env`:

```env
# Thiết bị thật / cùng mạng: http://<IP-máy-backend>:3000
# Android Emulator: http://10.0.2.2:3000
# iOS Simulator: http://localhost:3000
EXPO_PUBLIC_API_URL=http://192.168.1.9:3000
```

### 7. Cài đặt frontend

```bash
cd ../frontend
npm install
```

### 8. Chạy ứng dụng

- **Terminal 1:** `cd backend && npm run dev` → API: `http://localhost:3000`
- **Terminal 2:** `cd frontend && npx expo start` → mở app bằng Expo Go hoặc emulator

**[↑ Về mục lục](#-mục-lục)**

---

## 🔐 Biến môi trường

Tạo file `backend/.env` và `frontend/.env` với các biến sau.

**Backend (`backend/.env`):**

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `DATABASE_URL` | Có | Chuỗi kết nối PostgreSQL, ví dụ: `postgresql://user:password@localhost:5432/elearning` |
| `PORT` | Không (mặc định 3000) | Cổng chạy server backend |
| `JWT_SECRET` | Có (production) | Chuỗi bí mật để ký JWT; nên dùng chuỗi dài, ngẫu nhiên |
| `GMAIL_USER` | Có (nếu dùng OTP) | Địa chỉ Gmail gửi OTP |
| `GMAIL_PASS` | Có (nếu dùng OTP) | [Mật khẩu ứng dụng Gmail](https://support.google.com/accounts/answer/185833), không dùng mật khẩu đăng nhập thường |
| `NODE_ENV` | Không | `development` hoặc `production` |

**Frontend (`frontend/.env`):**

| Biến | Bắt buộc | Mô tả |
|------|----------|--------|
| `EXPO_PUBLIC_API_URL` | Có | URL gốc API backend (thiết bị thật: `http://<IP>:3000`, Android emulator: `http://10.0.2.2:3000`, iOS: `http://localhost:3000`) |

**[↑ Về mục lục](#-mục-lục)**

---

## 📁 Cấu trúc dự án

```
E_LEARNING/
├── backend/                    # API Node.js + Express
│   ├── config/                 # Kết nối DB
│   ├── controllers/            # Logic: auth, user, course, lesson, assignment, ...
│   ├── database/
│   │   └── schema.sql          # Tạo bảng + seed vai trò
│   ├── middlewares/            # Auth, phân quyền, upload
│   ├── models/                 # Truy vấn PostgreSQL
│   ├── routes/                 # Định nghĩa API routes
│   ├── uploads/                # File tải lên (bài học, PDF)
│   ├── utils/                  # Gửi email, ...
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/                    # Ứng dụng React Native (Expo)
│   ├── api/                    # Axios, gọi API theo module
│   ├── constants/              # Màu, style, hình ảnh
│   ├── navigation/             # Stack, Bottom Tab
│   ├── screens/                 # Các màn hình
│   ├── services/                # Layer gọi API
│   ├── utils/
│   ├── .env.example
│   ├── App.tsx
│   └── package.json
│
└── README.md
```

**[↑ Về mục lục](#-mục-lục)**

---

## 👥 Phân quyền

Ba vai trò mặc định (tạo khi chạy `schema.sql`):

| Mã | Vai trò | Mô tả |
|----|---------|--------|
| 1 | Admin | Quản lý người dùng, môn học, khóa học, lịch học, đợt đăng ký học phần; toàn quyền. |
| 2 | Sinh viên | Đăng ký môn, xem lịch, bài học, nộp bài tập, xem điểm và nhận xét. |
| 3 | Giảng viên | Quản lý bài học, bài tập; chấm điểm và nhận xét bài nộp. |

Sau khi chạy schema, cần tạo ít nhất một tài khoản Admin (đăng ký qua app + xác thực OTP, hoặc chèn trực tiếp vào bảng `users` với `role_id = 1`).

**[↑ Về mục lục](#-mục-lục)**

---

## 📡 API tham khảo

| Nhóm | Endpoint ví dụ | Mô tả |
|------|----------------|--------|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/send-otp`, `POST /api/auth/verify-otp`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout` | Đăng ký, gửi/verify OTP, đăng nhập, thông tin user, đăng xuất |
| **Users** | `GET /api/users`, `GET /api/users/teachers`, `GET /api/users/:id`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id` | CRUD người dùng (Admin) |
| **Roles** | `GET /api/roles`, `GET /api/roles/:id`, `POST /api/roles`, `PUT /api/roles/:id`, `DELETE /api/roles/:id`, `GET /api/roles/user/:userId` | CRUD vai trò |
| **Subjects** | `GET /api/subjects`, `GET /api/subjects/:id`, `POST /api/subjects`, `PUT /api/subjects/:id`, `DELETE /api/subjects/:id` | CRUD môn học |
| **Course** | `GET /api/course/admin/all`, `GET /api/course/student/all`, `GET /api/course/teacher/my-courses`, `GET /api/course/student/:id`, `POST /api/course`, `PUT /api/course/:id`, `DELETE /api/course/:id` | Khóa học (Admin / Student / Teacher) |
| **Course schedule** | `GET /api/courseschedules`, `GET /api/courseschedules/:id`, `GET /api/courseschedules/teacher/my-schedules`, `GET /api/courseschedules/courseschedules/student`, `PUT /api/courseschedules/:id`, `DELETE /api/courseschedules/:id` | Lịch học |
| **Register course** | `GET /api/registercourse`, `GET /api/registercourse/me`, `GET /api/registercourse/:id`, `POST /api/registercourse`, `PUT /api/registercourse/update-time` | Đợt đăng ký học phần |
| **Class member** | `GET /api/classmember`, `POST /api/classmember`, `DELETE /api/classmember`, `POST /api/classmember/pay`, `GET /api/classmember/paid`, ... | Giỏ môn học, thanh toán |
| **Lesson** | `GET /api/lesson`, `GET /api/lesson/student`, `GET /api/lesson/:id`, `POST /api/lesson`, `PUT /api/lesson/:id`, `DELETE /api/lesson/:id` | Bài học |
| **Assignment** | `GET /api/assignment/lesson/:lessonId`, `GET /api/assignment/:id`, `POST /api/assignment`, `PUT /api/assignment/:id`, `DELETE /api/assignment/:id` | Bài tập |
| **Submission** | `GET /api/submission/assignment/:assignmentId`, `GET /api/submission/my`, `GET /api/submission/:id`, `POST /api/submission`, `PUT /api/submission/:id`, `PUT /api/submission/:id/grade`, `DELETE /api/submission/:id` | Nộp bài, chấm điểm |

Chi tiết từng route nằm trong `backend/routes/`.

**[↑ Về mục lục](#-mục-lục)**

---

## 📜 Scripts

**Backend (`backend/`)**

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy server với nodemon (tự reload khi đổi code) |
| `npm start` | Chạy server với node |

**Frontend (`frontend/`)**

| Lệnh | Mô tả |
|------|--------|
| `npx expo start` | Chạy Expo dev server |
| `npm run android` | Mở trên Android emulator |
| `npm run ios` | Mở trên iOS simulator |
| `npm run web` | Chạy bản web |
| `npm test` | Chạy Jest |

**[↑ Về mục lục](#-mục-lục)**

---

## 🔧 Xử lý lỗi thường gặp

| Triệu chứng | Gợi ý xử lý |
|-------------|-------------|
| **Không kết nối được PostgreSQL** | Kiểm tra `DATABASE_URL` trong `backend/.env`, PostgreSQL đã chạy và user có quyền truy cập database. |
| **Frontend không gọi được API** | Kiểm tra backend chạy đúng cổng và `EXPO_PUBLIC_API_URL` trong `frontend/.env` trỏ đúng (thiết bị thật: IP máy backend; Android emulator: `http://10.0.2.2:3000`; iOS: `http://localhost:3000`). |
| **CORS lỗi** | Backend đã bật `cors()`. Nếu vẫn lỗi, kiểm tra origin (Expo Go / emulator) có bị chặn không. |
| **Gửi OTP thất bại** | Dùng [Mật khẩu ứng dụng Gmail](https://support.google.com/accounts/answer/185833) cho `GMAIL_PASS`, không dùng mật khẩu đăng nhập thông thường. |
| **Schema đã chạy nhưng thiếu bảng** | Chạy lại `psql -U postgres -d elearning -f backend/database/schema.sql` hoặc thực thi toàn bộ file trong pgAdmin/DBeaver. |

**[↑ Về mục lục](#-mục-lục)**

---

## 🤝 Đóng góp

1. **Fork** repository và clone về máy.
2. Tạo **nhánh mới** cho tính năng hoặc sửa lỗi: `git checkout -b feature/ten-tinh-nang`.
3. Cài đặt và chạy theo [Cài đặt chi tiết](#-cài-đặt-chi-tiết), đảm bảo không phá tính năng hiện có.
4. **Commit** với message rõ ràng, rồi **push** lên nhánh của bạn.
5. Mở **Pull Request** vào nhánh chính, mô tả thay đổi và lý do. Maintainer sẽ xem xét.

Thắc mắc hoặc báo lỗi có thể gửi qua **Issues** của repository.

**[↑ Về mục lục](#-mục-lục)**

---

## 📄 Giấy phép & Liên hệ

- **Giấy phép:** Dự án sử dụng giấy phép ISC. Xem file `license` trong từng package (nếu có).
- **Liên hệ / Báo lỗi / Đề xuất:** Mở **Issue** trên repository.

**[↑ Về mục lục](#-mục-lục)**

---

*E-Learning — xây dựng với React Native (Expo), Express và PostgreSQL.*
