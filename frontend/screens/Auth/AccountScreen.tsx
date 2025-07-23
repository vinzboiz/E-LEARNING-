import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../../services/auth.service";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Kiểm tra token và lấy thông tin người dùng
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await AuthService.getMe();
        console.log("User data:", data);
        setUser(data);
      } catch (error: any) {
        console.log("Lỗi lấy thông tin người dùng:", error.response?.data || error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      Alert.alert("Thông báo", "Bạn đã đăng xuất");
      setUser(null);
      navigation.navigate("Login"); // Chuyển về màn Login sau khi logout
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Lỗi", "Không thể đăng xuất");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Xin chào, {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <View style={styles.button}>
            <Button title="Đăng xuất" onPress={handleLogout} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Bạn chưa đăng nhập</Text>
          <View style={styles.button}>
            <Button title="Đăng Nhập" onPress={() => navigation.navigate("Login")} />
          </View>
          <View style={styles.button}>
            <Button title="Đăng Ký" onPress={() => navigation.navigate("Register")} />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 20, fontWeight: "600" },
  button: { marginVertical: 10, width: 200 },
});
