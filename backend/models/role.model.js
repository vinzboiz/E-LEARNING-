const db = require("../config/db");

// Lấy tất cả vai trò
async function getAllRoles() {
  const result = await db.query("SELECT * FROM role ORDER BY role_id ASC");
  return result.rows;
}

// Lấy vai trò theo ID
async function getRoleById(id) {
  if (!id || isNaN(Number(id))) {
    throw new Error("Invalid role ID");
  }

  const result = await db.query("SELECT * FROM role WHERE role_id = $1", [id]);

  if (result.rows.length === 0) {
    throw new Error(`Role with ID ${id} not found`);
  }

  return result.rows[0];
}

// Tạo vai trò mới
async function createRole(name) {
  const result = await db.query("INSERT INTO role(name) VALUES ($1) RETURNING *", [name]);
  return result.rows[0];
}

// Cập nhật vai trò
async function updateRole(id, name) {
  const result = await db.query(
    "UPDATE role SET name = $1 WHERE role_id = $2 RETURNING *",
    [name, id]
  );
  return result.rows[0];
}

// Xóa vai trò
async function deleteRole(id) {
  const result = await db.query("DELETE FROM role WHERE role_id = $1 RETURNING *", [id]);
  return result.rows[0];
}

// Export tất cả hàm
module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
