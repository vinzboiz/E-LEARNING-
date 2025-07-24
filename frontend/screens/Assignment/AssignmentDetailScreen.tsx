import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AssignmentService } from "../../services/assignment.service";
import { AuthService } from "../../services/auth.service";
import { SubmissionService } from "../../services/submission.service";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AssignmentDetail"
>;

interface Submission {
  submission_id: number;
  content: string;
  drive_link: string;
  submitted_at: string;
  score: number | null;
  feedback: string | null;
}

export default function AssignmentDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { assignment } = route.params || {};

  const [roleId, setRoleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignmentDetail, setAssignmentDetail] = useState<any>(assignment);

  const fetchData = async () => {
    if (!assignment || !assignment.assignment_id) {
      Alert.alert("Lỗi", "Không có thông tin bài tập.");
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.getMe();
      setRoleId(user.role_id);

      const detail = await AssignmentService.getAssignmentById(
        assignment.assignment_id
      );
      setAssignmentDetail(detail);

      const res = await SubmissionService.getSubmissionsByAssignment(
        assignment.assignment_id
      );
      console.log("[DEBUG] Submissions:", res);
      setSubmissions(res);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải chi tiết bài tập.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const renderSubmissionItem = ({ item }: { item: Submission }) => (
    <TouchableOpacity
      style={styles.submissionItem}
      onPress={() =>
        navigation.navigate("SubmissionDetail", { submission: item })
      }
    >
      <Text style={styles.studentName}>
        {item.content || "Không có nội dung"}
      </Text>
      <Text style={styles.submissionInfo}>
        Nộp lúc: {item.submitted_at || "Chưa có"}
      </Text>
      <Text style={styles.submissionInfo}>
        Điểm: {item.score ?? "Chưa chấm"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={roleId !== 2 ? submissions : []}
      keyExtractor={(item) => item.submission_id.toString()}
      renderItem={renderSubmissionItem}
      ListHeaderComponent={
        <View style={styles.assignmentBox}>
          <Text style={styles.title}>
            {assignmentDetail?.title || "Không có tiêu đề"}
          </Text>
          <Text style={styles.desc}>
            {assignmentDetail?.description || "Không có mô tả"}
          </Text>
          <Text style={styles.date}>
            Thời gian: {assignmentDetail?.due_date_start} -{" "}
            {assignmentDetail?.due_date_end}
          </Text>
          {assignmentDetail?.link_drive ? (
            <Text
              style={[styles.link, { textDecorationLine: "underline" }]}
              onPress={() => Linking.openURL(assignmentDetail.link_drive)}
            >
              Link bài tập: {assignmentDetail.link_drive}
            </Text>
          ) : (
            <Text style={styles.link}>Link bài tập: Không có</Text>
          )}
          <Text style={styles.status}>
            Trạng thái: {assignmentDetail?.status || "Chưa xác định"}
          </Text>

          {/* Nút nộp bài (student) */}
          {roleId === 2 && (
            <View style={{ marginTop: 15 }}>
              <Button
                title="Nộp bài tập"
                onPress={() =>
                  navigation.navigate("SubmitAssignmentScreen", { assignment })
                }
              />
            </View>
          )}

          {/* Tiêu đề danh sách nộp bài */}
          {roleId !== 2 && (
            <Text style={styles.subTitle}>Danh sách bài nộp:</Text>
          )}
        </View>
      }
      ListEmptyComponent={
        roleId !== 2 ? (
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            Chưa có bài nộp nào.
          </Text>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  assignmentBox: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 5 },
  desc: { fontSize: 16, marginBottom: 5 },
  date: { fontSize: 14, color: "#444", marginBottom: 5 },
  link: { fontSize: 14, color: "blue", marginBottom: 5 },
  status: { fontSize: 14, color: "green" },
  subTitle: { fontSize: 20, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
  submissionItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  studentName: { fontSize: 16, fontWeight: "bold" },
  submissionInfo: { fontSize: 14, color: "#555" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
