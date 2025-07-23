import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { CourseService } from "../../services/course.service";
import { AuthService } from "../../services/auth.service";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "CourseList">;

interface Course {
  course_id: number;
  subject_name: string;
  semester: string;
  year: number;
  price: number;
  numofperiods: number;
}

export default function CourseListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<number | null>(null);

  // Lấy role từ token
  const fetchRole = async () => {
    try {
      const user = await AuthService.getMe();
      setRoleId(user.role_id);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không lấy được thông tin người dùng.");
    }
  };

  // Lấy danh sách khóa học theo role
  const fetchCourses = async () => {
    if (!roleId) return;
    setLoading(true);
    try {
      let data = [];
      if (roleId === 1) data = await CourseService.getAllAdmin();
      else if (roleId === 2) data = await CourseService.getAllStudent();
      else if (roleId === 3) data = await CourseService.getMyCoursesTeacher();
      setCourses(data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Lấy danh sách khóa học thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa khóa học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await CourseService.delete(id);
            Alert.alert("Thành công", "Khóa học đã được xóa.");
            fetchCourses();
          } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Xóa khóa học thất bại.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    if (roleId !== null) {
      const unsubscribe = navigation.addListener("focus", fetchCourses);
      return unsubscribe;
    }
  }, [navigation, roleId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải danh sách khóa học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách Khóa học</Text>
      {roleId === 1 && (
        <Button title="Thêm Course" onPress={() => navigation.navigate("AddCourse")} />
      )}

      <FlatList
        data={courses}
        keyExtractor={(item) => item.course_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.courseInfo}>
              <Text style={styles.subject}>{item.subject_name}</Text>
              <Text style={styles.detail}>
                {item.semester} {item.year} | {item.numofperiods} buổi | {item.price} VNĐ
              </Text>
            </View>

            <View style={styles.actionRow}>
              <Button
                title="Xem chi tiết"
                onPress={() =>
                  navigation.navigate("CourseDetail", { courseId: item.course_id })
                }
              />
              {roleId === 1 && (
                <>
                  <Button
                    title="Sửa"
                    onPress={() => navigation.navigate("EditCourse", { id: item.course_id })}
                  />
                  <Button
                    title="Xóa"
                    color="red"
                    onPress={() => handleDelete(item.course_id)}
                  />
                </>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  courseInfo: { marginBottom: 10 },
  subject: { fontSize: 18, fontWeight: "bold" },
  detail: { fontSize: 14, color: "#666" },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 5,
  },
});
