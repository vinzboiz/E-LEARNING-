const db = require("../config/db");

// ✅ Thêm bài học (admin/giảng viên của course)
async function createLesson(data) {
  const { title, content, file, course_id } = data;
  const result = await db.query(
    `INSERT INTO lesson (title, content, file, course_id) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, content, file, course_id]
  );
  return result.rows[0];
}

// ✅ Cập nhật bài học
async function updateLesson(id, data) {
  const { title, content, file } = data;

  if (file) {
    // Nếu có file mới
    const result = await db.query(
      `UPDATE lesson SET title = $1, content = $2, file = $3 WHERE lesson_id = $4 RETURNING *`,
      [title, content, file, id]
    );
    return result.rows[0];
  } else {
    // Không thay đổi file
    const result = await db.query(
      `UPDATE lesson SET title = $1, content = $2 WHERE lesson_id = $3 RETURNING *`,
      [title, content, id]
    );
    return result.rows[0];
  }
}


// ✅ Xóa bài học
async function deleteLesson(id) {
  await db.query(`DELETE FROM lesson WHERE lesson_id = $1`, [id]);
  return { message: "Xoá bài học thành công" };
}

// ✅ Lấy tất cả bài học (admin & giảng viên)
async function getAllLessons() {
  const result = await db.query(`SELECT * FROM lesson ORDER BY lesson_id ASC`);
  return result.rows;
}

// ✅ Lấy bài học theo ID
async function getLessonById(id) {
  const result = await db.query(`SELECT * FROM lesson WHERE lesson_id = $1`, [id]);
  return result.rows[0];
}

// ✅ Lấy tất cả bài học của sinh viên đã đăng ký & thanh toán
async function getLessonsByStudent(user_id) {
  const result = await db.query(
    `SELECT l.* FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     JOIN classmember cm ON c.course_id = cm.course_id
     JOIN registercourse rc ON cm.register_id = rc.register_id
     WHERE rc.user_id = $1`,
    [user_id]
  );
  return result.rows;
}


// ✅ Lấy bài học theo ID (kiểm tra sinh viên có quyền)
async function getLessonByIdForStudent(userId, lessonId) {
  const result = await db.query(`
    SELECT l.*
    FROM lesson l
    INNER JOIN course c ON l.course_id = c.course_id
    INNER JOIN classmember cm ON cm.course_id = c.course_id
    INNER JOIN registercourse rc ON rc.register_id = cm.register_id
    WHERE l.lesson_id = $1 AND rc.user_id = $2 AND rc.status = 'đã thanh toán'
  `, [lessonId, userId]);
  return result.rows[0];
}


// ✅ Kiểm tra giảng viên có quyền sửa/xoá bài học
async function isCourseOwner(userId, lessonId) {
  const result = await db.query(`
    SELECT * FROM lesson l
    JOIN course c ON l.course_id = c.course_id
    WHERE l.lesson_id = $1 AND c.user_id = $2
  `, [lessonId, userId]);
  return result.rowCount > 0;
}

// ✅ Kiểm tra giảng viên có sở hữu khoá học khi tạo bài học
async function isCourseOwnerByCourse(userId, courseId) {
  const result = await db.query(
    `SELECT * FROM course WHERE course_id = $1 AND user_id = $2`,
    [courseId, userId]
  );
  return result.rowCount > 0;
}

module.exports = {
  createLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
  getLessonById,
  getLessonsByStudent,
  getLessonByIdForStudent,
  isCourseOwner,
  isCourseOwnerByCourse
};
