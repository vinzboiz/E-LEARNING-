const express = require("express");
const router = express.Router();
const controller = require("../controllers/lesson.controller");
const auth = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");
const upload = require("../middlewares/upload.middleware"); // ✅ Thêm multer

router.use(auth);

// ✅ Xem tất cả bài học (Admin + GV)
router.get("/", checkRole(1, 3), controller.getAllLessons);

// ✅ Sinh viên xem tất cả bài học đã đăng ký
router.get("/student", checkRole(2), controller.getLessonsByStudent);

// ✅ Xem bài học chi tiết theo ID (có kiểm tra quyền)
router.get("/:id", controller.getLessonById);

// ✅ Thêm bài học (admin hoặc GV nếu là chủ) — 🟨 cần upload file
router.post("/", checkRole(1, 3), upload.single("file"), controller.createLesson);

// ✅ Cập nhật bài học (có thể mở rộng: cho upload lại file)
router.put("/:id", checkRole(1, 3), upload.single("file"), controller.updateLesson);

// ✅ Xóa bài học
router.delete("/:id", checkRole(1, 3), controller.deleteLesson);

module.exports = router;
