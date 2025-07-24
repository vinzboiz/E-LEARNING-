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

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SubmissionDetail"
>;

export default function SubmissionDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { submission } = route.params;

  const handleOpenDriveLink = () => {
    if (submission.drive_link) {
      Linking.openURL(submission.drive_link).catch(() =>
        Alert.alert("Lỗi", "Không thể mở link Google Drive.")
      );
    } else {
      Alert.alert("Thông báo", "Không có link bài nộp.");
    }
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "Chưa có";
    const d = new Date(dateTime);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết bài nộp</Text>

      <Text style={styles.label}>
        Tên học sinh: {submission.student_name || "Không rõ"}
      </Text>
      <Text style={styles.label}>
        Nộp lúc: {formatDateTime(submission.submitted_at)}
      </Text>
      <Text style={styles.label}>
        Điểm: {submission.score != null ? submission.score : "Chưa chấm"}
      </Text>
      <Text style={styles.label}>
        Đánh giá: {submission.feedback || "Chưa nhận xét"}
      </Text>

      <View style={styles.contentBox}>
        <Text style={styles.content}>Nội dung bài làm:</Text>
        <Text>{submission.content || "Không có nội dung"}</Text>
        {submission.drive_link && (
          <Text style={styles.link} onPress={handleOpenDriveLink}>
            Link bài nộp (Google Drive)
          </Text>
        )}
      </View>

      <Button
        title="Chấm điểm"
        onPress={() =>
          navigation.navigate("GradeSubmissionScreen", { submission })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  contentBox: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    marginBottom: 20,
  },
  content: { fontWeight: "bold", marginBottom: 5 },
  link: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
  },
});
