import api from "./axiosInstance";

// Lấy tất cả người dùng (Admin)
export const getAllUsersApi = () => {
  return api.get("/api/users");
};

// Lấy người dùng theo ID
export const getUserByIdApi = (id: number) => {
  return api.get(`/api/users/${id}`);
};

// Tạo người dùng mới (Admin)
export const createUserApi = (data: any) => {
  return api.post("/api/users", data);
};

// Cập nhật người dùng
export const updateUserApi = (id: number, data: any) => {
  return api.put(`/api/users/${id}`, data);
};

// Xóa người dùng
export const deleteUserApi = (id: number) => {
  return api.delete(`/api/users/${id}`);
};

// Lấy danh sách giảng viên (Admin)
export const getAllTeachersApi = () => {
  return api.get("/api/users/teachers");
};
