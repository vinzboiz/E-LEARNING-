const Course = require("../models/course.model");

// ✅ Tạo khóa học mới (admin)
exports.create = async (req, res) => {
  try {
    const course = await Course.createCourse(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Lấy tất cả khóa học (admin & sinh viên)
exports.findAll = async (req, res) => {
  try {
    const courses = await Course.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Lấy khóa học theo ID (giảng viên chỉ được xem nếu mình phụ trách)
exports.findById = async (req, res) => {
  const userId = Number(req.user?.id);       // ✅ dùng id thay vì user_id
  const role = Number(req.user?.role);       // ✅ dùng role đúng như middleware
  const courseId = Number(req.params.id);

  if (!userId || isNaN(userId)) {
    console.log("[FIND BY ID ERROR] userId is invalid");
    return res.status(500).json({ error: "userId is invalid" });
  }

  try {
    const course = await Course.getCourseById(courseId, userId, role);

    if (course) res.json(course);
    else res.status(404).json({ error: "Không tìm thấy khóa học hoặc bạn không có quyền truy cập" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Cập nhật khóa học
exports.update = async (req, res) => {
  try {
    const updated = await Course.updateCourse(req.params.id, req.body);
    if (updated) {
      res.json({ message: "Cập nhật thành công", course: updated });
    } else {
      res.status(404).json({ message: "Không tìm thấy môn học" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Xóa khóa học
exports.delete = async (req, res) => {
  try {
    const result = await Course.deleteCourse(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Giảng viên: xem danh sách khóa học của chính mình
exports.getMyAssignedCourses = async (req, res) => {
  try {
    const courses = await Course.getCoursesByLecturer(req.user.id);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

