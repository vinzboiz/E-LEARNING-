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
import { LessonService } from "../../services/lesson.service";
import { AuthService } from "../../services/auth.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LessonList"
>;

interface Lesson {
  lesson_id: number;
  title: string;
  content?: string;
  file?: string;
}

export default function LessonListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId } = route.params;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleId, setRoleId] = useState<number | null>(null);

  // Hàm lấy token và role từ AuthService
  const fetchUserRole = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Chưa có token. Vui lòng đăng nhập lại.");
      const user = await AuthService.getMe(); // getMe tự động dùng token
      setRoleId(user.role_id);
      return user.role_id;
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không lấy được thông tin người dùng.");
      return null;
    }
  };

  // Lấy danh sách bài học theo role
  const fetchLessons = async () => {
    setLoading(true);
    try {
      const userRole = await fetchUserRole();
      if (!userRole) return;

      let data;
      if (userRole === 1 || userRole === 3) {
        // Admin hoặc Giảng viên
        data = await LessonService.getAllLessons(courseId);
      } else if (userRole === 2) {
        // Sinh viên
        data = await LessonService.getLessonsByStudent();
      } else {
        Alert.alert("Lỗi", "Không xác định được vai trò người dùng.");
        return;
      }
      setLessons(data);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách bài học.");
    } finally {
      setLoading(false);
    }
  };

  // Xóa bài học
  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xoá bài học này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            await LessonService.deleteLesson(id);
            setLessons((prev) => prev.filter((l) => l.lesson_id !== id));
            Alert.alert("Thành công", "Đã xoá bài học.");
          } catch (err: any) {
            Alert.alert("Lỗi", err.message || "Không thể xoá bài học.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải danh sách bài học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Danh sách bài học {courseId ? `- Course ID: ${courseId}` : ""}
      </Text>

      {roleId !== 2 && (
        <Button
          title="Thêm bài học"
          onPress={() => navigation.navigate("AddLesson", { courseId })}
        />
      )}

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.lesson_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.lessonItem}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("LessonDetail", { lessonId: item.lesson_id })
              }
            >
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonDescription}>
                {item.content?.slice(0, 50) || "Không có mô tả"}...
              </Text>
            </TouchableOpacity>
            {roleId !== 2 && (
              <View style={styles.actionRow}>
                <Button
                  title="Sửa"
                  onPress={() =>
                    navigation.navigate("EditLesson", {
                      lessonId: item.lesson_id,
                      courseId,
                    })
                  }
                />
                <Button
                  title="Xoá"
                  color="red"
                  onPress={() => handleDelete(item.lesson_id)}
                />
                {/* Thêm nút xem bài tập */}
          <Button
            title="Xem bài tập"
            color="green"
            onPress={() =>
              navigation.navigate("AssignmentList", { lessonId: item.lesson_id })
            }
          />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  lessonItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  lessonTitle: { fontSize: 18, fontWeight: "bold" },
  lessonDescription: { fontSize: 14, color: "#555" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
