const db = require("../config/db");

// ADMIN: Tạo mới toàn bộ đăng ký học phần cho tất cả user
async function createAll(begin_register, end_register, year, semester) {
  const due_start = new Date(end_register);
  due_start.setDate(due_start.getDate() + 1);

  const due_end = new Date(due_start);
  due_end.setDate(due_start.getDate() + 20);

  // Lấy danh sách tất cả user (sinh viên)
  const users = await db.query(`SELECT user_id FROM "users"`);

    for (const user of users.rows) {
    const check = await db.query(
      `SELECT 1 FROM registercourse 
      WHERE user_id = $1 AND year = $2 AND semester = $3`,
      [user.user_id, year, semester]
    );
    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    if (check.rowCount === 0) {
      await db.query(
        `INSERT INTO registercourse 
          (user_id, create_at, begin_register, end_register, tuition, status, due_date_start, due_date_end, year, semester)
        VALUES ($1, CURRENT_TIMESTAMP, $2, $3, 0, 'đang chờ xử lý', $4, $5, $6, $7)`,
        [user.user_id, formatDate(begin_register), formatDate(end_register), formatDate(due_start), formatDate(due_end), year, semester]
      );
    }
  }
  return { message: "Đã tạo thành công đăng ký học phần cho toàn bộ user." };
}

// Sinh viên: Xem thông tin đăng ký học phần của chính mình
async function getRegisterCourseByUser(userId) {
  const res = await db.query(
    `SELECT r.*, u.name AS user_name, u.email
     FROM registercourse r
     JOIN users u ON r.user_id = u.user_id
     WHERE r.user_id = $1
     ORDER BY r.create_at DESC LIMIT 1`,
    [userId]
  );
  return res.rows;
}

// ADMIN: Xem tất cả các bản ghi đăng ký học phần (chỉ sinh viên)
async function getAllRegisterCourses() {
  const res = await db.query(`
    SELECT r.*, u.name AS user_name, u.email, u.role_id
    FROM registercourse r
    JOIN users u ON r.user_id = u.user_id
    WHERE u.role_id = 2
    ORDER BY r.create_at DESC
  `);
  return res.rows;
}

// ADMIN: Cập nhật thời gian đăng ký cho toàn hệ thống
async function updateRegisterTimeForAll(begin, end, newBegin, newEnd) {
  const due_start = new Date(newEnd);
  due_start.setDate(due_start.getDate() + 1);

  const due_end = new Date(due_start);
  due_end.setDate(due_start.getDate() + 20);

  await db.query(
    `UPDATE registercourse
     SET begin_register = $1, end_register = $2,
         due_date_start = $3, due_date_end = $4
     WHERE begin_register = $5 AND end_register = $6`,
    [newBegin, newEnd, due_start, due_end, begin, end]
  );

  return { message: "Cập nhật thời gian đăng ký cho toàn hệ thống thành công" };
}

// Lấy chi tiết đăng ký học phần theo register_id
async function getRegisterCourseById(registerId, userId, role) {
  let query = `
    SELECT r.*, u.name AS user_name, u.email
    FROM registercourse r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.register_id = $1
  `;
  let params = [registerId];

  // Nếu là sinh viên thì phải kiểm tra đúng của mình mới được xem
  if (role === 2) {
    query += ` AND r.user_id = $2`;
    params.push(userId);
  }

  const registerRes = await db.query(query, params);
  if (registerRes.rows.length === 0) return null;

  // Lấy danh sách môn học trong lần đăng ký này
  const coursesRes = await db.query(`
    SELECT c.course_id, s.name AS subject_name, c.price
    FROM classmember cm
    JOIN course c ON cm.course_id = c.course_id
    JOIN subject s ON c.subject_id = s.subject_id
    WHERE cm.register_id = $1
  `, [registerId]);

  return {
    ...registerRes.rows[0],
    courses: coursesRes.rows
  };
}


module.exports = {
  createAll,
  getRegisterCourseByUser,
  getAllRegisterCourses,
  updateRegisterTimeForAll,
  getRegisterCourseById 
};
