import React from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegisterCourseDetail"
>;

export default function RegisterCourseDetailScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Dữ liệu ảo (không phụ thuộc route.params)
  const registerCourse = {
    regiter_id: "1",
    create_at: "2025-10-12",
    courseName: "Khóa học React Native",
    begin_register: "2024-09-01",
    end_register: "2024-09-30",
    due_date_start: "2024-10-01",
    due_date_end: "2024-12-15",
    tuition: 2000000,
    status: "đang chờ xử lí",
    semester: 1,
    year: 2025,
    course_id: 1,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chi tiết đăng ký khóa học</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Tên khóa học:</Text>
        <Text style={styles.value}>{registerCourse.courseName}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Thời gian tạo:</Text>
        <Text style={styles.value}>{registerCourse.create_at}</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Thời gian đăng ký:</Text>
        <Text style={styles.value}>
          {registerCourse.begin_register} - {registerCourse.end_register}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Thời gian học:</Text>
        <Text style={styles.value}>
          {registerCourse.due_date_start} - {registerCourse.due_date_end}
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
          {registerCourse.tuition.toLocaleString()} VNĐ
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  infoBox: { marginBottom: 10 },
  label: { fontSize: 16, fontWeight: "600" },
  value: { fontSize: 16, color: "#333" },
});
