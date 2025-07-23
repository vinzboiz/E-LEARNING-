import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AuthService } from "../../services/auth.service";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type OTPRouteProp = RouteProp<RootStackParamList, "OTP">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OTPScreen() {
  const route = useRoute<OTPRouteProp>();
  const navigation = useNavigation<NavigationProp>();

  const { name, email, password } = route.params; // Lấy params từ RegisterScreen
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Thông báo", "Vui lòng nhập mã OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await AuthService.verifyOTP(name, email, password, otp);
      console.log("Verify OTP response:", res);

      Alert.alert("Thành công", res.message || "Xác thực OTP thành công");
      navigation.navigate("Login"); // Quay về màn Login
    } catch (error: any) {
      console.log("Verify OTP error:", error.response?.data || error.message);
      Alert.alert("Lỗi", error.response?.data?.message || "Xác thực OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác Thực OTP</Text>
      <TextInput
        placeholder="Nhập mã OTP"
        style={styles.input}
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <Button
        title={loading ? "Đang xác thực..." : "Xác nhận"}
        onPress={handleVerifyOTP}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, fontWeight: "600" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
