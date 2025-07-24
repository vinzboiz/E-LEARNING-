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
import { useNavigation } from "@react-navigation/native";

export default function AddRegistrationScreen() {
  const navigation = useNavigation();
  const [courseId, setCourseId] = useState("");
  const [beginRegister, setBeginRegister] = useState("");
  const [endRegister, setEndRegister] = useState("");
  const [tuition, setTuition] = useState("");
  const [status, setStatus] = useState("Mở");
  const [dueStart, setDueStart] = useState("");
  const [dueEnd, setDueEnd] = useState("");

  const courses = [
    { id: "1", name: "Math" },
    { id: "2", name: "Physics" },
  ];

  const handleAdd = () => {
    if (!courseId || !beginRegister || !endRegister || !tuition) {
      alert("Vui lòng nhập đủ thông tin.");
      return;
    }
    const selectedCourse = courses.find((c) => c.id === courseId)?.name;
    alert(`Đăng ký cho khóa: ${selectedCourse}, Học phí: ${tuition} VNĐ`);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tạo đăng ký khóa học</Text>

      <Text style={styles.label}>Chọn khóa học</Text>
      <View style={styles.pickerWrapper}></View>

      <TextInput
        placeholder="Ngày bắt đầu đăng ký (YYYY-MM-DD)"
        style={styles.input}
        value={beginRegister}
        onChangeText={setBeginRegister}
      />
      <TextInput
        placeholder="Ngày kết thúc đăng ký (YYYY-MM-DD)"
        style={styles.input}
        value={endRegister}
        onChangeText={setEndRegister}
      />

      <TextInput
        placeholder="Ngày bắt đầu đóng học phí (YYYY-MM-DD)"
        style={styles.input}
        value={dueStart}
        onChangeText={setDueStart}
      />
      <TextInput
        placeholder="Ngày kết thúc đóng học phí (YYYY-MM-DD)"
        style={styles.input}
        value={dueEnd}
        onChangeText={setDueEnd}
      />

      <Button title="Tạo đăng ký" onPress={handleAdd} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 5 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
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
