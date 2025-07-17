const db = require("../config/db");

// ✅ Tạo mới khóa học
async function createCourse(course) {
  const {
    subject_id,
    user_id,
    semester,
    year,
    price,
    created_at,
    numofperiods,
  } = course;

  const result = await db.query(
    `INSERT INTO course (subject_id, user_id, semester, year, price, created_at, numofperiods)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [subject_id, user_id, semester, year, price, created_at || new Date(), numofperiods]
  );

  return result.rows[0];
}

// ✅ Lấy tất cả khóa học (cho admin, sinh viên)
async function getAllCourses() {
  const result = await db.query(
    `SELECT c.*, s.name AS subject_name
     FROM course c
     JOIN subject s ON c.subject_id = s.subject_id
     ORDER BY c.course_id DESC`
  );
  return result.rows;
}

// ✅ Lấy khóa học theo ID – có kiểm tra quyền nếu là giảng viên
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

// ✅ Cập nhật khóa học
async function updateCourse(courseId, data) {
  const {
    subject_id,
    user_id,
    semester,
    year,
    price,
    numofperiods,
  } = data;

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

// ✅ Xóa khóa học
async function deleteCourse(courseId) {
  await db.query(`DELETE FROM course WHERE course_id = $1`, [courseId]);
  return { message: "Xóa thành công" };
}

// ✅ Giảng viên: xem danh sách khóa học chính mình dạy
async function getCoursesByLecturer(userId) {
  const result = await db.query(`
    SELECT c.*, s.name AS subject_name
    FROM course c
    JOIN subject s ON c.subject_id = s.subject_id
    WHERE c.user_id = $1
    ORDER BY c.course_id DESC
  `, [userId]);

  return result.rows;
}


module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesByLecturer,
};
