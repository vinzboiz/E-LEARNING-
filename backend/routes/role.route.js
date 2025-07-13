const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkRole = require("../middlewares/checkRole");

router.get("/", authMiddleware, checkRole(1), roleController.getRoles);
router.get("/:id", authMiddleware, checkRole(1), roleController.getRole);
router.post("/", authMiddleware, checkRole(1), roleController.createRole);
router.put("/:id", authMiddleware, checkRole(1), roleController.updateRole);
router.delete("/:id", authMiddleware, checkRole(1), roleController.deleteRole);

module.exports = router;
