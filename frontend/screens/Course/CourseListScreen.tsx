import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CourseService } from "../../services/course.service";
import { AuthService } from "../../services/auth.service";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { searchStyles } from "../../constants/searchStyles";
import { formatPrice } from "../../utils/format";
//assets
import { Images } from "../../constants/images/images";
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CourseList"
>;

interface Course {
  course_id: number;
  subject_name: string;
  semester: string;
  year: number;
  price: number;
  numofperiods: number;
}

export default function CourseListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState<string>("");

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

  const fetchCourses = async () => {
    if (!roleId) return;
    setLoading(true);
    try {
      let data: any[] = [];
      if (roleId === 1) {
        data = await CourseService.getAllAdmin();
      } else if (roleId === 2) {
        data = await CourseService.getCoursesForStudent();
      } else if (roleId === 3) {
        data = await CourseService.getMyCoursesTeacher();
      }
      setCourses(data);
      setFilteredCourses(data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Lấy danh sách khóa học thất bại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  useEffect(() => {
    if (roleId !== null) {
      const unsubscribe = navigation.addListener("focus", fetchCourses);
      return unsubscribe;
    }
  }, [navigation, roleId]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredCourses(courses);
    } else {
      const lower = text.toLowerCase();
      const filtered = courses.filter(
        (c) =>
          c.subject_name.toLowerCase().includes(lower) ||
          c.semester.toLowerCase().includes(lower) ||
          String(c.year).includes(lower)
      );
      setFilteredCourses(filtered);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa khóa học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await CourseService.delete(id);
            Alert.alert("Thành công", "Khóa học đã được xóa.");
            fetchCourses();
          } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Xóa khóa học thất bại.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách khóa học...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.course}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View
          style={[
            layoutStyles.bannerTextContainer,
            { alignItems: "flex-end", left: undefined, right: 25 },
          ]}
        >
          <Text
            style={[
              textStyles.bannerTitle,
              { color: colors.primary, textAlign: "right", marginTop: 7 },
            ]}
          >
            Khóa học
          </Text>
          <Text
            style={[
              textStyles.bannerSubtitle,
              { color: colors.primary, textAlign: "right", marginTop: 25 },
            ]}
          >
            Khám phá và quản lý danh sách các khóa học của bạn
          </Text>
        </View>
      </View>

      <Text style={textStyles.title}>Danh sách khóa học</Text>
      <View style={searchStyles.searchWrapper}>
        <Ionicons
          name="search"
          size={20}
          color={colors.gray}
          style={searchStyles.searchIcon}
        />
        <TextInput
          style={searchStyles.searchInput}
          placeholder="Tìm kiếm khóa học..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Nếu không có khóa học */}
      {filteredCourses.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.TopBanner.course}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>Chưa có khóa học nào!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredCourses}
            keyExtractor={(item) => item.course_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={cardStyles.card}
                onPress={() =>
                  navigation.navigate("CourseDetail", {
                    courseId: item.course_id,
                  })
                }
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.textDark,
                    }}
                  >
                    {item.subject_name.charAt(0).toUpperCase() +
                      item.subject_name.slice(1)}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.textLight }}>
                    Học kỳ: {item.semester} - Năm học: {item.year}
                  </Text>
                  <Text
                    style={{ fontSize: 15, color: "red", fontWeight: "600" }}
                  >
                    {formatPrice(item.price)} VNĐ
                  </Text>
                </View>
                {roleId === 1 && (
                  <View style={cardStyles.cardActions}>
                    <TouchableOpacity
                      style={[
                        buttonStyles.iconBtn,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={() =>
                        navigation.navigate("EditCourse", {
                          id: item.course_id,
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
                      onPress={() => handleDelete(item.course_id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <View
                style={{
                  marginTop: 20,
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <Image
                  source={Images.More.img11}
                  style={imageStyles.footerImage}
                  resizeMode="contain"
                />
                <Text style={textStyles.footerText}>
                  Tiếp tục hành trình của bạn!
                </Text>
                <Text style={textStyles.total}>
                  Tổng số khóa học: {filteredCourses.length}
                </Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </>
      )}

      {roleId === 1 && (
        <TouchableOpacity
          style={buttonStyles.fab}
          onPress={() => navigation.navigate("AddCourse")}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
