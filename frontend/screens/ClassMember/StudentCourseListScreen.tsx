import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ClassMemberService } from "../../services/classmember.service";

export default function StudentCourseListScreen() {
  const navigation = useNavigation<any>();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);

  const fetchCourses = async () => {
  try {
    setLoading(true);
    const res = await ClassMemberService.getAvailableCourses();

    // Nếu BE trả về message cảnh báo
    if (res.message && (!res.data || res.data.length === 0)) {
      Alert.alert("Thông báo", res.message);
      setCourses([]);
      return;
    }

    setCourses(res.data || res); // fallback nếu BE không có 'data'
  } catch (err: any) {
    Alert.alert("Lỗi", err.message || "Không thể tải danh sách khóa học");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleSelectCourse = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleAddCourses = async () => {
  try {
    if (selected.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất 1 môn để thêm vào giỏ.");
      return;
    }

    for (const courseId of selected) {
      const result = await ClassMemberService.addCourse(courseId);
      if (result?.message && result.data === null) {
        Alert.alert("Thông báo", result.message);
        return; // Dừng luôn nếu BE từ chối
      }
    }

    Alert.alert("Thành công", "Đã thêm các môn đã chọn vào giỏ.");
    setSelected([]);
  } catch (error: any) {
    Alert.alert("Lỗi", error.message);
  }
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải danh sách khóa học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách khóa học khả dụng</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.course_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.courseItem,
              selected.includes(item.course_id) && styles.selected,
            ]}
            onPress={() => toggleSelectCourse(item.course_id)}
          >
            <Text style={styles.courseName}>{item.name || item.subject_name}</Text>
            <Text style={styles.courseDetail}>
              Học phí: {item.price?.toLocaleString()} VNĐ
            </Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Thêm vào giỏ" onPress={handleAddCourses} />
      <View style={{ height: 10 }} />
      <Button
        title="Xem giỏ môn học"
        onPress={() => navigation.navigate("StudentRegisteredCourses")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  courseItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  selected: { backgroundColor: "#d1f5d3" },
  courseName: { fontSize: 18, fontWeight: "bold" },
  courseDetail: { fontSize: 14, color: "#666" },
});
