import {
  getAllCoursesAdminApi,
  getCourseByIdAdminApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  getAllCoursesStudentApi,
  getCourseByIdStudentApi,
  getMyAssignedCoursesApi,
  getCourseByIdTeacherApi,
} from "../api/course.api";

export const CourseService = {
  // ==================== ADMIN ====================
  getAllAdmin: async () => {
    try {
      const response = await getAllCoursesAdminApi();
      return response.data;
    } catch (error: any) {
      console.log("Error getAllAdmin:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy danh sách khóa học (Admin) thất bại");
    }
  },

  getByIdAdmin: async (id: number) => {
    try {
      const response = await getCourseByIdAdminApi(id);
      return response.data;
    } catch (error: any) {
      console.log("Error getByIdAdmin:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy chi tiết khóa học (Admin) thất bại");
    }
  },

  create: async (data: any) => {
    try {
      const response = await createCourseApi(data);
      return response.data;
    } catch (error: any) {
      console.log("Error create course:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Tạo khóa học thất bại");
    }
  },

  update: async (id: number, data: any) => {
    try {
      const response = await updateCourseApi(id, data);
      return response.data;
    } catch (error: any) {
      console.log("Error update course:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Cập nhật khóa học thất bại");
    }
  },

  delete: async (id: number) => {
    try {
      const response = await deleteCourseApi(id);
      return response.data;
    } catch (error: any) {
      console.log("Error delete course:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Xóa khóa học thất bại");
    }
  },

  // ==================== STUDENT ====================
  getAllStudent: async () => {
    try {
      const response = await getAllCoursesStudentApi();
      return response.data;
    } catch (error: any) {
      console.log("Error getAllStudent:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy danh sách khóa học (Student) thất bại");
    }
  },

  getByIdStudent: async (id: number) => {
    try {
      const response = await getCourseByIdStudentApi(id);
      return response.data;
    } catch (error: any) {
      console.log("Error getByIdStudent:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy chi tiết khóa học (Student) thất bại");
    }
  },

  // ==================== TEACHER ====================
  getMyCoursesTeacher: async () => {
    try {
      const response = await getMyAssignedCoursesApi();
      return response.data;
    } catch (error: any) {
      console.log("Error getMyCoursesTeacher:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy danh sách khóa học (Teacher) thất bại");
    }
  },

  getByIdTeacher: async (id: number) => {
    try {
      const response = await getCourseByIdTeacherApi(id);
      return response.data;
    } catch (error: any) {
      console.log("Error getByIdTeacher:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Lấy chi tiết khóa học (Teacher) thất bại");
    }
  },
};
