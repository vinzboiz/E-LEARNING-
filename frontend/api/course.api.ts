import api from "./axiosInstance";

// URL prefix cho Course
const API_URL = "/api/course";

// ==================== ADMIN ====================
// Lấy tất cả khóa học (Admin)
export const getAllCoursesAdminApi = () => {
  return api.get(`${API_URL}/admin/all`);
};

// Lấy chi tiết khóa học (Admin)
export const getCourseByIdAdminApi = (id: number) => {
  return api.get(`${API_URL}/admin/${id}`);
};

// Tạo mới khóa học (Admin)
export const createCourseApi = (data: any) => {
  return api.post(API_URL, data);
};

// Cập nhật khóa học (Admin)
export const updateCourseApi = (id: number, data: any) => {
  return api.put(`${API_URL}/${id}`, data);
};

// Xóa khóa học (Admin)
export const deleteCourseApi = (id: number) => {
  return api.delete(`${API_URL}/${id}`);
};

// ==================== STUDENT ====================
// Lấy tất cả khóa học (Student)
export const getAllCoursesStudentApi = () => {
  return api.get(`${API_URL}/student/all`);
};

// Lấy chi tiết khóa học (Student)
export const getCourseByIdStudentApi = (id: number) => {
  return api.get(`${API_URL}/student/${id}`);
};

// ==================== TEACHER ====================
// Lấy các khóa học được phân công (Teacher)
export const getMyAssignedCoursesApi = () => {
  return api.get(`${API_URL}/teacher/my-courses`);
};

// Lấy chi tiết khóa học được dạy (Teacher)
export const getCourseByIdTeacherApi = (id: number) => {
  return api.get(`${API_URL}/teacher/course/${id}`);
};
