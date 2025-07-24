// frontend/api/lesson.api.ts
import api from "./axiosInstance"; // Sử dụng axiosInstance

const BASE_URL = "/api/lesson";

/**
 * Lấy tất cả bài học theo course (Admin, Giảng viên)
 * @param courseId ID khóa học
 */
export const getAllLessons = (courseId: number) =>
  api.get(`${BASE_URL}?course_id=${courseId}`);

/**
 * Lấy tất cả bài học của sinh viên đã thanh toán
 */
export const getLessonsByStudent = () =>
  api.get(`${BASE_URL}/student`);

/**
 * Lấy bài học chi tiết theo ID
 * @param lessonId ID bài học
 */
export const getLessonById = (lessonId: number) =>
  api.get(`${BASE_URL}/${lessonId}`);

/**
 * Tạo bài học mới
 * @param data FormData chứa title, content, course_id, file (nếu có)
 */
export const createLesson = (data: FormData) =>
  api.post(BASE_URL, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Cập nhật bài học
 * @param lessonId ID bài học
 * @param data FormData chứa title, content, file (nếu có)
 */
export const updateLesson = (lessonId: number, data: FormData) =>
  api.put(`${BASE_URL}/${lessonId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/**
 * Xoá bài học
 * @param lessonId ID bài học
 */
export const deleteLesson = (lessonId: number) =>
  api.delete(`${BASE_URL}/${lessonId}`);
