const express = require("express");
const router = express.Router();
const controller = require("../controllers/courseschedule.controller");
const auth = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");

// Yêu cầu đăng nhập trước
router.use(auth);

// ================== ADMIN (role_id = 1) ==================
router.post("/", checkRole(1), controller.create);            // Thêm lịch học
router.put("/:id", checkRole(1), controller.update);          // Sửa lịch học
router.delete("/:id", checkRole(1), controller.remove);       // Xoá lịch học
router.get("/", checkRole(1), controller.getAll);    // Xem tất cả lịch học
router.get("/:id", checkRole(1), controller.getById);   // Xem chi tiết lịch học

// ================== GIẢNG VIÊN (role_id = 3) ==================
router.get("/teacher/my-schedules", checkRole(3), controller.getByTeacher);  // Lịch giảng dạy của mình

// ================== SINH VIÊN (role_id = 2) ==================
router.get("/courseschedules/student", checkRole(2), controller.getByStudent);     // Lịch học sinh viên có thể xem

module.exports = router;
