import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ClassMemberService } from "../../services/classmember.service";

// Import CSS chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { cardStyles } from "../../constants/cardStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

export default function StudentCourseListScreen() {
  const navigation = useNavigation<any>();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number[]>([]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await ClassMemberService.getAvailableCourses();

      if (res.message && (!res.data || res.data.length === 0)) {
        Alert.alert("Thông báo", res.message);
        setCourses([]);
        return;
      }

      setCourses(res.data || res);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách khóa học");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const toggleSelectCourse = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleAddCourses = async () => {
    try {
      if (selected.length === 0) {
        Alert.alert(
          "Thông báo",
          "Vui lòng chọn ít nhất 1 môn để thêm vào giỏ."
        );
        return;
      }

      for (const courseId of selected) {
        const result = await ClassMemberService.addCourse(courseId);
        if (result?.message && result.data === null) {
          Alert.alert("Thông báo", result.message);
          return;
        }
      }

      Alert.alert("Thành công", "Đã thêm các môn đã chọn vào giỏ.");
      setSelected([]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
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
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.studentCourse}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Khóa học khả dụng</Text>
          <Text style={textStyles.bannerSubtitle}>
            Chọn khóa học phù hợp để thêm vào giỏ
          </Text>
        </View>
      </View>

      {/* Danh sách khóa học */}
      {courses.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>
            Không có khóa học nào khả dụng.
          </Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.course_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                cardStyles.card,
                selected.includes(item.course_id) && {
                  backgroundColor: "#d1f5d3",
                },
              ]}
              onPress={() => toggleSelectCourse(item.course_id)}
            >
              <Text style={textStyles.subjectName}>
                {item.name || item.subject_name}
              </Text>
              <Text style={textStyles.subjectDesc}>
                Học phí: {item.price?.toLocaleString()} VNĐ
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img9}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy chọn khóa học để bắt đầu hành trình của bạn!
        </Text>
      </View>
      {/* Button thêm vào giỏ */}
      <TouchableOpacity
        style={[buttonStyles.primary, { marginTop: 20 }]}
        onPress={handleAddCourses}
      >
        <Text style={buttonStyles.primaryText}>Thêm vào giỏ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[buttonStyles.primary, { marginTop: 10 }]}
        onPress={() => navigation.navigate("StudentRegisteredCourses")}
      >
        <Text style={buttonStyles.primaryText}>Xem giỏ môn học</Text>
      </TouchableOpacity>
    </View>
  );
}
