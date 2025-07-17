const lessonModel = require("../models/lesson.model");

// ✅ Lấy tất cả bài học (Admin & Giảng viên)
exports.getAllLessons = async (req, res) => {
  try {
    if (req.user.role === 1 || req.user.role === 3) {
      const lessons = await lessonModel.getAllLessons();
      return res.json(lessons);
    }
    return res.status(403).json({ error: "Bạn không có quyền truy cập." });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách bài học." });
  }
};

// ✅ Lấy bài học theo ID
exports.getLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const role = req.user.role;

    // Admin & Giảng viên xem bất kỳ
    if (role === 1 || role === 3) {
      const lesson = await lessonModel.getLessonById(lessonId);
      if (!lesson) return res.status(404).json({ error: "Không tìm thấy bài học." });
      return res.json(lesson);
    }

    // Sinh viên chỉ xem nếu đã đăng ký và thanh toán
    if (role === 2) {
      const lesson = await lessonModel.getLessonByIdForStudent(req.user.id, lessonId);
      if (!lesson) return res.status(403).json({ error: "Bạn không có quyền xem bài học này." });
      return res.json(lesson);
    }

    res.status(403).json({ error: "Vai trò không hợp lệ." });
  } catch (err) {
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

    // 🧠 Nếu có file upload thì dùng tên file
    const file = req.file ? req.file.filename : null;

    // ✅ Nếu là giảng viên, kiểm tra quyền
    if (req.user.role === 3) {
      const isOwner = await lessonModel.isCourseOwnerByCourse(req.user.id, course_id);
      if (!isOwner) {
        return res.status(403).json({ error: "Bạn không có quyền tạo bài học cho khoá học này." });
      }
    }

    const newLesson = await lessonModel.createLesson({
      title,
      content,
      file,
      course_id,
    });

    res.status(201).json(newLesson);
  } catch (error) {
    console.error("Lỗi khi tạo bài học:", error);
    res.status(500).json({ error: "Lỗi khi tạo bài học." });
  }
};

// ✅ Cập nhật bài học (Admin hoặc Giảng viên nếu là chủ bài học)
exports.updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { title, content } = req.body;

    // 🧠 Nếu có file mới thì dùng tên file, không thì giữ nguyên
    const file = req.file ? req.file.filename : null;

    if (req.user.role === 1) {
      const updated = await lessonModel.updateLesson(lessonId, { title, content, file });
      return res.json(updated);
    }

    if (req.user.role === 3) {
      const isOwner = await lessonModel.isCourseOwner(req.user.id, lessonId);
      if (!isOwner) return res.status(403).json({ error: "Bạn không có quyền sửa bài học này." });

      const updated = await lessonModel.updateLesson(lessonId, { title, content, file });
      return res.json(updated);
    }

    res.status(403).json({ error: "Bạn không có quyền cập nhật bài học." });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật bài học:", err);
    res.status(500).json({ error: "Lỗi khi cập nhật bài học." });
  }
};


// ✅ Xóa bài học (Admin hoặc Giảng viên nếu là chủ)
exports.deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;

    // Admin được phép xoá
    if (req.user.role === 1) {
      const result = await lessonModel.deleteLesson(lessonId);
      return res.json(result);
    }

    // Giảng viên xoá nếu là chủ bài học
    if (req.user.role === 3) {
      const isOwner = await lessonModel.isCourseOwner(req.user.id, lessonId);
      if (!isOwner) return res.status(403).json({ error: "Bạn không có quyền xoá bài học này." });
      const result = await lessonModel.deleteLesson(lessonId);
      return res.json(result);
    }

    res.status(403).json({ error: "Bạn không có quyền xoá bài học." });
  } catch (err) {
    res.status(500).json({ error: "Lỗi khi xoá bài học." });
  }
};
