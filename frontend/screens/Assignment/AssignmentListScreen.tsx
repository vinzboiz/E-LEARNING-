import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AssignmentService } from "../../services/assignment.service";
import { AuthService } from "../../services/auth.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import style chung
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "AssignmentList"
>;

interface Assignment {
  assignment_id: number;
  title: string;
  due_date_end: string;
  status: string;
}

export default function AssignmentListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { lessonId } = route.params;

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleId, setRoleId] = useState<number | null>(null);

  // Lấy thông tin role
  const fetchRole = async () => {
    try {
      const user = await AuthService.getMe();
      setRoleId(user.role_id);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.message || "Không lấy được thông tin người dùng."
      );
    }
  };

  // Lấy danh sách bài tập
  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await AssignmentService.getAssignmentsByLesson(lessonId);
      setAssignments(data || []);
    } catch (error: any) {
      Alert.alert(
        "Lỗi",
        error.response?.data?.error ||
          error.message ||
          "Không thể tải danh sách bài tập."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      await fetchRole();
      await fetchAssignments();
    });
    return unsubscribe;
  }, [navigation]);

  // Xoá bài tập
  const handleDelete = async (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa bài tập này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await AssignmentService.deleteAssignment(id);
            setAssignments((prev) =>
              prev.filter((a) => a.assignment_id !== id)
            );
            Alert.alert("Thành công", "Đã xóa bài tập.");
          } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Không thể xóa bài tập.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách bài tập...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.assignment}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Bài Tập</Text>
          <Text style={textStyles.bannerSubtitle}>
            Danh sách bài tập của bài học {lessonId}
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={textStyles.listTitle}>Danh sách bài tập</Text>

      {/* Nếu không có bài tập */}
      {assignments.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>
            Không có bài tập nào cho bài học này.
          </Text>
        </View>
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.assignment_id.toString()}
          renderItem={({ item }) => (
            <View style={cardStyles.card}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AssignmentDetail", { assignment: item })
                }
                style={{ flex: 1 }}
              >
                <Text style={textStyles.subjectName}>{item.title}</Text>
                <Text style={textStyles.subjectDesc}>
                  Hạn nộp: {item.due_date_end || "Không có thông tin"}
                </Text>
                <Text style={textStyles.subjectDesc}>
                  Trạng thái: {item.status || "Không xác định"}
                </Text>
              </TouchableOpacity>

              {/* Chỉ admin hoặc giáo viên */}
              {(roleId === 1 || roleId === 3) && (
                <View style={cardStyles.cardActions}>
                  <TouchableOpacity
                    style={[
                      buttonStyles.iconBtn,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() =>
                      navigation.navigate("EditAssignmentScreen", {
                        assignmentId: item.assignment_id,
                      })
                    }
                  >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      buttonStyles.iconBtn,
                      { backgroundColor: colors.danger },
                    ]}
                    onPress={() => handleDelete(item.assignment_id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          ListFooterComponent={
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Image
                source={Images.More.img5}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Tiếp tục hoàn thành các bài tập của bạn!
              </Text>
            </View>
          }
        />
      )}

      {/* Nút Thêm bài tập */}
      {(roleId === 1 || roleId === 3) && (
        <TouchableOpacity
          style={buttonStyles.fab}
          onPress={() =>
            navigation.navigate("AddAssignmentScreen", { lessonId })
          }
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Nút xem bài đã nộp cho student */}
      {roleId === 2 && (
        <TouchableOpacity
          style={[
            buttonStyles.fab,
            { bottom: 80, backgroundColor: colors.primary },
          ]}
          onPress={() => navigation.navigate("SubmittedAssignments")}
        >
          <Ionicons name="document-text-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
