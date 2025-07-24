import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "StudentCourseList"
>;

interface Course {
  id: number;
  name: string;
  semester: string;
  year: number;
  price: number;
  numOfPeriods?: number; // Thêm số buổi để hiển thị ở CourseDetail
}

export default function StudentCourseListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [courses] = useState<Course[]>([
    {
      id: 1,
      name: "React Native",
      semester: "HK1",
      year: 2024,
      price: 2000000,
      numOfPeriods: 20,
    },
    {
      id: 2,
      name: "NodeJS",
      semester: "HK1",
      year: 2024,
      price: 1800000,
      numOfPeriods: 15,
    },
    {
      id: 3,
      name: "Machine Learning",
      semester: "HK1",
      year: 2024,
      price: 2500000,
      numOfPeriods: 25,
    },
  ]);

  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const toggleSelectCourse = (id: number) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSaveRegistration = () => {
    if (selectedCourses.length === 0) {
      alert("Vui lòng chọn ít nhất 1 khóa học.");
      return;
    }
    alert(`Bạn đã đăng ký các khóa học có ID: ${selectedCourses.join(", ")}`);
    // Sau này sẽ gọi API để lưu thông tin đăng ký
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách khóa học</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <TouchableOpacity
              style={[
                styles.touchArea,
                selectedCourses.includes(item.id) && styles.selected,
              ]}
              onPress={() => toggleSelectCourse(item.id)}
            >
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.courseDetail}>
                {item.semester} {item.year} | {item.price.toLocaleString()} VNĐ
              </Text>
            </TouchableOpacity>
            <Button
              title="Xem chi tiết"
              onPress={() =>
                navigation.navigate("StudentRegisterCourseDetail", {
                  course: item,
                })
              }
            />
          </View>
        )}
      />
      <Button title="Lưu đăng ký" onPress={handleSaveRegistration} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  courseItem: {
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  touchArea: {
    marginBottom: 10,
  },
  selected: { backgroundColor: "#d1f5d3" },
  courseName: { fontSize: 18, fontWeight: "bold" },
  courseDetail: { fontSize: 14, color: "#666" },
});
