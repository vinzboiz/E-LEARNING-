import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SubmissionService } from "../../services/submission.service";

export default function GradeSubmissionScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { submission } = route.params;

  const [score, setScore] = useState(submission?.score?.toString() || "");
  const [feedback, setFeedback] = useState(submission?.feedback || "");
  const [loading, setLoading] = useState(false);

  const handleGrade = async () => {
    if (!score) {
      Alert.alert("Lỗi", "Vui lòng nhập điểm!");
      return;
    }

    const parsedScore = parseFloat(score);
    if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      Alert.alert("Lỗi", "Điểm phải nằm trong khoảng 0 - 10.");
      return;
    }

    setLoading(true);
    try {
      await SubmissionService.gradeSubmission(submission.submission_id, {
        score: parsedScore,
        feedback: feedback.trim(),
      });

      Alert.alert(
        "Thành công",
        `Đã chấm điểm cho HS: ${submission.studentName}\nĐiểm: ${parsedScore}\nNhận xét: ${feedback || "Không có"}`
      );
      navigation.goBack();
    } catch (error: any) {
      console.error("[GradeSubmission] Error:", error);
      Alert.alert("Lỗi", error.message || "Không thể chấm điểm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chấm điểm - {submission.studentName}</Text>

      <TextInput
        placeholder="Nhập điểm (0 - 10)"
        style={styles.input}
        keyboardType="numeric"
        value={score}
        onChangeText={setScore}
      />
      <TextInput
        placeholder="Nhận xét"
        style={[styles.input, styles.textArea]}
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Button title="Lưu điểm" onPress={handleGrade} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: { height: 100, textAlignVertical: "top" },
});
