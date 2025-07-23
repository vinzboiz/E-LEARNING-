import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { UserService } from "../../services/user.service";
import { CourseService } from "../../services/course.service";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AddCourse"
>;

interface Teacher {
  user_id: number;
  name: string;
  email: string;
}

interface Schedule {
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  note: string;
}

export default function AddCourseScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");

  const [subjectId, setSubjectId] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [numOfPeriods, setNumOfPeriods] = useState("");

  // Danh sách lịch học
  const [schedules, setSchedules] = useState<Schedule[]>([
    { date: "", start_time: "", end_time: "", room: "", note: "" },
  ]);

  // Load danh sách giảng viên
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const data = await UserService.getAllTeachers();
        setTeachers(data);
      } catch (error: any) {
        Alert.alert("Lỗi", error.message || "Không thể tải danh sách giảng viên");
      }
    };
    fetchTeachers();
  }, []);

  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      { date: "", start_time: "", end_time: "", room: "", note: "" },
    ]);
  };

  const updateScheduleField = (index: number, field: keyof Schedule, value: string) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index][field] = value;
    setSchedules(updatedSchedules);
  };

  const handleAdd = async () => {
    if (!subjectId || !semester || !year || !price || !numOfPeriods || !selectedTeacher) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const totalPeriods = Number(numOfPeriods);
    if (isNaN(totalPeriods) || totalPeriods <= 0) {
      Alert.alert("Thông báo", "Số buổi học phải >= 1");
      return;
    }

    // Kiểm tra schedules
    if (schedules.some((sch) => !sch.date || !sch.start_time || !sch.end_time)) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin cho các lịch học");
      return;
    }

    try {
      const courseData = {
        subject_id: Number(subjectId),
        user_id: Number(selectedTeacher),
        semester,
        year: Number(year),
        price: Number(price),
        numofperiods: totalPeriods,
        schedules,
      };

      await CourseService.create(courseData);
      Alert.alert("Thành công", "Tạo khóa học thành công!");
      navigation.navigate("CourseList");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tạo khóa học");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Course</Text>

      <TextInput
        placeholder="Mã môn học (subject_id)"
        style={styles.input}
        value={subjectId}
        onChangeText={setSubjectId}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Học kỳ (VD: HK1, HK2)"
        style={styles.input}
        value={semester}
        onChangeText={setSemester}
      />

      <TextInput
        placeholder="Năm học (VD: 2025)"
        style={styles.input}
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />

      <TextInput
        placeholder="Giá khóa học (VNĐ)"
        style={styles.input}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        placeholder="Số buổi học (bắt buộc)"
        style={[styles.input, { borderColor: "#f00", borderWidth: 2 }]}
        keyboardType="numeric"
        value={numOfPeriods}
        onChangeText={setNumOfPeriods}
      />

      <Text style={styles.label}>Chọn giảng viên:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedTeacher}
          onValueChange={(itemValue) => setSelectedTeacher(itemValue)}
        >
          <Picker.Item label="-- Chọn giảng viên --" value="" />
          {teachers.map((teacher) => (
            <Picker.Item
              key={teacher.user_id}
              label={teacher.name}
              value={teacher.user_id.toString()}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Danh sách lịch học:</Text>
      {schedules.map((sch, idx) => (
        <View key={idx} style={styles.scheduleBlock}>
          <TextInput
            placeholder="Ngày học (YYYY-MM-DD)"
            style={styles.input}
            value={sch.date}
            onChangeText={(val) => updateScheduleField(idx, "date", val)}
          />
          <TextInput
            placeholder="Giờ bắt đầu (HH:mm)"
            style={styles.input}
            value={sch.start_time}
            onChangeText={(val) => updateScheduleField(idx, "start_time", val)}
          />
          <TextInput
            placeholder="Giờ kết thúc (HH:mm)"
            style={styles.input}
            value={sch.end_time}
            onChangeText={(val) => updateScheduleField(idx, "end_time", val)}
          />
          <TextInput
            placeholder="Phòng học"
            style={styles.input}
            value={sch.room}
            onChangeText={(val) => updateScheduleField(idx, "room", val)}
          />
          <TextInput
            placeholder="Ghi chú"
            style={styles.input}
            value={sch.note}
            onChangeText={(val) => updateScheduleField(idx, "note", val)}
          />
        </View>
      ))}
      <Button title="Thêm lịch học" onPress={handleAddSchedule} />

      <Button title="Tạo khóa học" onPress={handleAdd} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
  },
  label: { fontSize: 16, marginVertical: 10 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    overflow: "hidden",
  },
  scheduleBlock: {
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});
