const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const authModel = require("../models/auth.model");

// Đăng ký tài khoản mới
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên, email và mật khẩu" });
    }

    // Kiểm tra email đã tồn tại
    const existing = await authModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Băm mật khẩu
    const hashed = await bcrypt.hash(password, 10);

    // Tạo người dùng mới với role mặc định là sinh viên (role_id = 2)
    const newUser = await userModel.createUser({
      name,
      email,
      password: hashed,
      role_id: 2,
    });

    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi đăng ký" });
  }
};

// Đăng nhập tài khoản
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
    }

    const user = await authModel.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi đăng nhập" });
  }
};

// Lấy thông tin người dùng hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy thông tin người dùng" });
  }
};

// Đăng xuất (Client cần xóa token)
exports.logout = async (req, res) => {
  try {
    // Với JWT stateless: chỉ thông báo thôi
    res.json({ message: "Đăng xuất thành công. Hãy xóa token ở phía client." });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi đăng xuất" });
  }
};
