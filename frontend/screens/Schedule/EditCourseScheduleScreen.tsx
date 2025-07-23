import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CourseScheduleService } from "../../services/courseschedule.service";

interface Schedule {
  schedule_id: number;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  note?: string;
  course_id: number;
}

export default function EditCourseScheduleScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { courseId } = route.params;
  const { scheduleId } = route.params;
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  // Load lịch học từ BE
  // const fetchSchedules = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await CourseScheduleService.getAllAdmin(); // Admin lấy all
  //     const filtered = res.data.filter((sch: Schedule) => sch.course_id === courseId);

  //     // Format lại date cho dễ đọc
  //     const formatted = filtered.map((sch: Schedule) => ({
  //       ...sch,
  //       date: sch.date.split("T")[0], // YYYY-MM-DD
  //     }));
  //     setSchedules(formatted);
  //   } catch (error: any) {
  //     Alert.alert("Lỗi", error.message || "Không thể tải lịch học");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchSchedule = async () => {
  try {
    setLoading(true);
    const res = await CourseScheduleService.getByIdAdmin(scheduleId); // Lấy 1 lịch học
    const sch = res.data;
    sch.date = sch.date.split("T")[0];
    setSchedules([sch]); // Dùng mảng 1 phần tử
  } catch (error: any) {
    Alert.alert("Lỗi", error.message || "Không thể tải lịch học");
  } finally {
    setLoading(false);
  }
};

  // useEffect(() => {
  //   fetchSchedules();
  // }, [courseId]);
  useEffect(() => {
  fetchSchedule();
}, [scheduleId]);


  const handleChange = (index: number, field: keyof Schedule, value: string) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  // Lưu 1 lịch học riêng lẻ
  const handleSaveOne = async (schedule: Schedule) => {
    try {
      if (!schedule.date || !schedule.start_time || !schedule.end_time || !schedule.room) {
        Alert.alert("Thông báo", `Vui lòng nhập đầy đủ thông tin cho lịch ID ${schedule.schedule_id}`);
        return;
      }
      await CourseScheduleService.update(schedule.schedule_id, {
        room: schedule.room,
        date: schedule.date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        note: schedule.note || "",
        course_id: schedule.course_id,
      });
      Alert.alert("Thành công", `Cập nhật lịch ID ${schedule.schedule_id} thành công!`);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật lịch học");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải dữ liệu lịch học...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa lịch học cho Course ID: {courseId}</Text>
      {schedules.map((schedule, index) => (
        <View key={schedule.schedule_id} style={styles.scheduleBlock}>
          <Text style={styles.scheduleTitle}>Lịch #{index + 1}</Text>
          <TextInput
            placeholder="Ngày (YYYY-MM-DD)"
            style={styles.input}
            value={schedule.date}
            onChangeText={(text) => handleChange(index, "date", text)}
          />
          <TextInput
            placeholder="Giờ bắt đầu (HH:MM)"
            style={styles.input}
            value={schedule.start_time}
            onChangeText={(text) => handleChange(index, "start_time", text)}
          />
          <TextInput
            placeholder="Giờ kết thúc (HH:MM)"
            style={styles.input}
            value={schedule.end_time}
            onChangeText={(text) => handleChange(index, "end_time", text)}
          />
          <TextInput
            placeholder="Phòng học"
            style={styles.input}
            value={schedule.room}
            onChangeText={(text) => handleChange(index, "room", text)}
          />
          <TextInput
            placeholder="Ghi chú"
            style={styles.input}
            value={schedule.note || ""}
            onChangeText={(text) => handleChange(index, "note", text)}
          />
          <Button title="Lưu lịch này" onPress={() => handleSaveOne(schedule)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scheduleBlock: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f8f8f8",
  },
  scheduleTitle: { fontSize: 18, marginBottom: 10, fontWeight: "600" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: "#fff" },
});
