const db = require("../config/db");

// ==========================
// HÀM KIỂM TRA TRÙNG LỊCH GIẢNG VIÊN
// ==========================
async function checkLecturerScheduleConflict(user_id, date, start_time, end_time) {
  const query = `
    SELECT cs.schedule_id
    FROM courseschedule cs
    JOIN course c ON cs.course_id = c.course_id
    WHERE c.user_id = $1
      AND cs.date = $2
      AND ($3 < cs.end_time AND $4 > cs.start_time)
  `;
  const result = await db.query(query, [user_id, date, start_time, end_time]);
  return result.rows.length > 0;
}

// ==========================
// TẠO KHÓA HỌC + LỊCH HỌC
// ==========================
async function createCourse(course) {
  const {
    subject_id,
    user_id,
    semester,
    year,
    price,
    numofperiods,
    schedule // { date, start_time, end_time, room, note }
  } = course;

  // 1. Check trùng lịch
  const isConflict = await checkLecturerScheduleConflict(
    user_id,
    schedule.date,
    schedule.start_time,
    schedule.end_time
  );
  if (isConflict) {
    throw new Error("Giảng viên đã có lịch trùng vào thời gian này");
  }

  // 2. Tạo khóa học
  const courseResult = await db.query(
    `INSERT INTO course (subject_id, user_id, semester, year, price, created_at, numofperiods)
     VALUES ($1, $2, $3, $4, $5, NOW(), $6)
     RETURNING *`,
    [subject_id, user_id, semester, year, price, numofperiods]
  );
  const newCourse = courseResult.rows[0];

  // 3. Tạo lịch học cho khóa học
  await db.query(
    `INSERT INTO courseschedule (course_id, date, start_time, end_time, room, note)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      newCourse.course_id,
      schedule.date,
      schedule.start_time,
      schedule.end_time,
      schedule.room,
      schedule.note
    ]
  );

  return newCourse;
}

// ==========================
// LẤY TẤT CẢ KHÓA HỌC
// ==========================
async function getAllCourses() {
  const result = await db.query(
    `SELECT c.*, s.name AS subject_name
     FROM course c
     JOIN subject s ON c.subject_id = s.subject_id
     ORDER BY c.course_id DESC`
  );
  return result.rows;
}

// ==========================
// LẤY KHÓA HỌC THEO ID
// ==========================
async function getCourseById(courseId, userId = null, role = null) {
  let query = `
    SELECT c.*, s.name AS subject_name
    FROM course c
    JOIN subject s ON c.subject_id = s.subject_id
    WHERE c.course_id = $1
  `;
  const params = [Number(courseId)];

  if (Number(role) === 3) {
    if (!userId || isNaN(Number(userId))) {
      throw new Error("userId is invalid");
    }
    query += ` AND c.user_id = $2`;
    params.push(Number(userId));
  }

  const result = await db.query(query, params);
  return result.rows[0];
}

// ==========================
// CẬP NHẬT KHÓA HỌC
// ==========================
async function updateCourse(courseId, data) {
  const { subject_id, user_id, semester, year, price, numofperiods } = data;

  const checkCourse = await db.query(
    `SELECT * FROM course WHERE course_id = $1`,
    [courseId]
  );
  if (checkCourse.rows.length === 0) {
    throw new Error(`Course ID ${courseId} không tồn tại`);
  }

  const result = await db.query(
    `UPDATE course SET
      subject_id = $1,
      user_id = $2,
      semester = $3,
      year = $4,
      price = $5,
      numofperiods = $6
     WHERE course_id = $7
     RETURNING *`,
    [subject_id, user_id, semester, year, price, numofperiods, courseId]
  );

  return result.rows[0];
}

// ==========================
// XÓA KHÓA HỌC
// ==========================
async function deleteCourse(courseId) {
  await db.query(`DELETE FROM course WHERE course_id = $1`, [courseId]);
  return { message: "Xóa thành công" };
}

// ==========================
// LẤY KHÓA HỌC THEO GIẢNG VIÊN
// ==========================
async function getCoursesByLecturer(userId) {
  const result = await db.query(
    `SELECT c.*, s.name AS subject_name
     FROM course c
     JOIN subject s ON c.subject_id = s.subject_id
     WHERE c.user_id = $1
     ORDER BY c.course_id DESC`,
    [userId]
  );
  return result.rows;
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByLecturer
};
