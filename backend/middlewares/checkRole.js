module.exports = function checkRole(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userId = Number(req.user.id);
    const targetId = Number(req.params.id);

    // [DEBUG] In ra console cho kiểm tra
    console.log("[Middleware] userId:", userId, "targetId:", targetId, "url:", req.originalUrl);

    // Nếu role nằm trong danh sách cho phép → cho qua
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Nếu là route lấy role chính mình thì cho phép
    if (
      req.originalUrl.match(/^\/api\/users\/\d+\/role$/) &&
      userId === targetId
    ) {
      return next();
    }

    return res.status(403).json({ message: "Không có quyền truy cập" });
  };
};
