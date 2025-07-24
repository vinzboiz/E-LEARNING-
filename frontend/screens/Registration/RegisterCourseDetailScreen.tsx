import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { RegisterCourseService } from "../../services/registercourse.service";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegisterCourseDetail"
>;

export default function RegisterCourseDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { courseId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [registerCourse, setRegisterCourse] = useState<any>(null);

  const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

  // Lấy chi tiết đăng ký học phần
  const fetchRegisterCourse = async () => {
    try {
      setLoading(true);
      const data = await RegisterCourseService.getMyRegisterCourse();
      if (courseId) {
        const found = data.find((c: any) => c.course_id === courseId);
        setRegisterCourse(found || null);
      } else {
        setRegisterCourse(data[0] || null);
      }
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải chi tiết đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisterCourse();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!registerCourse) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: "red" }}>
          Không tìm thấy đăng ký học phần.
        </Text>
        <Button title="Quay lại" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết đăng ký khóa học</Text>

      {/* Hiển thị tên và email */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Người dùng:</Text>
        <Text style={styles.value}>{registerCourse.user_name}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{registerCourse.email}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Thời gian tạo:</Text>
        <Text style={styles.value}>{formatDate(registerCourse.create_at)}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Thời gian đăng ký:</Text>
        <Text style={styles.value}>
          {formatDate(registerCourse.begin_register)} - {formatDate(registerCourse.end_register)}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Thời gian đóng học phí:</Text>
        <Text style={styles.value}>
          {formatDate(registerCourse.due_date_start)} - {formatDate(registerCourse.due_date_end)}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Học kì:</Text>
        <Text style={styles.value}>{registerCourse.semester}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Năm học:</Text>
        <Text style={styles.value}>{registerCourse.year}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Học phí:</Text>
        <Text style={styles.value}>
          {registerCourse.tuition?.toLocaleString() || 0} VNĐ
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Trạng thái:</Text>
        <Text
          style={[
            styles.value,
            { color: registerCourse.status === "Mở" ? "green" : "red" },
          ]}
        >
          {registerCourse.status}
        </Text>
      </View>

      <Button
        title="Xem danh sách Checkout"
        onPress={() =>
          navigation.navigate("CheckoutList", {
            courseId: registerCourse.course_id,
          })
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  infoBox: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 16, color: "#333" },
});