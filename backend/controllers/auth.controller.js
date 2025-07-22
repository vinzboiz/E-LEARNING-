const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const authModel = require("../models/auth.model");
const otpModel = require("../models/otp.model");
const { sendOTP } = require("../utils/sendEmail");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP 6 số
}

// 1. Gửi OTP khi đăng ký
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên, email và mật khẩu" });
    }

    const existing = await authModel.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    await otpModel.createOTP(email, otp, expiresAt);
    await sendOTP(email, otp);

    // Chưa tạo user ngay, đợi xác thực OTP
    res.json({
      message: "OTP đã được gửi đến email. Vui lòng xác nhận OTP để hoàn tất đăng ký.",
      email,
      name,
      password // Có thể bỏ password ở response để bảo mật
    });
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

//Đăng ký qua OTP

// Gửi OTP qua email
exports.sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng nhập tên, email và mật khẩu" });
    }

    const existing = await authModel.findUserByEmail(email);
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpModel.createOTP(email, otp, expiresAt);
    await sendOTP(email, otp);

    res.json({ message: "OTP đã được gửi đến email của bạn", email, name, password });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi gửi OTP" });
  }
};

// 2. Xác thực OTP và tạo tài khoản
exports.verifyOTP = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    const record = await otpModel.findOTP(email, otp);
    if (!record || new Date() > record.expires_at) {
      return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({
      name,
      email,
      password: hashed,
      role_id: 2, // Mặc định là sinh viên
    });

    await otpModel.deleteOTP(email);

    res.status(201).json({ message: "Đăng ký thành công", user: newUser });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi xác thực OTP" });
  }
};