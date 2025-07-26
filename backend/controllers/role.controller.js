const roleModel = require("../models/role.model");

// Lấy tất cả vai trò
exports.getRoles = async (req, res) => {
  try {
    const roles = await roleModel.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

// Lấy vai trò theo ID
exports.getRole = async (req, res) => {
  try {
    const role = await roleModel.getRoleById(req.params.id);
    res.json(role);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Tạo vai trò mới
exports.createRole = async (req, res) => {
  try {
    const role = await roleModel.createRole(req.body.name);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: "Failed to create role" });
  }
};

// Cập nhật vai trò
exports.updateRole = async (req, res) => {
  try {
    const updated = await roleModel.updateRole(req.params.id, req.body.name);
    if (!updated) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to update role" });
  }
};

// Xóa vai trò
exports.deleteRole = async (req, res) => {
  try {
    const deleted = await roleModel.deleteRole(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Role not found or already deleted" });
    }
    res.json({ message: "Role deleted successfully", role: deleted });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete role" });
  }
};

// API: Lấy tên role theo user_id
exports.getRoleByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const roleName = await roleModel.getRoleNameByUserId(userId);
    if (!roleName) {
      return res.status(404).json({ message: "Role not found for this user" });
    }
    res.json({ role: roleName });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch role for user" });
  }
};
