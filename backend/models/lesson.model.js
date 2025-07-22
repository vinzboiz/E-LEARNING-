const db = require("../config/db");

// LESSON FUNCTIONS

// Thêm bài học (chỉ giảng viên được phân công cho course)
async function createLesson(userId, data) {
  const { title, content, file, course_id } = data;

  // Kiểm tra quyền giảng viên của course
  const isOwner = await isCourseOwnerByCourse(userId, course_id);
  if (!isOwner) {
    throw new Error("Bạn không có quyền thêm bài học cho khoá học này.");
  }

  const result = await db.query(
    `INSERT INTO lesson (title, content, file, course_id) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, content, file, course_id]
  );
  return result.rows[0];
}

// Cập nhật bài học (chỉ giảng viên được phân công cho course)
async function updateLesson(userId, id, data) {
  // Kiểm tra quyền
  const isOwner = await isCourseOwner(userId, id);
  if (!isOwner) {
    throw new Error("Bạn không có quyền sửa bài học này.");
  }

  const { title, content, file } = data;

  let result;
  if (file) {
    result = await db.query(
      `UPDATE lesson SET title = $1, content = $2, file = $3 WHERE lesson_id = $4 RETURNING *`,
      [title, content, file, id]
    );
  } else {
    result = await db.query(
      `UPDATE lesson SET title = $1, content = $2 WHERE lesson_id = $3 RETURNING *`,
      [title, content, id]
    );
  }
  return result.rows[0];
}

// Xóa bài học (chỉ giảng viên được phân công cho course)
async function deleteLesson(userId, id) {
  const isOwner = await isCourseOwner(userId, id);
  if (!isOwner) {
    throw new Error("Bạn không có quyền xoá bài học này.");
  }

  await db.query(`DELETE FROM lesson WHERE lesson_id = $1`, [id]);
  return { message: "Xoá bài học thành công" };
}

// Lấy tất cả bài học của giảng viên cho course do họ dạy
async function getAllLessons(userId, courseId) {
  // Kiểm tra quyền giảng viên
  const isOwner = await isCourseOwnerByCourse(userId, courseId);
  if (!isOwner) {
    throw new Error("Bạn không có quyền xem bài học của khoá học này.");
  }

  const result = await db.query(
    `SELECT * FROM lesson WHERE course_id = $1 ORDER BY lesson_id ASC`,
    [courseId]
  );
  return result.rows;
}

// Lấy bài học theo ID (chỉ giảng viên được phân công)
async function getLessonById(userId, id) {
  const isOwner = await isCourseOwner(userId, id);
  if (!isOwner) {
    throw new Error("Bạn không có quyền xem bài học này.");
  }

  const result = await db.query(
    `SELECT * FROM lesson WHERE lesson_id = $1`,
    [id]
  );
  return result.rows[0];
}

// STUDENT LESSONS

// Lấy tất cả bài học của sinh viên đã đăng ký & thanh toán
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

// Lấy bài học theo ID cho sinh viên đã thanh toán
async function getLessonByIdForStudent(userId, lessonId) {
  const result = await db.query(
    `SELECT l.*
     FROM lesson l
     INNER JOIN course c ON l.course_id = c.course_id
     INNER JOIN classmember cm ON cm.course_id = c.course_id
     INNER JOIN registercourse rc ON rc.register_id = cm.register_id
     WHERE l.lesson_id = $1 AND rc.user_id = $2 AND rc.status = 'đã thanh toán'`,
    [lessonId, userId]
  );
  return result.rows[0];
}

// CHECK PERMISSIONS

// Kiểm tra giảng viên có quyền sửa/xoá bài học
async function isCourseOwner(userId, lessonId) {
  const result = await db.query(
    `SELECT 1 FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     WHERE l.lesson_id = $1 AND c.user_id = $2`,
    [lessonId, userId]
  );
  return result.rowCount > 0;
}

// Kiểm tra giảng viên có sở hữu khoá học khi tạo bài học
async function isCourseOwnerByCourse(userId, courseId) {
  const result = await db.query(
    `SELECT 1 FROM course WHERE course_id = $1 AND user_id = $2`,
    [courseId, userId]
  );
  return result.rowCount > 0;
}

// Kiểm tra giảng viên có quyền với lesson qua course
async function isCourseOwnerByLesson(userId, lessonId) {
  const result = await db.query(
    `SELECT 1 FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     WHERE l.lesson_id = $1 AND c.user_id = $2`,
    [lessonId, userId]
  );
  return result.rowCount > 0;
}

// Kiểm tra user có quyền xem lesson (giảng viên chủ hoặc sinh viên đã thanh toán)
async function canUserViewLesson(userId, lessonId) {
  // Giảng viên chủ course
  const ownerCheck = await db.query(
    `SELECT 1 FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     WHERE l.lesson_id = $1 AND c.user_id = $2`,
    [lessonId, userId]
  );
  if (ownerCheck.rowCount > 0) return true;

  // Sinh viên đã thanh toán
  const studentCheck = await db.query(
    `SELECT 1 FROM lesson l
     JOIN course c ON l.course_id = c.course_id
     JOIN classmember cm ON cm.course_id = c.course_id
     JOIN registercourse rc ON rc.register_id = cm.register_id
     WHERE l.lesson_id = $1 AND rc.user_id = $2 AND rc.status = 'đã thanh toán'`,
    [lessonId, userId]
  );
  return studentCheck.rowCount > 0;
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
  isCourseOwnerByCourse,
  canUserViewLesson,
  isCourseOwnerByLesson
};
