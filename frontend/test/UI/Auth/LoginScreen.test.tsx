import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../../../screens/Auth/LoginScreen";
import { Alert } from "react-native";
import * as nav from "@react-navigation/native";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

const mockLogin = jest.fn();
jest.mock("../../../services/auth.service", () => ({
  AuthService: {
    login: (...args: any[]) => mockLogin(...args),
  },
}));

jest.spyOn(Alert, "alert");

describe("Kiểm thử màn hình LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Hiển thị đầy đủ các thành phần giao diện", () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);
    expect(getByText("Sign in")).toBeTruthy();
    expect(getByPlaceholderText("demo@email.com")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Sign up")).toBeTruthy();
  });

  it("Hiển thị cảnh báo nếu bấm Login mà chưa nhập email/mật khẩu", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Login"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Thông báo",
      "Vui lòng nhập email và mật khẩu"
    );
  });

  it("Có thể bật/tắt hiển thị mật khẩu", () => {
  const { getByPlaceholderText, getByLabelText  } = render(<LoginScreen />);
  const passwordInput = getByPlaceholderText("Enter your password");
  const eyeButton = getByLabelText ("toggle-password");

  expect(passwordInput.props.secureTextEntry).toBe(true);

  fireEvent.press(eyeButton);
  expect(passwordInput.props.secureTextEntry).toBe(false);
});

  it("Gọi API login với thông tin hợp lệ và điều hướng thành công", async () => {
    mockLogin.mockResolvedValueOnce({ message: "Đăng nhập thành công" });

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    fireEvent.changeText(
      getByPlaceholderText("demo@email.com"),
      "test@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "123456"
    );
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "123456");
      expect(Alert.alert).toHaveBeenCalledWith(
        "Thành công",
        "Đăng nhập thành công"
      );
      expect(mockNavigate).toHaveBeenCalledWith("Main");
    });
  });

  it("Chuyển sang màn hình Đăng ký khi bấm Sign up", () => {
    const { getByText } = render(<LoginScreen />);
    fireEvent.press(getByText("Sign up"));
    expect(mockNavigate).toHaveBeenCalledWith("Register");
  });

  it("Quay lại màn hình Main/Account khi bấm nút Back", () => {
  const { getByLabelText  } = render(<LoginScreen />);
  const backButton = getByLabelText ("back-button");

  fireEvent.press(backButton);
  expect(mockNavigate).toHaveBeenCalledWith("Main", { screen: "Account" });
});
});
