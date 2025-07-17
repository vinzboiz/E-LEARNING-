const db = require("../config/db");

// ✅ Admin: Thêm lịch học
async function create(data) {
  const { course_id, room, date, start_time, end_time, note } = data;
  const result = await db.query(
    `INSERT INTO courseschedule (course_id, room, date, start_time, end_time, note)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [course_id, room, date, start_time, end_time, note]
  );
  return result.rows[0];
}

// ✅ Admin: Sửa lịch học
async function update(schedule_id, data) {
  const { room, date, start_time, end_time, note } = data;
  const result = await db.query(
    `UPDATE courseschedule
     SET room = $1, date = $2, start_time = $3, end_time = $4, note = $5
     WHERE schedule_id = $6 RETURNING *`,
    [room, date, start_time, end_time, note, schedule_id]
  );
  return result.rows[0];
}

// ✅ Admin: Xoá lịch học
async function remove(schedule_id) {
  await db.query("DELETE FROM courseschedule WHERE schedule_id = $1", [schedule_id]);
  return { message: "Xoá lịch học thành công" };
}

// ✅ Admin: Lấy tất cả lịch học
async function getAll() {
  const result = await db.query(
    `SELECT cs.*, s.name AS subject_name FROM courseschedule cs
     JOIN course c ON cs.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id`
  );
  return result.rows;
}

// ✅ Admin: Lấy lịch học theo ID
async function getById(schedule_id) {
  const result = await db.query(
    `SELECT cs.*, s.name AS subject_name FROM courseschedule cs
     JOIN course c ON cs.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     WHERE cs.schedule_id = $1`,
    [schedule_id]
  );
  return result.rows[0];
}

// ✅ Giảng viên: Xem lịch học của khóa mình phụ trách
async function getByTeacher(userId) {
  const result = await db.query(
    `SELECT cs.*, s.name AS subject_name
     FROM courseschedule cs
     JOIN course c ON cs.course_id = c.course_id
     JOIN subject s ON c.subject_id = s.subject_id
     JOIN "users" u ON c.user_id = u.user_id
     WHERE u.user_id = $1 AND u.role_id = 3`,
    [userId]
  );
  return result.rows;
}


// ✅ Sinh viên: Xem lịch học theo các quy tắc nghiệp vụ
async function getByStudent(userId, course_id = null) {
  const regRes = await db.query(
    `SELECT * FROM registercourse WHERE user_id = $1 ORDER BY create_at DESC LIMIT 1`,
    [userId]
  );

  if (regRes.rows.length === 0) {
    console.log("❌ Không có bản ghi registercourse");
    return {
      success: false,
      message: "Bạn chưa từng đăng ký khóa học nào.",
      data: []
    };
  }

  const reg = regRes.rows[0];
  const now = new Date();
  const begin = new Date(reg.begin_register);
  const end = new Date(reg.end_register);
  const due = new Date(reg.due_date_end);
  const status = reg.status;

  console.log("📌 Status:", status);
  console.log("⏱️ Now:", now);
  console.log("📅 Đăng ký từ:", begin, "→", end);
  console.log("💰 Hạn đóng học phí:", due);

  // ❌ Trường hợp đã hủy
  if (status === 'đã hủy môn') {
    console.log("⛔ Đã hủy môn → Không xem được");
    return {
      success: false,
      message: "Bạn đã hủy môn học. Không thể xem lịch học.",
      data: []
    };
  }

  // ✅ Trường hợp 1: Còn hạn đăng ký & đang chờ xử lý
  if (status === 'đang chờ xử lý' && now >= begin && now <= end) {
    console.log("✅ TH1: Trong thời gian đăng ký và đang chờ xử lý");
    const result = course_id
      ? await db.query(`
          SELECT cs.*, s.name AS subject_name FROM courseschedule cs
          JOIN course c ON cs.course_id = c.course_id
          JOIN subject s ON c.subject_id = s.subject_id
          WHERE cs.course_id = $1`, [course_id])
      : await getAll();

    return {
      success: true,
      message: "Lấy lịch học theo điều kiện đăng ký còn hạn.",
      data: result.rows
    };
  }

  // ✅ Trường hợp 2: Đã thanh toán → luôn được xem khóa mình đã đăng ký
  if (status === 'đã thanh toán') {
    console.log("✅ TH2: Đã thanh toán → luôn xem được");

    const registeredCourses = await db.query(
      `SELECT course_id FROM classmember WHERE user_id = $1`,
      [userId]
    );
    const ids = registeredCourses.rows.map(r => r.course_id);
    if (ids.length === 0) {
      return {
        success: false,
        message: "Bạn chưa được xếp lớp cho khóa học nào.",
        data: []
      };
    }

    const query = course_id ? `AND cs.course_id = $2` : "";

    const result = await db.query(
      `SELECT cs.*, s.name AS subject_name FROM courseschedule cs
       JOIN course c ON cs.course_id = c.course_id
       JOIN subject s ON c.subject_id = s.subject_id
       WHERE cs.course_id = ANY($1) ${query}`,
      course_id ? [ids, course_id] : [ids]
    );
    return {
      success: true,
      message: "Lấy lịch học thành công (đã thanh toán).",
      data: result.rows
    };
  }

  // ✅ Trường hợp 3: Hết hạn đăng ký nhưng còn hạn đóng học phí & đang chờ xử lý
  if (status === 'đang chờ xử lý' && now > end && now <= due) {
    console.log("✅ TH3: Đang chờ xử lý nhưng đã quá hạn đăng ký và còn hạn đóng học phí");

    const registeredCourses = await db.query(
      `SELECT course_id FROM classmember WHERE user_id = $1`,
      [userId]
    );
    const ids = registeredCourses.rows.map(r => r.course_id);
    if (ids.length === 0) {
      return {
        success: false,
        message: "Bạn chưa được xếp lớp cho khóa học nào.",
        data: []
      };
    }

    const query = course_id ? `AND cs.course_id = $2` : "";

    const result = await db.query(
      `SELECT cs.*, s.name AS subject_name FROM courseschedule cs
       JOIN course c ON cs.course_id = c.course_id
       JOIN subject s ON c.subject_id = s.subject_id
       WHERE cs.course_id = ANY($1) ${query}`,
      course_id ? [ids, course_id] : [ids]
    );
    return {
      success: true,
      message: "Lấy lịch học thành công (đang chờ xử lý).",
      data: result.rows
    };
  }

  // ❌ Không khớp nghiệp vụ nào
  return {
    success: false,
    message: "Bạn không có quyền xem lịch học vào thời điểm này.",
    data: []
  };
}


module.exports = {
  create,
  update,
  remove,
  getAll,
  getById,
  getByTeacher,
  getByStudent,
};
