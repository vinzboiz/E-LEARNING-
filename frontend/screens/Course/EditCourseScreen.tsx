import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { CourseService } from "../../services/course.service";

export default function EditCourseScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params; // ID khóa học cần sửa

  const [subjectId, setSubjectId] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [numOfPeriods, setNumOfPeriods] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lấy dữ liệu khóa học khi mở màn hình
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await CourseService.getByIdAdmin(id);
        setSubjectId(String(data.subject_id || ""));
        setSemester(data.semester || "");
        setYear(String(data.year || ""));
        setPrice(String(data.price || ""));
        setNumOfPeriods(String(data.numofperiods || ""));
      } catch (error: any) {
        Alert.alert("Lỗi", error.message || "Không thể tải thông tin khóa học.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  // Hàm lưu chỉnh sửa
  const handleEdit = async () => {
    if (!subjectId || !semester || !year || !price || !numOfPeriods) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setSaving(true);
    try {
      const data = {
        subject_id: Number(subjectId),
        semester,
        year: Number(year),
        price: Number(price),
        numofperiods: Number(numOfPeriods),
      };
      await CourseService.update(id, data);
      Alert.alert("Thành công", "Khóa học đã được cập nhật thành công!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Cập nhật khóa học thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải dữ liệu khóa học...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sửa Course</Text>

      <TextInput
        placeholder="Môn học (ID)"
        style={styles.input}
        value={subjectId}
        onChangeText={setSubjectId}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Học kỳ"
        style={styles.input}
        value={semester}
        onChangeText={setSemester}
      />

      <TextInput
        placeholder="Năm học"
        style={styles.input}
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Giá khóa học"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Số buổi học"
        style={styles.input}
        value={numOfPeriods}
        onChangeText={setNumOfPeriods}
        keyboardType="numeric"
      />

      <Button
        title={saving ? "Đang lưu..." : "Lưu"}
        onPress={handleEdit}
        disabled={saving}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
  },
});
