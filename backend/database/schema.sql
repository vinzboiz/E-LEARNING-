-- ============================================
-- E-LEARNING DATABASE SCHEMA (PostgreSQL)
-- Chạy file này để tạo toàn bộ bảng và dữ liệu mặc định
-- ============================================

-- Bảng vai trò (Admin=1, Student=2, Teacher=3)
CREATE TABLE IF NOT EXISTS role (
  role_id   SERIAL PRIMARY KEY,
  name      VARCHAR(50) NOT NULL UNIQUE
);

-- Bảng người dùng
CREATE TABLE IF NOT EXISTS users (
  user_id   SERIAL PRIMARY KEY,
  name      VARCHAR(255) NOT NULL,
  email     VARCHAR(255) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,
  role_id   INTEGER NOT NULL REFERENCES role(role_id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng môn học
CREATE TABLE IF NOT EXISTS subject (
  subject_id   SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  description  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng khóa học (lớp học phần)
CREATE TABLE IF NOT EXISTS course (
  course_id    SERIAL PRIMARY KEY,
  subject_id   INTEGER NOT NULL REFERENCES subject(subject_id) ON DELETE RESTRICT,
  user_id      INTEGER NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
  semester     VARCHAR(50) NOT NULL,
  year         INTEGER NOT NULL,
  price        DECIMAL(12, 2) NOT NULL DEFAULT 0,
  numofperiods INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng lịch học của từng khóa
CREATE TABLE IF NOT EXISTS courseschedule (
  schedule_id  SERIAL PRIMARY KEY,
  course_id    INTEGER NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  room         VARCHAR(100),
  note         TEXT
);

-- Bảng đợt đăng ký học phần (theo kỳ)
CREATE TABLE IF NOT EXISTS registercourse (
  register_id     SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  create_at       TIMESTAMPTZ DEFAULT NOW(),
  begin_register  TIMESTAMPTZ NOT NULL,
  end_register    TIMESTAMPTZ NOT NULL,
  tuition         DECIMAL(12, 2) DEFAULT 0,
  status          VARCHAR(50) NOT NULL DEFAULT 'đang chờ xử lý',
  due_date_start  TIMESTAMPTZ NOT NULL,
  due_date_end    TIMESTAMPTZ NOT NULL,
  year            INTEGER NOT NULL,
  semester        VARCHAR(50) NOT NULL
);

-- Bảng thành viên lớp (sinh viên – môn trong giỏ / đã đăng ký)
CREATE TABLE IF NOT EXISTS classmember (
  classmember_id SERIAL PRIMARY KEY,
  user_id        INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  register_id    INTEGER NOT NULL REFERENCES registercourse(register_id) ON DELETE CASCADE,
  course_id      INTEGER NOT NULL REFERENCES course(course_id) ON DELETE CASCADE,
  joined_at      TIMESTAMPTZ DEFAULT NOW(),
  price          DECIMAL(12, 2) NOT NULL DEFAULT 0,
  UNIQUE(user_id, register_id, course_id)
);

-- Bảng bài học (trong từng khóa)
CREATE TABLE IF NOT EXISTS lesson (
  lesson_id  SERIAL PRIMARY KEY,
  title      VARCHAR(500) NOT NULL,
  content    TEXT,
  file       VARCHAR(500),
  course_id  INTEGER NOT NULL REFERENCES course(course_id) ON DELETE CASCADE
);

-- Bảng bài tập (gắn với bài học)
CREATE TABLE IF NOT EXISTS assignment (
  assignment_id   SERIAL PRIMARY KEY,
  lesson_id       INTEGER NOT NULL REFERENCES lesson(lesson_id) ON DELETE CASCADE,
  title           VARCHAR(500) NOT NULL,
  description     TEXT,
  due_date_start  TIMESTAMPTZ NOT NULL,
  due_date_end    TIMESTAMPTZ NOT NULL,
  link_drive      VARCHAR(500),
  status          VARCHAR(50) NOT NULL DEFAULT 'đã giao'
);

-- Bảng bài nộp (sinh viên nộp bài cho assignment)
CREATE TABLE IF NOT EXISTS submission (
  submission_id  SERIAL PRIMARY KEY,
  assignment_id  INTEGER NOT NULL REFERENCES assignment(assignment_id) ON DELETE CASCADE,
  user_id        INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content        TEXT,
  drive_link     VARCHAR(500),
  submitted_at   TIMESTAMPTZ DEFAULT NOW(),
  score          DECIMAL(5, 2),
  feedback       TEXT
);

-- Bảng OTP (xác thực email khi đăng ký)
CREATE TABLE IF NOT EXISTS otp_codes (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) NOT NULL,
  otp        VARCHAR(10) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

-- ============================================
-- INDEX (tùy chọn, tăng tốc truy vấn)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_course_subject ON course(subject_id);
CREATE INDEX IF NOT EXISTS idx_course_teacher ON course(user_id);
CREATE INDEX IF NOT EXISTS idx_courseschedule_course ON courseschedule(course_id);
CREATE INDEX IF NOT EXISTS idx_registercourse_user ON registercourse(user_id);
CREATE INDEX IF NOT EXISTS idx_classmember_user_register ON classmember(user_id, register_id);
CREATE INDEX IF NOT EXISTS idx_lesson_course ON lesson(course_id);
CREATE INDEX IF NOT EXISTS idx_assignment_lesson ON assignment(lesson_id);
CREATE INDEX IF NOT EXISTS idx_submission_assignment ON submission(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submission_user ON submission(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_codes(email);

-- ============================================
-- DỮ LIỆU MẶC ĐỊNH (vai trò)
-- ============================================
INSERT INTO role (role_id, name) VALUES
  (1, 'admin'),
  (2, 'student'),
  (3, 'teacher')
ON CONFLICT (role_id) DO NOTHING;

-- Cập chuỗi sequence cho role nếu đã có dữ liệu
SELECT setval('role_role_id_seq', (SELECT COALESCE(MAX(role_id), 1) FROM role));
