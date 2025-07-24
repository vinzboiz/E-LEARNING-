import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { RegisterCourseService } from "../../services/registercourse.service";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegistrationList"
>;

interface RegisterCourse {
  registercourse_id: number;
  begin_register: string;
  end_register: string;
  due_date_start: string;
  due_date_end: string;
  tuition: number;
  status: string;
  semester: number;
  year: number;
  course_id: number;
  user_id: number;
  user_name: string;  // từ BE
  email: string;      // từ BE
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

export default function RegistrationListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [registerCourses, setRegisterCourses] = useState<RegisterCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm tải dữ liệu từ API
 const fetchRegisterCourses = async () => {
  try {
    setLoading(true);
    const data = await RegisterCourseService.getAll();
    console.log("[DEBUG] Data Register Courses:", data);
    setRegisterCourses(data);
  } catch (err: any) {
    Alert.alert("Lỗi", err.message || "Không thể tải danh sách đăng ký.");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchRegisterCourses();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa đăng ký này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            setRegisterCourses((prev) =>
              prev.filter((r) => r.registercourse_id !== id)
            );
            // TODO: Nếu có API xóa, gọi ở đây
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: RegisterCourse }) => (
    <View style={styles.item}>
      <Text style={styles.info}>
        Đăng ký học kỳ {item.semester}/{item.year}
      </Text>
      <Text style={styles.detail}>
        Người dùng: {item.user_name} ({item.email})
      </Text>
      <Text style={styles.detail}>
        Thời gian đăng ký: {formatDate(item.begin_register)} - {formatDate(item.end_register)}
      </Text>
      <Text style={styles.detail}>
        Trạng thái: {item.status || "Chưa xác định"}
      </Text>

      <View style={styles.actionRow}>
        <Button
          title="Chi tiết"
          onPress={() =>
            navigation.navigate("RegisterCourseDetail", {
              courseId: item.course_id,
            })
          }
        />
        <Button
          title="Sửa"
          onPress={() =>
            navigation.navigate("EditRegistration", { registration: item })
          }
        />
        <Button
          title="Xóa"
          color="red"
          onPress={() => handleDelete(item.registercourse_id)}
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải danh sách đăng ký...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách đăng ký khóa học</Text>
      <Button
        title="Tạo đăng ký"
        onPress={() => navigation.navigate("AddRegistration")}
      />

      {registerCourses.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Chưa có bản ghi đăng ký nào.
        </Text>
      ) : (
        <FlatList
          data={registerCourses}
          keyExtractor={(item, index) =>
            (item?.registercourse_id ?? index).toString()
          }
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  info: { fontSize: 16, fontWeight: "bold" },
  detail: { fontSize: 14, color: "#555", marginTop: 2 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});