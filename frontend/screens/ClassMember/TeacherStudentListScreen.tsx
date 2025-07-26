import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { ClassMemberService } from "../../services/classmember.service";

interface StudentItem {
  user_id: number;
  name: string;
  email: string;
  status: string;
  tuition: number;
}

export default function TeacherStudentListScreen() {
  const route = useRoute<any>();
  const { courseId } = route.params;
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await ClassMemberService.getStudentsByCourse(courseId);
      setStudents(data);
    } catch (err: any) {
      console.error("[TeacherStudentListScreen] Error:", err);
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  const renderItem = ({ item }: { item: StudentItem }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.detail}>Trạng thái: {item.status}</Text>
      <Text style={styles.detail}>Học phí: {item.tuition} đ</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text>Đang tải danh sách sinh viên...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sinh viên</Text>
      {students.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Không có sinh viên nào trong khóa học này.
        </Text>
      ) : (
        <FlatList
          data={students}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#555" },
  detail: { fontSize: 14, color: "#333" },
});
