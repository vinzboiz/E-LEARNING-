import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LessonService } from "../../services/lesson.service";

export default function EditLessonScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { lessonId } = route.params; // Lấy ID bài học từ params

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentFile, setCurrentFile] = useState<string>(""); // file hiện tại từ BE
  const [newPdfFile, setNewPdfFile] = useState<any>(null); // file PDF mới
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lấy dữ liệu bài học khi mở màn
  useEffect(() => {
    async function fetchLesson() {
      try {
        const lesson = await LessonService.getLessonById(lessonId);
        setTitle(lesson.title || "");
        setContent(lesson.content || "");
        setCurrentFile(lesson.file || "");
      } catch (err: any) {
        Alert.alert("Lỗi", err.message || "Không thể tải thông tin bài học.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  // Chọn file PDF mới
  const pickPdfFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      Alert.alert("Thông báo", "Bạn đã hủy chọn file PDF.");
      return;
    }

    // `result` là DocumentPickerResult với thuộc tính `assets`
    const file = result.assets?.[0];
    if (file) {
      setNewPdfFile({
        uri: file.uri,
        name: file.name || "document.pdf",
        type: file.mimeType || "application/pdf",
      });
    } else {
      Alert.alert("Thông báo", "Không tìm thấy file PDF.");
    }
  } catch (error) {
    console.error("Lỗi chọn file PDF:", error);
    Alert.alert("Lỗi", "Không thể chọn file PDF.");
  }
};


  // Hàm cập nhật bài học
  const handleUpdateLesson = async () => {
    if (!title || !content) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    setSaving(true);
    try {
      await LessonService.updateLesson(lessonId, {
        title,
        content,
        file: newPdfFile || undefined, // Nếu không chọn file mới, giữ file cũ
      });
      Alert.alert("Thành công", "Cập nhật bài học thành công.");
      navigation.goBack();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể cập nhật bài học.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải dữ liệu bài học...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa bài học</Text>

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

      <Text style={styles.label}>File PDF hiện tại:</Text>
      {currentFile ? (
        <Text style={styles.fileName}>{currentFile}</Text>
      ) : (
        <Text style={styles.fileName}>Chưa có file PDF</Text>
      )}

      <Button title="Chọn file PDF mới" onPress={pickPdfFile} />
      {newPdfFile && (
        <Text style={styles.fileName}>Đã chọn: {newPdfFile.name}</Text>
      )}

      <Button
        title={saving ? "Đang lưu..." : "Cập nhật bài học"}
        onPress={handleUpdateLesson}
        disabled={saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginVertical: 10 },
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
