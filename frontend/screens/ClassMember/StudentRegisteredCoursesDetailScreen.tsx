import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "CourseDetail"
>;

export default function CourseDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { course } = route.params; // Nhận thông tin course từ CourseList

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết khóa học</Text>
      <Text style={styles.info}>Môn học: {course.name}</Text>
      <Text style={styles.info}>Học kỳ: {course.semester}</Text>
      <Text style={styles.info}>Năm: {course.year}</Text>
      <Text style={styles.info}>Giá: {course.price} VNĐ</Text>
      <Text style={styles.info}>Số buổi: {course.numOfPeriods}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 8 },
});
