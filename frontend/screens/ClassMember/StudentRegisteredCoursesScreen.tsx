import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ClassMemberService } from "../../services/classmember.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import CSS chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { cardStyles } from "../../constants/cardStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

export default function StudentRegisteredCoursesScreen() {
  const navigation = useNavigation<any>();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const res = await ClassMemberService.getMyClassMembers();
      setCourses(res.data || []);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải giỏ môn học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleSave = async () => {
    try {
      const res = await ClassMemberService.saveRegisterCourses();
      Alert.alert("Thông báo", res.message || "Lưu giỏ thành công.");
      fetchMyCourses();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const handlePay = async () => {
    try {
      const res = await ClassMemberService.payTuition();
      Alert.alert("Thông báo", res.message || "Đóng học phí thành công.");
      fetchMyCourses();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải giỏ môn học...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.studentRegisterCourse}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Giỏ môn học</Text>
          <Text style={textStyles.bannerSubtitle}>
            Quản lý các môn học bạn đã chọn
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh sách khóa học */}
      {courses.length === 0 ? (
        <View style={layoutStyles.center}>
          <Text style={textStyles.emptyText}>
            Chưa có môn học nào trong giỏ.
          </Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.course_id.toString()}
          renderItem={({ item }) => (
            <View style={cardStyles.card}>
              <Text style={textStyles.subjectName}>
                {item.subject_name || "Môn học"}
              </Text>
              <Text style={textStyles.subjectDesc}>
                Học phí: {item.price?.toLocaleString()} VNĐ
              </Text>
            </View>
          )}
        />
      )}
      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img10}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy hoàn tất đăng ký và thanh toán để bắt đầu học ngay!
        </Text>
      </View>
      {/* Hàng nút hành động */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          style={[buttonStyles.primary, { flex: 1, marginRight: 10 }]}
          onPress={handleSave}
        >
          <Text style={buttonStyles.primaryText}>Lưu giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[buttonStyles.primary, { flex: 1, marginLeft: 10 }]}
          onPress={handlePay}
        >
          <Text style={buttonStyles.primaryText}>Đóng học phí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
