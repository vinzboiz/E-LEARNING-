// test/UI/Schedule/EditCourseScheduleScreen.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import EditCourseScheduleScreen from "../../../screens/Schedule/EditCourseScheduleScreen";
import { CourseScheduleService } from "../../../services/courseschedule.service";

// Mock navigation + route
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
    navigate: jest.fn(),
  }),
  useRoute: () => ({
    params: { courseId: 101, scheduleId: 1 },
  }),
}));

// Mock images (tránh lỗi require ảnh)
jest.mock("../../../constants/images/images", () => ({
  Images: {
    TopBanner: { schedule: 1 },
  },
}));

// Mock service
jest.mock("../../../services/courseschedule.service");

describe("EditCourseScheduleScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị đầy đủ dữ liệu từ fetchSchedule()", async () => {
    // ✅ Mock API có delay để giả lập loading thật
    (CourseScheduleService.getByIdAdmin as jest.Mock).mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              schedule_id: 1,
              date: "2025-08-14T00:00:00Z",
              start_time: "07:30:00",
              end_time: "11:30:00",
              room: "online:123",
              note: "abc",
              course_id: 101,
            },
          });
        }, 1000); // delay 50ms
      });
    });

    render(<EditCourseScheduleScreen />);

    // ✅ findBy... sẽ tự chờ đến khi field xuất hiện
    expect(await screen.findByDisplayValue("2025-08-14")).toBeTruthy();
    expect(await screen.findByDisplayValue("07:30:00")).toBeTruthy();
    expect(await screen.findByDisplayValue("11:30:00")).toBeTruthy();
    expect(await screen.findByDisplayValue("online:123")).toBeTruthy();
    expect(await screen.findByDisplayValue("abc")).toBeTruthy();
  });

  it("cho phép chỉnh sửa dữ liệu trong các ô nhập", async () => {
    (CourseScheduleService.getByIdAdmin as jest.Mock).mockImplementationOnce(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              schedule_id: 1,
              date: "2025-08-14T00:00:00Z",
              start_time: "07:30:00",
              end_time: "11:30:00",
              room: "online:123",
              note: "",
              course_id: 101,
            },
          });
        }, 1000); // delay 50ms
      });
    });

    render(<EditCourseScheduleScreen />);

    // Sửa giá trị phòng học
    const roomInput = await screen.findByDisplayValue("online:123");
    fireEvent.changeText(roomInput, "offline:456");
    expect(await screen.findByDisplayValue("offline:456")).toBeTruthy();

    // Sửa giá trị ghi chú
    const noteInput = await screen.findByDisplayValue("");
    fireEvent.changeText(noteInput, "Học trực tiếp");
    expect(await screen.findByDisplayValue("Học trực tiếp")).toBeTruthy();
  });
});
