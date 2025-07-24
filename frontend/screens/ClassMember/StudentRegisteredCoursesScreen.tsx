import React, { useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function StudentRegisteredCoursesScreen() {
  const navigation = useNavigation<any>();
  const [registeredCourses, setRegisteredCourses] = useState([
    { id: 1, name: "React Native", price: 2000000 },
    { id: 2, name: "NodeJS", price: 1800000 },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Khóa học đã đăng ký</Text>
      <FlatList
        data={registeredCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <Text style={styles.courseName}>{item.name}</Text>
            <Text style={styles.courseDetail}>Học phí: {item.price} VNĐ</Text>
          </View>
        )}
      />
      <View style={styles.buttonRow}>
        <Button
          title="Đăng ký khóa học"
          onPress={() => navigation.navigate("StudentCourseList")}
        />
        <Button
          title="Đóng tiền"
          color="green"
          onPress={() => navigation.navigate("StudentCheckout")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  courseItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  courseName: { fontSize: 18, fontWeight: "bold" },
  courseDetail: { fontSize: 14, color: "#666" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
