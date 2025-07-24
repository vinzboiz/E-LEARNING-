import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AssignmentService } from "../../services/assignment.service";

export default function AddAssignmentScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { lessonId } = route.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateStart, setDueDateStart] = useState("");
  const [dueDateEnd, setDueDateEnd] = useState("");
  const [linkDrive, setLinkDrive] = useState("");
  const [loading, setLoading] = useState(false);

  // Hàm format ngày về dạng YYYY-MM-DD HH:mm:ss
  const formatDate = (date: string, time: string = "00:00:00") => {
    // Thay "/" bằng "-" để đúng định dạng
    return `${date.trim().replace(/\//g, "-")} ${time}`;
  };

  // Validate định dạng ngày (YYYY-MM-DD)
  const isValidDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date.trim().replace(/\//g, "-"));

  const handleAdd = async () => {
    if (!title || !description || !dueDateStart || !dueDateEnd) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (!isValidDate(dueDateStart) || !isValidDate(dueDateEnd)) {
      Alert.alert("Lỗi", "Ngày không đúng định dạng (YYYY-MM-DD).");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        lesson_id: lessonId,
        title: title.trim(),
        description: description.trim(),
        due_date_start: formatDate(dueDateStart, "00:00:00"),
        due_date_end: formatDate(dueDateEnd, "23:59:59"),
        ...(linkDrive.trim() && { link_drive: linkDrive.trim() }), // chỉ gửi nếu có
      };

      console.log("Add Assignment Payload:", payload);
      await AssignmentService.createAssignment(payload);

      Alert.alert("Thành công", `Đã thêm bài tập cho Lesson ${lessonId}`);
      navigation.goBack();
    } catch (error: any) {
      console.error("Error creating assignment:", error.response?.data || error);
      Alert.alert(
        "Lỗi",
        error.response?.data?.error || error.message || "Không thể thêm bài tập."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm bài tập - Lesson {lessonId}</Text>

      <TextInput
        placeholder="Tiêu đề bài tập"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Mô tả bài tập"
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        placeholder="Ngày bắt đầu (YYYY-MM-DD)"
        style={styles.input}
        value={dueDateStart}
        onChangeText={setDueDateStart}
      />
      <TextInput
        placeholder="Hạn nộp (YYYY-MM-DD)"
        style={styles.input}
        value={dueDateEnd}
        onChangeText={setDueDateEnd}
      />
      <TextInput
        placeholder="Link bài tập (Google Drive)"
        style={styles.input}
        value={linkDrive}
        onChangeText={setLinkDrive}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Button title="Thêm bài tập" onPress={handleAdd} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
