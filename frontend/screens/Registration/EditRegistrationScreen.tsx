import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function EditRegistrationScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { registration } = route.params;

  const [courseId, setCourseId] = useState(registration.courseId || "1");
  const [beginRegister, setBeginRegister] = useState(
    registration.begin_register
  );
  const [endRegister, setEndRegister] = useState(registration.end_register);
  const [tuition, setTuition] = useState(String(registration.tuition));
  const [status, setStatus] = useState(registration.status);
  const [dueStart, setDueStart] = useState(registration.due_date_start);
  const [dueEnd, setDueEnd] = useState(registration.due_date_end);

  // Danh sách khóa học giả lập (sau này sẽ lấy từ API)

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sửa đăng ký khóa học</Text>

      <Text style={styles.label}>Chọn khóa học</Text>

      <Text style={styles.label}>Ngày bắt đầu đăng ký</Text>
      <TextInput
        placeholder="Ngày bắt đầu đăng ký (YYYY-MM-DD)"
        style={styles.input}
        value={beginRegister}
        onChangeText={setBeginRegister}
      />
      <Text style={styles.label}>Ngày kết thúc đăng ký</Text>
      <TextInput
        placeholder="Ngày kết thúc đăng ký (YYYY-MM-DD)"
        style={styles.input}
        value={endRegister}
        onChangeText={setEndRegister}
      />

      <Text style={styles.label}>Ngày bắt đầu đóng học phí</Text>
      <TextInput
        placeholder="Ngày bắt đầu đóng học phí (YYYY-MM-DD)"
        style={styles.input}
        value={dueStart}
        onChangeText={setDueStart}
      />
      <Text style={styles.label}>Ngày kết thúc đóng học phí</Text>
      <TextInput
        placeholder="Ngày kết thúc đóng học phí (YYYY-MM-DD)"
        style={styles.input}
        value={dueEnd}
        onChangeText={setDueEnd}
      />

      <Button title="Lưu thay đổi" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: { fontSize: 16, marginBottom: 5, fontWeight: "600" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
