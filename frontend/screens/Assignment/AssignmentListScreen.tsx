import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { AssignmentService } from "../../services/assignment.service";
import { AuthService } from "../../services/auth.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Styles
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";
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
  const [filteredAssignments, setFilteredAssignments] = useState<Assignment[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

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

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await AssignmentService.getAssignmentsByLesson(lessonId);
      setAssignments(data || []);
      setFilteredAssignments(data || []);
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

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredAssignments(assignments);
    } else {
      const lowerText = text.toLowerCase();
      setFilteredAssignments(
        assignments.filter((a) => a.title.toLowerCase().includes(lowerText))
      );
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa bài tập này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await AssignmentService.deleteAssignment(id);
            const updated = assignments.filter((a) => a.assignment_id !== id);
            setAssignments(updated);
            setFilteredAssignments(updated);
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
        <View style={[layoutStyles.bannerTextContainer, { left: "50%" }]}>
          <Text style={[textStyles.bannerTitle, { color: colors.primary }]}>
            Bài Tập
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: colors.primary, marginTop: 35 },
            ]}
          >
            Danh sách bài tập của bạn
          </Text>
        </View>
        <TouchableOpacity
          accessibilityLabel={`back`}
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tiêu đề */}
      <Text style={textStyles.listTitle}>Danh sách bài tập </Text>

      {/* Thanh tìm kiếm */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 15,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          paddingHorizontal: 10,
          backgroundColor: "#fff",
        }}
      >
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Tìm kiếm bài tập..."
          value={searchText}
          onChangeText={handleSearch}
          style={{ flex: 1, height: 40 }}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={22} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Danh sách */}
      {filteredAssignments.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>Không tìm thấy bài tập nào.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAssignments}
          keyExtractor={(item) => item.assignment_id.toString()}
          renderItem={({ item }) => (
            <View style={[cardStyles.card, { flexDirection: "row" }]}>
              <TouchableOpacity
                accessibilityLabel={`goAssignmentDetail`}
                onPress={() =>
                  navigation.navigate("AssignmentDetail", { assignment: item })
                }
                style={{ flex: 1 }}
              >
                <Text
                  style={[
                    textStyles.subjectName,
                    { textTransform: "uppercase", fontSize: 18 },
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={[textStyles.subjectDesc, { fontSize: 15 }]}>
                  📅 Hạn nộp: {item.due_date_end || "Không có thông tin"}
                </Text>
                <Text style={[textStyles.subjectDesc, { fontSize: 15 }]}>
                  📌 Trạng thái: {item.status || "Không xác định"}
                </Text>
              </TouchableOpacity>

              {roleId === 3 && (
                <View style={{ justifyContent: "center" }}>
                  <TouchableOpacity
                    accessibilityLabel={`editAssignment`}
                    style={[
                      buttonStyles.iconBtn,
                      { backgroundColor: colors.primary, marginBottom: 6 },
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
                    accessibilityLabel={`deleteAssignment`}
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
        />
      )}

      {/* Nút thêm bài tập */}
      {roleId === 3 && (
        <TouchableOpacity
          accessibilityLabel={`addAssignment`}
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
          accessibilityLabel={`goSubmittedList`}
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
