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
import { useRoute, useNavigation } from "@react-navigation/native";
import { SubmissionService } from "../../services/submission.service";

export default function SubmitAssignmentScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { assignment } = route.params;

  const [content, setContent] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  if (!content && !driveLink) {
    Alert.alert("Thông báo", "Vui lòng nhập nội dung bài làm hoặc link Google Drive!");
    return;
  }

  setLoading(true);
  try {
    const payload = {
      assignment_id: assignment.assignment_id,
      content: content.trim() || undefined,
      drive_link: driveLink.trim() || undefined,
    };

    console.log("[SubmitAssignment] Payload:", payload);

    await SubmissionService.createSubmission(payload);

    Alert.alert("Thành công", `Đã nộp bài cho ${assignment.title}`);
    navigation.goBack();
  } catch (error: any) {
    console.error("[SubmitAssignment] Error:", error);
    Alert.alert("Lỗi", error.message || "Không thể nộp bài.");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nộp bài tập: {assignment.title}</Text>

      <TextInput
        placeholder="Nhập nội dung bài làm..."
        style={[styles.input, { height: 100 }]}
        value={content}
        onChangeText={setContent}
        multiline
      />

      <TextInput
        placeholder="Link bài làm (Google Drive)..."
        style={styles.input}
        value={driveLink}
        onChangeText={setDriveLink}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 10 }} />
      ) : (
        <Button title="Nộp bài" onPress={handleSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
});
