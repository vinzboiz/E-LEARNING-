import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen({ route }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { user: userData } = route.params;
  const [user, setUser] = useState<any>(userData);
  const [roleName, setRoleName] = useState<string>("Chưa có");
  const [loading, setLoading] = useState(false);

  // Lấy role của user
  const fetchRoleName = async (userId: number) => {
    try {
      const roleData = await UserService.getRoleByUserId(userId);
      console.log("[DEBUG] Role Data:", roleData);

      // Kiểm tra key trả về
      if (roleData?.role) {
        setRoleName(roleData.role);
      } else if (roleData?.name) {
        setRoleName(roleData.name);
      } else {
        setRoleName("Không xác định");
      }
    } catch (error: any) {
      console.log("Error getRoleByUserId:", error);
      setRoleName("Không xác định");
    }
  };

  // Lấy thông tin user mới nhất từ server
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const freshUser = await UserService.getById(user.user_id);
      setUser(freshUser);

      // Gọi role
      await fetchRoleName(freshUser.user_id);
    } catch (error: any) {
      console.log("Error fetch user:", error);
      Alert.alert("Lỗi", error.message || "Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchUserInfo();
    }
  }, [user?.user_id]);

  const handleUpdate = () => {
    Alert.alert("Thông báo", "Chức năng cập nhật đang được phát triển!");
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      Alert.alert("Thông báo", "Bạn đã đăng xuất");
      setUser(null);
      navigation.navigate("Login");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Lỗi", "Không thể đăng xuất");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.avatar}
        source={{
          uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.name || "User"
          )}&background=6C63FF&color=fff&size=128`,
        }}
      />
      <Text style={styles.name}>{user?.name || "No Name"}</Text>
      <Text style={styles.info}>Email: {user?.email || "No Email"}</Text>
      <Text style={styles.info}>Vai trò: {roleName}</Text>

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateText}>Cập nhật</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  updateButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: "#6C63FF",
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: "#FF4D4D",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "80%",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  updateText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
