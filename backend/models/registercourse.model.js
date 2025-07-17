const db = require("../config/db");

// ✅ ADMIN: Tạo mới toàn bộ đăng ký học phần cho tất cả user
async function createAll(begin_register, end_register, year, semester) {
  const due_start = new Date(end_register);
  due_start.setDate(due_start.getDate() + 1);

  const due_end = new Date(due_start);
  due_end.setDate(due_start.getDate() + 20);

  // Lấy danh sách tất cả user (sinh viên)
  const users = await db.query(`SELECT user_id FROM "users"`);

  for (const user of users.rows) {
    await db.query(
      `INSERT INTO registercourse 
        (user_id, create_at, begin_register, end_register, tuition, status, due_date_start, due_date_end, year, semester)
       VALUES ($1, CURRENT_TIMESTAMP, $2, $3, 0, 'đang chờ xử lý', $4, $5, $6, $7)`,
      [user.user_id, begin_register, end_register, due_start, due_end, year, semester]
    );
  }

  return { message: "Đã tạo thành công đăng ký học phần cho toàn bộ user." };
}

// ✅ Sinh viên: Xem thông tin đăng ký học phần của chính mình
async function getRegisterCourseByUser(userId) {
  const res = await db.query(
    `SELECT * FROM registercourse WHERE user_id = $1 ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );
  return res.rows;
}

// ✅ ADMIN: Xem tất cả các bản ghi đăng ký học phần
async function getAllRegisterCourses() {
  const res = await db.query(`SELECT * FROM registercourse ORDER BY create_at DESC`);
  return res.rows;
}

// ✅ ADMIN: Cập nhật thời gian đăng ký cho toàn hệ thống
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

module.exports = {
  createAll,
  getRegisterCourseByUser,
  getAllRegisterCourses,
  updateRegisterTimeForAll
};
