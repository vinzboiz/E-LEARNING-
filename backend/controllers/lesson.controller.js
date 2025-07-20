const lessonModel = require("../models/lesson.model");

// ✅ Lấy tất cả bài học (Admin & Giảng viên được phân công)
exports.getAllLessons = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const courseId = req.query.course_id; // Yêu cầu truyền course_id qua query

    if (!courseId) {
      return res.status(400).json({ error: "Vui lòng cung cấp course_id." });
    }

    // Admin có thể xem tất cả
    if (role === 1) {
      const lessons = await lessonModel.getAllLessons(userId, courseId);
      return res.json(lessons);
    }

    // Giảng viên chỉ xem nếu là chủ của course
    if (role === 3) {
      const lessons = await lessonModel.getAllLessons(userId, courseId);
      return res.json(lessons);
    }

    return res.status(403).json({ error: "Bạn không có quyền truy cập." });
  } catch (err) {
    console.error("❌ Lỗi getAllLessons:", err);
    res.status(500).json({ error: "Lỗi khi lấy danh sách bài học." });
  }
};

// ✅ Lấy bài học theo ID
exports.getLessonById = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const lessonId = req.params.id;

    // Admin hoặc giảng viên (nếu là chủ)
    if (role === 1) {
      const lesson = await lessonModel.getLessonById(userId, lessonId);
      if (!lesson) return res.status(404).json({ error: "Không tìm thấy bài học." });
      return res.json(lesson);
    }

    if (role === 3) {
      const lesson = await lessonModel.getLessonById(userId, lessonId);
      if (!lesson) return res.status(403).json({ error: "Bạn không có quyền xem bài học này." });
      return res.json(lesson);
    }

    // Sinh viên
    if (role === 2) {
      const lesson = await lessonModel.getLessonByIdForStudent(userId, lessonId);
      if (!lesson) return res.status(403).json({ error: "Bạn không có quyền xem bài học này." });
      return res.json(lesson);
    }

    res.status(403).json({ error: "Vai trò không hợp lệ." });
  } catch (err) {
    console.error("❌ Lỗi getLessonById:", err);
    res.status(500).json({ error: "Lỗi khi lấy bài học." });
  }
};

// ✅ Sinh viên: Lấy tất cả bài học đã đăng ký & thanh toán
exports.getLessonsByStudent = async (req, res) => {
  try {
    if (req.user.role !== 2) {
      return res.status(403).json({ error: "Chỉ sinh viên mới dùng chức năng này." });
    }
    const lessons = await lessonModel.getLessonsByStudent(req.user.id);
    res.json(lessons);
  } catch (err) {
    console.error("❌ Lỗi getLessonsByStudent:", err);
    res.status(500).json({ error: "Lỗi khi lấy bài học cho sinh viên." });
  }
};

// ✅ Thêm bài học (Admin hoặc Giảng viên nếu là chủ khóa học)
exports.createLesson = async (req, res) => {
  try {
    const { title, content, course_id } = req.body;
    const { role, id: userId } = req.user;
    const file = req.file ? req.file.filename : null;

    if (role !== 1 && role !== 3) {
      return res.status(403).json({ error: "Bạn không có quyền tạo bài học." });
    }

    const newLesson = await lessonModel.createLesson(userId, {
      title,
      content,
      file,
      course_id,
    });

    res.status(201).json(newLesson);
  } catch (error) {
    console.error("Lỗi khi tạo bài học:", error);
    res.status(500).json({ error: error.message || "Lỗi khi tạo bài học." });
  }
};

// ✅ Cập nhật bài học (Admin hoặc Giảng viên nếu là chủ bài học)
exports.updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { title, content } = req.body;
    const { role, id: userId } = req.user;
    const file = req.file ? req.file.filename : null;

    if (role === 1) {
      const updated = await lessonModel.updateLesson(userId, lessonId, { title, content, file });
      return res.json(updated);
    }

    if (role === 3) {
      const updated = await lessonModel.updateLesson(userId, lessonId, { title, content, file });
      return res.json(updated);
    }

    res.status(403).json({ error: "Bạn không có quyền cập nhật bài học." });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật bài học:", err);
    res.status(500).json({ error: err.message || "Lỗi khi cập nhật bài học." });
  }
};

// ✅ Xóa bài học (Admin hoặc Giảng viên nếu là chủ)
exports.deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { role, id: userId } = req.user;

    if (role === 1) {
      const result = await lessonModel.deleteLesson(userId, lessonId);
      return res.json(result);
    }

    if (role === 3) {
      const result = await lessonModel.deleteLesson(userId, lessonId);
      return res.json(result);
    }

    res.status(403).json({ error: "Bạn không có quyền xoá bài học." });
  } catch (err) {
    console.error("❌ Lỗi khi xoá bài học:", err);
    res.status(500).json({ error: err.message || "Lỗi khi xoá bài học." });
  }
};
