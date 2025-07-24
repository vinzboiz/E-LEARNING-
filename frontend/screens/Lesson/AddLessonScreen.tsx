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
import * as DocumentPicker from "expo-document-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LessonService } from "../../services/lesson.service";
import { AuthService } from "../../services/auth.service";

export default function AddLessonScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { courseId } = route.params;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [pdfFile, setPdfFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [roleId, setRoleId] = useState<number | null>(null);

  // Lấy role khi mở màn
  const fetchRole = async () => {
    try {
      const user = await AuthService.getMe(); // Lấy thông tin user
      setRoleId(user.role_id);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không lấy được thông tin người dùng.");
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  // Chọn file PDF
  const pickPdfFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    // Kiểm tra nếu user cancel
    if (result.canceled) {
      Alert.alert("Thông báo", "Bạn đã hủy chọn file PDF.");
      return;
    }

    // Lấy file đầu tiên từ assets
    const file = result.assets[0];
    setPdfFile({
      uri: file.uri,
      name: file.name || "document.pdf",
      type: file.mimeType || "application/pdf",
    });
  } catch (error) {
    console.error("Lỗi chọn file PDF:", error);
    Alert.alert("Lỗi", "Không thể chọn file PDF.");
  }
};

  // Thêm bài học
  const handleAddLesson = async () => {
    if (roleId !== 1 && roleId !== 3) {
      Alert.alert("Thông báo", "Bạn không có quyền thêm bài học.");
      return;
    }

    if (!title || !content) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    if (!pdfFile) {
      Alert.alert("Thông báo", "Vui lòng chọn file PDF cho bài học.");
      return;
    }

    setLoading(true);
    try {
      const newLesson = await LessonService.createLesson({
        title,
        content,
        course_id: courseId,
        file: pdfFile,
      });
      console.log("Gửi bài học:", { title, content, courseId, pdfFile });

      Alert.alert("Thành công", `Đã thêm bài học: ${newLesson.title}`);
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể thêm bài học.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thêm bài học</Text>

      <TextInput
        placeholder="Tiêu đề bài học"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Nội dung chi tiết"
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Button title="Chọn file PDF" onPress={pickPdfFile} />
      {pdfFile && <Text style={styles.fileName}>Đã chọn: {pdfFile.name}</Text>}

      <Button
        title={loading ? "Đang thêm..." : "Thêm bài học"}
        onPress={handleAddLesson}
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  fileName: { marginTop: 10, fontSize: 14, color: "green" },
});
