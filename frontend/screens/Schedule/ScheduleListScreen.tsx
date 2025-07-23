import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";
import { CourseScheduleService } from "../../services/courseschedule.service";
import { AuthService } from "../../services/auth.service";

interface Schedule {
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  note: string;
  course_id: number;
  subject_name: string;
}

export default function ScheduleListScreen() {
  const route = useRoute<any>();
  const { courseId } = route.params;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const isFocused = useIsFocused();

  // Lấy role từ AuthService
  const fetchRole = async () => {
    try {
      const me = await AuthService.getMe();
      setRoleId(me.role_id);
    } catch (error) {
      Alert.alert("Lỗi", "Không xác định được role người dùng");
    }
  };

  // Lấy danh sách lịch học
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      let data: any;

      if (roleId === 1) {
        data = await CourseScheduleService.getAllAdmin();
        data = data.data.filter((sch: Schedule) => sch.course_id === courseId);
      } else if (roleId === 3) {
        data = await CourseScheduleService.getByTeacher();
        data = data.data.filter((sch: Schedule) => sch.course_id === courseId);
      } else if (roleId === 2) {
        data = await CourseScheduleService.getByStudent(courseId);
        data = data.data;
      } else {
        throw new Error("Không xác định quyền người dùng");
      }

      setSchedules(data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách lịch học");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa (Admin)
  const handleDelete = async (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa lịch học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await CourseScheduleService.delete(id);
            Alert.alert("Thành công", "Lịch học đã được xóa");
            fetchSchedules();
          } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Xóa lịch học thất bại");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    if (roleId !== null && isFocused) {
      fetchSchedules();
    }
  }, [roleId, isFocused]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải lịch học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách Lịch học</Text>
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.schedule_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>Ngày: {item.date.split("T")[0]}</Text>
            <Text>
              Giờ: {item.start_time} - {item.end_time}
            </Text>
            <Text>Phòng: {item.room}</Text>
            <Text>Ghi chú: {item.note}</Text>
            {roleId === 1 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Button
                  title="Sửa"
                  onPress={() =>
                    navigation.navigate("EditCourseSchedule", {
                      scheduleId: item.schedule_id,
                    })
                  }
                />
                <Button
                  title="Xóa"
                  color="red"
                  onPress={() => handleDelete(item.schedule_id)}
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
  },
  date: { fontSize: 16, fontWeight: "bold" },
});
