import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AssignmentService } from "../../services/assignment.service";

export default function EditAssignmentScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { assignmentId } = route.params || {}; // Nhận assignmentId từ navigation

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  // Hàm load dữ liệu bài tập
  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const data = await AssignmentService.getAssignmentById(assignmentId);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setStartDate(data.due_date_start || "");
      setDueDate(data.due_date_end || "");
      setLink(data.link_drive || "");
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu bài tập.");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi load màn hình
  useEffect(() => {
    if (assignmentId) {
      fetchAssignment();
    } else {
      Alert.alert("Lỗi", "Không tìm thấy ID bài tập.");
      navigation.goBack();
    }
  }, [assignmentId]);

  const handleSave = async () => {
    if (!title || !description || !startDate || !dueDate) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      await AssignmentService.updateAssignment(assignmentId, {
        title: title.trim(),
        description: description.trim(),
        due_date_start: startDate.trim(),
        due_date_end: dueDate.trim(),
        link_drive: link?.trim() || undefined,
      });

      Alert.alert("Thành công", "Cập nhật bài tập thành công.");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể cập nhật bài tập.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa bài tập</Text>

      <TextInput
        placeholder="Tiêu đề bài tập"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Mô tả bài tập"
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        placeholder="Ngày bắt đầu (YYYY-MM-DD)"
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        placeholder="Hạn nộp (YYYY-MM-DD)"
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
      />
      <TextInput
        placeholder="Link nộp bài (Google Drive)"
        style={styles.input}
        value={link}
        onChangeText={setLink}
      />

      <Button title="Lưu thay đổi" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  textArea: { height: 80, textAlignVertical: "top" },
});
