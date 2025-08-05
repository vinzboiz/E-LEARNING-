import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import ProfileScreen from "../../../screens/Auth/ProfileScreen";
import { Alert } from "react-native";

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
  }),
}));

const mockGetMe = jest.fn();
const mockLogout = jest.fn();
const mockLogin = jest.fn();
jest.mock("../../../services/auth.service", () => ({
  AuthService: {
    getMe: (...args: any[]) => mockGetMe(...args),
    logout: (...args: any[]) => mockLogout(...args),
    login: (...args: any[]) => mockLogin(...args),
  },
}));

const mockGetRoleByUserId = jest.fn();
const mockUpdateUser = jest.fn();
jest.mock("../../../services/user.service", () => ({
  UserService: {
    getRoleByUserId: (...args: any[]) => mockGetRoleByUserId(...args),
    update: (...args: any[]) => mockUpdateUser(...args),
  },
}));

jest.spyOn(Alert, "alert");

describe("Kiểm thử màn hình ProfileScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Gọi fetchUserInfo và hiển thị thông tin user + role", async () => {
    mockGetMe.mockResolvedValueOnce({
      user_id: 1,
      name: "Nguyen Van A",
      email: "a@example.com",
    });
    mockGetRoleByUserId.mockResolvedValueOnce({ role: "Admin" });

    const { getByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(mockGetMe).toHaveBeenCalled();
      expect(mockGetRoleByUserId).toHaveBeenCalledWith(1);
      expect(getByText(/Nguyen Van A/i)).toBeTruthy();
      expect(getByText(/📧Email: a@example.com/i)).toBeTruthy();
      expect(getByText(/🎓 Vai trò: Admin/i)).toBeTruthy();
    });
  });

  it("Hiển thị thông báo khi fetchUserInfo thất bại", async () => {
    mockGetMe.mockRejectedValueOnce({});

    render(<ProfileScreen />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Lỗi",
        "Không thể tải thông tin người dùng"
      );
    });
  });

  it("Đăng xuất thành công và điều hướng về Login", async () => {
    mockGetMe.mockResolvedValueOnce({ user_id: 1 });
    mockGetRoleByUserId.mockResolvedValueOnce({ role: "Admin" });

    const { getByText } = render(<ProfileScreen />);
    await waitFor(() => {});

    fireEvent.press(getByText("Đăng xuất"));
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith("Thông báo", "Bạn đã đăng xuất");
      expect(mockNavigate).toHaveBeenCalledWith("Login");
    });
  });

  it("Cập nhật thông tin user thành công", async () => {
    mockGetMe.mockResolvedValueOnce({
      user_id: 1,
      name: "Nguyen Van A",
      email: "a@example.com",
    });
    mockGetRoleByUserId.mockResolvedValueOnce({ role: "Admin" });
    mockUpdateUser.mockResolvedValueOnce({});

    const { getByText } = render(<ProfileScreen />);
    await waitFor(() => {});

    fireEvent.press(getByText("Cập nhật thông tin"));
    fireEvent.press(getByText("Lưu"));

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        "Thành công",
        "Cập nhật thông tin thành công"
      );
    });
  });

  it("Đổi mật khẩu thành công", async () => {
    mockGetMe.mockResolvedValueOnce({
      user_id: 1,
      name: "Nguyen Van A",
      email: "a@example.com",
    });
    mockGetRoleByUserId.mockResolvedValueOnce({ role: "Admin" });
    mockLogin.mockResolvedValueOnce({});
    mockUpdateUser.mockResolvedValueOnce({});

    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);
    await waitFor(() => {});

    fireEvent.press(getByText("Đổi mật khẩu"));
    fireEvent.changeText(
      getByPlaceholderText("Nhập mật khẩu hiện tại"),
      "oldpass"
    );
    fireEvent.changeText(getByPlaceholderText("Nhập mật khẩu mới"), "newpass");
    fireEvent.changeText(
      getByPlaceholderText("Xác nhận mật khẩu mới"),
      "newpass"
    );

    fireEvent.press(getByText("Lưu"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("a@example.com", "oldpass");
      expect(mockUpdateUser).toHaveBeenCalledWith(1, { password: "newpass" });
      expect(Alert.alert).toHaveBeenCalledWith(
        "Thành công",
        "Mật khẩu đã được thay đổi"
      );
    });
  });

  it("Quay lại màn hình trước khi bấm nút Back", async () => {
    mockGetMe.mockResolvedValueOnce({
      user_id: 1,
      name: "Nguyen Van A",
      email: "a@example.com",
    });
    mockGetRoleByUserId.mockResolvedValueOnce({ role: "Admin" });

    const { getByLabelText } = render(<ProfileScreen />);
    await waitFor(() => {});

    const backButton = getByLabelText("back-button");
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
});
