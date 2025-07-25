import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ClassMemberService } from "../../services/classmember.service";

export default function StudentRegisteredCoursesScreen() {
  const navigation = useNavigation<any>();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const res = await ClassMemberService.getMyClassMembers();
      setCourses(res.data);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải giỏ môn học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleSave = async () => {
    try {
      const res = await ClassMemberService.saveRegisterCourses();
      Alert.alert("Thông báo", res.message || "Lưu giỏ thành công.");
      fetchMyCourses();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const handlePay = async () => {
    try {
      const res = await ClassMemberService.payTuition();
      Alert.alert("Thông báo", res.message || "Đóng học phí thành công.");
      fetchMyCourses();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải giỏ môn học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ môn học</Text>
      {courses.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Chưa có môn học nào trong giỏ.
        </Text>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.course_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.courseItem}>
              <Text style={styles.courseName}>{item.subject_name}</Text>
              <Text style={styles.courseDetail}>
                Học phí: {item.price.toLocaleString()} VNĐ
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.buttonRow}>
        <Button title="Lưu giỏ" onPress={handleSave} />
        <Button title="Đóng học phí" color="green" onPress={handlePay} />
      </View>
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
  courseName: { fontSize: 18, fontWeight: "bold" },
  courseDetail: { fontSize: 14, color: "#666" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
