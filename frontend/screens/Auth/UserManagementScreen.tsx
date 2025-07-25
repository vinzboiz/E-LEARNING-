import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { UserService } from "../../services/user.service";

interface User {
  id?: number | string;
  name: string;
  email: string;
  password?: string;
  role: string; // admin | student | teacher
}

export default function UserManagementScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "student" | "teacher">("student");

  // Lấy danh sách user từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAll();

      const formatted = data.map((u: any, index: number) => ({
        id: u.id || u._id || u.user_id || `user-${index}`,
        name: u.name,
        email: u.email,
        role:
          u.role_name?.toLowerCase() ||
          (u.role_id === 1 ? "admin" : u.role_id === 3 ? "teacher" : "student"),
      }));
      setUsers(formatted);
    } catch (error: any) {
      console.log("Error fetchUsers:", error);
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mở modal thêm user
  const openAddUser = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("student");
    setModalVisible(true);
  };

  // Mở modal sửa user
  const openEditUser = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); // Mật khẩu không trả từ API, phải nhập lại
    setRole(user.role as "admin" | "student" | "teacher");
    setModalVisible(true);
  };

  // Lưu user (thêm hoặc cập nhật)
  const saveUser = async () => {
    if (!name || !email || (!isEditing && !password)) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ tên, email và mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const roleMap: Record<"admin" | "student" | "teacher", number> = {
        admin: 1,
        student: 2,
        teacher: 3,
      };

      if (isEditing && selectedUser?.id) {
        // Cập nhật user
        const payload: any = {
          name,
          email,
          role_id: roleMap[role],
        };
        if (password) payload.password = password;

        await UserService.update(Number(selectedUser.id), payload);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, name, email, role } : u
          )
        );
        Alert.alert("Thành công", "Cập nhật người dùng thành công");
      } else {
        // Thêm user mới
        const payload = { name, email, password, role_id: roleMap[role] };
        const newUser = await UserService.create(payload);
        setUsers((prev) => [...prev, newUser]);
        Alert.alert("Thành công", "Thêm người dùng thành công");
      }
      setModalVisible(false);
    } catch (error: any) {
      console.log("Error saveUser:", error);
      Alert.alert("Lỗi", error.message || "Không thể lưu người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Xóa user
  const deleteUser = (id: number | string) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa người dùng này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await UserService.delete(Number(id));
            setUsers((prev) => prev.filter((u) => u.id !== id));
            Alert.alert("Đã xóa", "Người dùng đã bị xóa");
          } catch (error: any) {
            console.log("Error delete:", error);
            Alert.alert("Lỗi", error.message || "Xóa người dùng thất bại");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text>Role: {item.role}</Text>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#6C63FF" }]}
          onPress={() => openEditUser(item)}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "red" }]}
          onPress={() => deleteUser(item.id!)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản Lý Người Dùng</Text>
      <TouchableOpacity style={styles.addButton} onPress={openAddUser}>
        <Text style={styles.addButtonText}>+ Thêm User</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Modal thêm/sửa user */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Sửa User" : "Thêm User"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Tên"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
            <Text style={styles.label}>Role:</Text>
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) =>
                setRole(itemValue as "admin" | "student" | "teacher")
              }
              style={{ marginBottom: 10 }}
            >
              <Picker.Item label="Admin" value="admin" />
              <Picker.Item label="Sinh Viên" value="student" />
              <Picker.Item label="Giảng Viên" value="teacher" />
            </Picker>

            <TouchableOpacity style={styles.saveButton} onPress={saveUser}>
              <Text style={styles.saveText}>
                {isEditing ? "Cập nhật" : "Thêm"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: "#999" }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.saveText}>Hủy</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  userCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  userName: { fontSize: 18, fontWeight: "bold" },
  userEmail: { color: "#666", marginBottom: 5 },
  actionRow: { flexDirection: "row", gap: 10 },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  actionText: { color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
  label: { fontSize: 16, marginBottom: 5 },
});
