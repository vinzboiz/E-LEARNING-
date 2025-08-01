import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ClassMemberService } from "../../services/classmember.service";
import Ionicons from "react-native-vector-icons/Ionicons";

import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { cardStyles } from "../../constants/cardStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { imageStyles } from "../../constants/imageStyles";
import { colors } from "../../constants/colors";
import { Images } from "../../constants/images/images";

export default function StudentRegisteredCoursesScreen() {
  const navigation = useNavigation<any>();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [hasScannedQR, setHasScannedQR] = useState(false);
  const [allPaid, setAllPaid] = useState(false);

  // Lấy danh sách môn học
  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const res = await ClassMemberService.getMyClassMembers();
      const data = res.data || [];

      // Kiểm tra đã thanh toán hết chưa
      const isAllPaid =
        data.length > 0 &&
        data.every((c: any) => c.status?.toLowerCase() === "đã thanh toán");

      if (isAllPaid) {
        setAllPaid(true);
        setCourses([]);
        setTotalPrice(0);
        return;
      }

      setAllPaid(false);
      setCourses(data);

      // Tính tổng tiền
      const total = data.reduce((sum: number, course: any) => {
        const priceNum = parseFloat(course.price) || 0;
        return sum + priceNum;
      }, 0);
      setTotalPrice(total);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải giỏ môn học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  // Lưu giỏ
  const handleSave = async () => {
    try {
      const res = await ClassMemberService.saveRegisterCourses();
      Alert.alert("Thông báo", res.message || "Lưu giỏ thành công.");
      fetchMyCourses();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  // Thanh toán
  const handlePay = async () => {
    if (!hasScannedQR) {
      Alert.alert("Thông báo", "Vui lòng quét mã QR trước khi đóng học phí.");
      return;
    }

    try {
      const res = await ClassMemberService.payTuition();
      Alert.alert("Thông báo", res.message || "Đóng học phí thành công.");
      setHasScannedQR(false);
      fetchMyCourses(); // Sau khi đóng học phí -> load lại
    } catch (error: any) {
      Alert.alert("Lỗi", error.message);
    }
  };

  // Xóa môn học
  const handleRemoveCourse = async (course_id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa môn học này khỏi giỏ?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await ClassMemberService.removeCourse(course_id);
            Alert.alert("Thông báo", res.message || "Đã xóa môn học.");
            fetchMyCourses();
          } catch (err: any) {
            Alert.alert("Lỗi", err.message || "Không thể xóa môn học.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải giỏ môn học...</Text>
      </View>
    );
  }

  // Nếu đã đóng học phí hết
  if (allPaid) {
    return (
      <View style={layoutStyles.center}>
        <Ionicons name="checkmark-circle" size={50} color="green" />
        <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 10 }}>
          🎉 Bạn đã hoàn tất đóng học phí!
        </Text>
        <Text style={{ marginTop: 5 }}>Không còn môn học nào trong giỏ.</Text>
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

      {/* Tổng tiền */}
      {courses.length > 0 && (
        <View
          style={{
            backgroundColor: "#fff8d6",
            padding: 10,
            borderRadius: 8,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: "#ffb300",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            💰 Tổng học phí:{" "}
            <Text style={{ color: "#d32f2f" }}>
              {totalPrice.toLocaleString()} VNĐ
            </Text>
          </Text>
        </View>
      )}

      {/* Danh sách khóa học */}
      <FlatList
        data={courses}
        keyExtractor={(item) => item.course_id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              cardStyles.card,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <View>
              <Text style={textStyles.subjectName}>
                {item.subject_name || "Môn học"}
              </Text>
              <Text style={textStyles.subjectDesc}>
                Học phí: {item.price?.toLocaleString()} VNĐ
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleRemoveCourse(item.course_id)}
              style={{
                padding: 5,
                backgroundColor: "#f44336",
                borderRadius: 5,
                alignSelf: "center",
              }}
            >
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />

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

      {/* Nút hành động */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        {/* Lưu */}
        <TouchableOpacity
          style={[buttonStyles.primary, { flex: 1, marginRight: 5 }]}
          onPress={handleSave}
        >
          <Text style={buttonStyles.primaryText}>Lưu giỏ</Text>
        </TouchableOpacity>

        {/* QR */}
        <TouchableOpacity
          style={[
            buttonStyles.primary,
            { flex: 1, marginHorizontal: 5, backgroundColor: "#ff9800" },
          ]}
          onPress={() => {
            setShowQR(true);
            setHasScannedQR(true);
          }}
        >
          <Text style={buttonStyles.primaryText}>Quét mã QR</Text>
        </TouchableOpacity>

        {/* Thanh toán */}
        <TouchableOpacity
          style={[
            buttonStyles.primary,
            {
              flex: 1,
              marginLeft: 5,
              backgroundColor: hasScannedQR ? colors.primary : "#ccc",
            },
          ]}
          onPress={handlePay}
          disabled={!hasScannedQR}
        >
          <Text style={buttonStyles.primaryText}>Đóng học phí</Text>
        </TouchableOpacity>
      </View>

      {/* Modal QR */}
      <Modal visible={showQR} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}
            >
              Quét mã QR để thanh toán
            </Text>
            <Image
              source={{
                uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=THONG_TIN_THANH_TOAN",
              }}
              style={{ width: 200, height: 200 }}
            />
            <TouchableOpacity
              style={[
                buttonStyles.primary,
                { marginTop: 15, backgroundColor: "#f44336" },
              ]}
              onPress={() => setShowQR(false)}
            >
              <Text style={buttonStyles.primaryText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
