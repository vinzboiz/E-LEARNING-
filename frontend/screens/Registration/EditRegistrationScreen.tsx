import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { RegisterCourseService } from "../../services/registercourse.service";

export default function EditRegistrationScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { registration } = route.params;

  const [beginRegister, setBeginRegister] = useState(
    registration.begin_register
  );
  const [endRegister, setEndRegister] = useState(registration.end_register);
  const [dueStart, setDueStart] = useState(registration.due_date_start);
  const [dueEnd, setDueEnd] = useState(registration.due_date_end);

  // Hàm xử lý cập nhật thời gian
  const handleSave = async () => {
    if (!beginRegister || !endRegister || !dueStart || !dueEnd) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const data = {
        begin: registration.begin_register,
        end: registration.end_register,
        newBegin: beginRegister,
        newEnd: endRegister,
      };

      const result = await RegisterCourseService.updateRegisterTime(data);
      Alert.alert("Thành công", result.message || "Cập nhật thành công.");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể cập nhật thời gian.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sửa thời gian đăng ký</Text>

      <Text style={styles.label}>Ngày bắt đầu đăng ký</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={beginRegister}
        onChangeText={setBeginRegister}
      />

      <Text style={styles.label}>Ngày kết thúc đăng ký</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={endRegister}
        onChangeText={setEndRegister}
      />

      <Text style={styles.label}>Ngày bắt đầu đóng học phí</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={dueStart}
        onChangeText={setDueStart}
        editable={false} // không chỉnh sửa trực tiếp vì BE tự tính
      />

      <Text style={styles.label}>Ngày kết thúc đóng học phí</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        value={dueEnd}
        onChangeText={setDueEnd}
        editable={false} // không chỉnh sửa trực tiếp vì BE tự tính
      />

      <Button title="Lưu thay đổi" onPress={handleSave} />
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
