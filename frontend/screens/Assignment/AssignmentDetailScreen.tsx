import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AssignmentService } from "../../services/assignment.service";
import { AuthService } from "../../services/auth.service";
import { SubmissionService } from "../../services/submission.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import CSS chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

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

      if (user.role_id !== 2) {
        const res = await SubmissionService.getSubmissionsByAssignment(
          assignment.assignment_id
        );
        setSubmissions(res);
      }
    } catch (error: any) {
      if (error.message && !error.message.includes("quyền")) {
        Alert.alert("Lỗi", error.message || "Không thể tải chi tiết bài tập.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const renderSubmissionItem = ({ item }: { item: Submission }) => (
    <TouchableOpacity
      style={[cardStyles.card, { marginHorizontal: 20, marginVertical: 5 }]}
      onPress={() =>
        navigation.navigate("SubmissionDetail", { submission: item })
      }
    >
      <Text style={textStyles.subjectName}>
        {item.content || "Không có nội dung"}
      </Text>
      <Text style={textStyles.subjectDesc}>
        Nộp lúc: {item.submitted_at || "Chưa có"}
      </Text>
      <Text style={textStyles.subjectDesc}>
        Điểm: {item.score ?? "Chưa chấm"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={layoutStyles.container}>
      <FlatList
        data={roleId !== 2 ? submissions : []}
        keyExtractor={(item) => item.submission_id.toString()}
        renderItem={renderSubmissionItem}
        ListHeaderComponent={
          <>
            {/* Banner */}
            <View style={layoutStyles.bannerWrapper}>
              <Image
                source={Images.TopBanner.assignment}
                style={imageStyles.banner}
                resizeMode="cover"
              />
              <View style={layoutStyles.bannerTextContainer}>
                <Text style={textStyles.bannerTitle}>Chi tiết bài tập</Text>
                <Text style={textStyles.bannerSubtitle}>
                  Thông tin và bài nộp của sinh viên
                </Text>
              </View>
              <TouchableOpacity
                style={buttonStyles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Nội dung Assignment */}
            <View style={[cardStyles.card, { margin: 15 }]}>
              <Text style={textStyles.subjectName}>
                {assignmentDetail?.title || "Không có tiêu đề"}
              </Text>
              <Text style={textStyles.subjectDesc}>
                {assignmentDetail?.description || "Không có mô tả"}
              </Text>
              <Text style={textStyles.subjectDesc}>
                Thời gian: {assignmentDetail?.due_date_start} -{" "}
                {assignmentDetail?.due_date_end}
              </Text>
              {assignmentDetail?.link_drive ? (
                <Text
                  style={[textStyles.subjectDesc, { color: "blue" }]}
                  onPress={() => Linking.openURL(assignmentDetail.link_drive)}
                >
                  Link bài tập: {assignmentDetail.link_drive}
                </Text>
              ) : (
                <Text style={textStyles.subjectDesc}>
                  Link bài tập: Không có
                </Text>
              )}
              <Text style={textStyles.subjectDesc}>
                Trạng thái: {assignmentDetail?.status || "Chưa xác định"}
              </Text>

              {roleId === 2 && assignmentDetail?.status !== "đã hết hạn" && (
                <TouchableOpacity
                  style={[buttonStyles.primary, { marginTop: 10 }]}
                  onPress={() =>
                    navigation.navigate("SubmitAssignmentScreen", {
                      assignment,
                    })
                  }
                >
                  <Text style={buttonStyles.primaryText}>Nộp bài tập</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Danh sách bài nộp */}
            {roleId !== 2 && (
              <Text
                style={[
                  textStyles.listTitle,
                  { marginTop: 10, marginLeft: 20, marginBottom: 10 },
                ]}
              >
                Danh sách bài nộp:
              </Text>
            )}
          </>
        }
        ListFooterComponent={
          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <Image
              source={Images.More.img4}
              style={imageStyles.footerImage}
              resizeMode="contain"
            />
            <Text style={textStyles.footerText}>
              Hãy theo dõi tiến độ bài tập của bạn!
            </Text>
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
    </View>
  );
}
