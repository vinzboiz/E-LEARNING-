const CourseSchedule = require("../models/courseschedule.model");

// ✅ Admin – Thêm lịch học
exports.create = async (req, res) => {
  try {
    const result = await CourseSchedule.create(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Admin – Sửa lịch học
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CourseSchedule.update(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Admin – Xoá lịch học
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CourseSchedule.remove(id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Admin – Xem tất cả lịch học
exports.getAll = async (req, res) => {
  try {
    const data = await CourseSchedule.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Admin – Xem chi tiết lịch học
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await CourseSchedule.getById(id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// ✅ Giảng viên – Lịch dạy của mình
exports.getByTeacher = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await CourseSchedule.getByTeacher(userId);

    if (!data || data.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Bạn chưa được phân công giảng dạy bất kỳ lịch học nào.",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Lấy danh sách lịch dạy thành công.",
      data: data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi máy chủ.",
      error: error.message
    });
  }
};


// ✅ Sinh viên – Xem lịch học theo nghiệp vụ 3 điều kiện
exports.getByStudent = async (req, res) => {
  try {
    console.log("✅ Đã vào controller getByStudent");
    const userId = req.user.id;
    const courseId = req.query.course_id || null;
    const data = await CourseSchedule.getByStudent(userId, courseId);
    res.json(data);
  } catch (error) {
    console.error("❌ Lỗi controller getByStudent:", error);
    res.status(403).json({ error: error.message });
  }
};

