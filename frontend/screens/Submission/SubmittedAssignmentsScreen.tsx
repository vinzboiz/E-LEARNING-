import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SubmissionService } from "../../services/submission.service";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SubmittedAssignments"
>;

export interface Submission {
  submission_id: number;
  assignment_title: string;
  submitted_at: string;
  score: number | null;
  feedback: string | null;
}

export default function SubmittedAssignmentsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Hàm lấy danh sách bài nộp của sinh viên hiện tại
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await SubmissionService.getSubmissionsByUser();
      setSubmissions(data || []);
    } catch (err: any) {
      console.error("[SubmittedAssignmentsScreen] Error:", err);
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách bài nộp.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Chưa có";
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải danh sách bài đã nộp...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bài tập đã nộp</Text>
      {submissions.length === 0 ? (
        <Text style={{ textAlign: "center", color: "#555" }}>
          Bạn chưa nộp bài tập nào.
        </Text>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.submission_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate("SubmittedAssignmentDetail", { submission: item })

              }
            >
              <Text style={styles.assignmentTitle}>
                {item.assignment_title || "Không có tiêu đề"}
              </Text>
              <Text style={styles.assignmentDetail}>
                Nộp lúc: {formatDate(item.submitted_at)}
              </Text>
              <Text style={styles.assignmentDetail}>
                Điểm: {item.score !== null ? item.score : "Chưa chấm"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  assignmentTitle: { fontSize: 18, fontWeight: "bold" },
  assignmentDetail: { fontSize: 14, color: "#555" },
});
