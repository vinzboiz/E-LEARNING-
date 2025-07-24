import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AuthService } from "../../services/auth.service";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigation = useNavigation<NavigationProp>();

  const handleSendOTP = async () => {
    if (!name || !email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tên, email và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const res = await AuthService.sendOTP(name, email, password);
      Alert.alert("Thông báo", res.message || "OTP đã được gửi tới email");
      
      // Chuyển sang màn hình OTP để xác thực
      navigation.navigate("OTP", { name, email, password });
    } catch (error: any) {
      console.log("Send OTP error:", error.response?.data || error.message || error);
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể gửi OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
      <TextInput
        placeholder="Tên đầy đủ"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button
        title={loading ? "Đang gửi OTP..." : "Đăng ký"}
        onPress={handleSendOTP}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
