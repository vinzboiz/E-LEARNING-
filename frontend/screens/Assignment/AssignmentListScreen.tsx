import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AssignmentService } from "../../services/assignment.service";
import { AuthService } from "../../services/auth.service";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AssignmentList"
>;

interface Assignment {
  assignment_id: number;
  title: string;
  due_date_end: string;
  status: string;
}

export default function AssignmentListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { lessonId } = route.params;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleId, setRoleId] = useState<number | null>(null);

  // Lấy thông tin role của user hiện tại
  const fetchRole = async () => {
    try {
      const user = await AuthService.getMe();
      console.log("User Info (Role):", user);
      setRoleId(user.role_id);
    } catch (error: any) {
      console.error("Error fetching user role:", error);
      Alert.alert("Lỗi", error.message || "Không lấy được thông tin người dùng.");
    }
  };

  // Lấy danh sách bài tập từ API
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      console.log(`[API] Fetching assignments for lessonId: ${lessonId}`);
      const data = await AssignmentService.getAssignmentsByLesson(lessonId);
      console.log("Assignments fetched:", data);
      setAssignments(data || []);
    } catch (error: any) {
      console.error("Error fetching assignments:", error);
      Alert.alert(
        "Lỗi",
        error.response?.data?.error || error.message || "Không thể tải danh sách bài tập."
      );
    } finally {
      setLoading(false);
    }
  };

  // Khi màn hình focus hoặc mở
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await fetchRole();
      await fetchAssignments();
    });
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải danh sách bài tập...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách bài tập - Lesson ID: {lessonId}</Text>

      {/* Chỉ admin (role 1) hoặc giảng viên (role 3) mới thấy nút Thêm */}
      {(roleId === 1 || roleId === 3) && (
        <Button
          title="Thêm bài tập"
          onPress={() => navigation.navigate("AddAssignmentScreen", { lessonId })}
        />
      )}

      {assignments.length === 0 ? (
        <Text style={{ marginTop: 20, textAlign: "center", color: "#555" }}>
          Không có bài tập nào cho bài học này.
        </Text>
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.assignment_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.assignmentItem}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AssignmentDetail", { assignment: item })
                }
              >
                <Text style={styles.assignmentTitle}>{item.title}</Text>
                <Text style={styles.assignmentDetail}>
                  Hạn nộp: {item.due_date_end || "Không có thông tin"}
                </Text>
                <Text style={styles.assignmentDetail}>
                  Trạng thái: {item.status || "Không xác định"}
                </Text>
              </TouchableOpacity>

              {/* Chỉ admin hoặc giảng viên mới thấy nút Sửa và Xóa */}
              {(roleId === 1 || roleId === 3) && (
                <View style={styles.actionRow}>
                  <Button
                    title="Sửa"
                    color="orange"
                    onPress={() =>
                      navigation.navigate("EditAssignmentScreen", {
                        assignmentId: item.assignment_id, // chỉ gửi ID
                      })
                    }
                  />

                  <Button
                    title="Xóa"
                    color="red"
                    onPress={() => handleDelete(item.assignment_id)}
                  />
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );

  // Xóa bài tập
  async function handleDelete(id: number) {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa bài tập này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await AssignmentService.deleteAssignment(id);
            setAssignments((prev) => prev.filter((a) => a.assignment_id !== id));
            Alert.alert("Thành công", "Đã xóa bài tập.");
          } catch (error: any) {
            console.error("Error deleting assignment:", error);
            Alert.alert("Lỗi", error.message || "Không thể xóa bài tập.");
          }
        },
      },
    ]);
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  assignmentItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  assignmentTitle: { fontSize: 18, fontWeight: "bold" },
  assignmentDetail: { fontSize: 14, color: "#555" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
