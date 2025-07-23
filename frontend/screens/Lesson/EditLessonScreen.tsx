import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function AddLessonScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { courseId } = route.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const handleAddLesson = () => {
    if (!title || !description) {
      alert("Vui lòng nhập đầy đủ tiêu đề và mô tả.");
      return;
    }
    alert(`Đã thêm bài học mới cho Course ID: ${courseId}\nTiêu đề: ${title}`);
    navigation.goBack();
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
        placeholder="Mô tả"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        placeholder="Nội dung chi tiết"
        style={[styles.input, styles.textArea]}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <TextInput
        placeholder="Video URL (nếu có)"
        style={styles.input}
        value={videoUrl}
        onChangeText={setVideoUrl}
      />
      <Button title="Thêm bài học" onPress={handleAddLesson} />
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
});
