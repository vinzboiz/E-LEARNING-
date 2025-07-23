import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { CourseService } from "../../services/course.service";
import { AuthService } from "../../services/auth.service";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CourseDetail"
>;

interface Schedule {
  schedule_id?: number;
  date: string;
  start_time: string;
  end_time: string;
  room?: string;
  note?: string;
}

interface Course {
  course_id: number;
  subject_name: string;
  semester: string;
  year: number;
  price: number;
  numofperiods: number;
  schedules?: Schedule[];
}

export default function CourseDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<number | null>(null);

  // Lấy thông tin khóa học từ BE
  const fetchCourse = async () => {
    setLoading(true);
    try {
      let data;
      if (role === 1) {
        data = await CourseService.getByIdAdmin(courseId);
      } else if (role === 2) {
        data = await CourseService.getByIdStudent(courseId);
      } else if (role === 3) {
        data = await CourseService.getByIdTeacher(courseId);
      } else {
        throw new Error("Không xác định quyền người dùng.");
      }
      setCourse(data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải chi tiết khóa học.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // Lấy role từ AuthService
  useEffect(() => {
    (async () => {
      try {
        const me = await AuthService.getMe();
        setRole(me.role_id);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể xác định quyền người dùng.");
      }
    })();
  }, []);

  // Khi có role thì fetch dữ liệu khóa học
  useEffect(() => {
    if (role !== null) fetchCourse();
  }, [role]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải chi tiết khóa học...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy thông tin khóa học.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết khóa học</Text>
      <Text style={styles.info}>Môn học: {course.subject_name}</Text>
      <Text style={styles.info}>Học kỳ: {course.semester}</Text>
      <Text style={styles.info}>Năm: {course.year}</Text>
      <Text style={styles.info}>Giá: {course.price.toLocaleString()} VNĐ</Text>
      <Text style={styles.info}>Số buổi: {course.numofperiods}</Text>

      {course.schedules && course.schedules.length > 0 && (
        <>
          <Text style={styles.subtitle}>Lịch học:</Text>
          {course.schedules.map((sch, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text>- Ngày: {sch.date}</Text>
              <Text>
                Giờ: {sch.start_time} - {sch.end_time}
              </Text>
              {sch.room && <Text>Phòng: {sch.room}</Text>}
              {sch.note && <Text>Ghi chú: {sch.note}</Text>}
            </View>
          ))}
        </>
      )}

      <Button
        title="Xem lịch học"
        onPress={() =>
          navigation.navigate("ScheduleList", { courseId: course.course_id })
        }
      />
      <View style={{ marginTop: 10 }}>
        <Button
          title="Xem bài học (Lesson)"
          onPress={() =>
            navigation.navigate("LessonList", { courseId: course.course_id })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 20, fontWeight: "bold", marginTop: 15 },
  info: { fontSize: 16, marginBottom: 8 },
  scheduleItem: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 6,
    marginVertical: 5,
  },
});
