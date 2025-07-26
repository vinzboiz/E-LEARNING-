const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");

// Regex kiểm tra mật khẩu mạnh
const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(password);
};

// Lấy tất cả người dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

// Lấy người dùng theo ID
exports.getUser = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Tạo người dùng mới (admin)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await userModel.createUser({
      name,
      email,
      password: hashed,
      role_id,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" });
  }
};

// Cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    if (password) {
      if (!isStrongPassword(password)) {
        return res.status(400).json({
          message:
            "Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt",
        });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Chỉ admin mới được thay đổi role_id
    if (req.user.role === 1 && role_id !== undefined) {
      updateData.role_id = role_id;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu nào để cập nhật" });
    }

    const updated = await userModel.updateUser(req.params.id, updateData);
    res.json({ message: "Cập nhật thành công", user: updated });

  } catch (error) {
    res.status(400).json({ message: "Cập nhật thất bại", error: error.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    console.log("Deleting user with ID:", req.params.id);
    const deleted = await userModel.deleteUser(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "User not found or already deleted" });
    }
    res.json({ message: "User deleted successfully", user: deleted });
  } catch (error) {
    console.error("Error deleteUser:", error.message);
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
};

// Lấy danh sách giảng viên (chỉ admin mới xem)
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await userModel.getAllTeachers();
    res.status(200).json({
      success: true,
      message: "Danh sách giảng viên",
      data: teachers,
    });
  } catch (error) {
    console.error("Error in getTeachers:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await userModel.getUserRoleById(id);

    if (!role) {
      return res.status(404).json({ error: "Role không tồn tại" });
    }

    res.json(role);
  } catch (error) {
    console.error("Error getUserRole:", error);
    res.status(500).json({ error: "Lấy role người dùng thất bại" });
  }
};
