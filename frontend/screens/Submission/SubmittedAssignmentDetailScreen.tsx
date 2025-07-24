import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Linking,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

// Định nghĩa type Submission
interface Submission {
  submission_id: number;
  assignment_title: string;
  submitted_at: string;
  score: number | null;
  feedback: string | null;
  content?: string;
  drive_link?: string;
}

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SubmittedAssignmentDetail"
>;

export default function SubmittedAssignmentDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const submission: Submission | undefined = route.params?.submission;

  if (!submission) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: "red", textAlign: "center" }}>
          Không có thông tin bài nộp.
        </Text>
        <Button title="Quay lại" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleOpenDrive = () => {
    if (submission.drive_link) {
      Linking.openURL(submission.drive_link).catch(() => {
        Alert.alert("Lỗi", "Không thể mở link Google Drive.");
      });
    } else {
      Alert.alert("Thông báo", "Không có link bài nộp.");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có";
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết bài nộp</Text>

      <Text style={styles.label}>
        <Text style={styles.bold}>Tiêu đề: </Text>
        {submission.assignment_title || "Không có tiêu đề"}
      </Text>
      <Text style={styles.label}>
        <Text style={styles.bold}>Nộp lúc: </Text>
        {formatDate(submission.submitted_at)}
      </Text>
      <Text style={styles.label}>
        <Text style={styles.bold}>Điểm: </Text>
        {submission.score !== null ? submission.score : "Chưa chấm"}
      </Text>
      <Text style={styles.label}>
        <Text style={styles.bold}>Đánh giá: </Text>
        {submission.feedback || "Chưa nhận xét"}
      </Text>

      <View style={styles.contentBox}>
        <Text style={styles.contentTitle}>Nội dung bài làm:</Text>
        <Text style={styles.contentText}>
          {submission.content?.trim() ? submission.content : "Không có nội dung"}
        </Text>
        {submission.drive_link && (
          <Text style={styles.link} onPress={handleOpenDrive}>
            Mở bài nộp trên Google Drive
          </Text>
        )}
      </View>

      <Button title="Quay lại" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  bold: { fontWeight: "bold" },
  contentBox: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 20,
  },
  contentTitle: { fontWeight: "bold", marginBottom: 5, fontSize: 16 },
  contentText: { fontSize: 14, color: "#333" },
  link: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
  },
});
