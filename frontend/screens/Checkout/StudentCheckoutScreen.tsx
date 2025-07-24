import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";

interface RegisteredCourse {
  id: number;
  name: string;
  price: number;
  paid: boolean; // true nếu đã thanh toán
}

export default function StudentCheckoutScreen() {
  const [courses, setCourses] = useState<RegisteredCourse[]>([
    { id: 1, name: "React Native", price: 2000000, paid: false },
    { id: 2, name: "NodeJS", price: 1800000, paid: false },
    { id: 3, name: "Machine Learning", price: 2500000, paid: true },
  ]);

  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelectedCourses((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handlePayment = () => {
    if (selectedCourses.length === 0) {
      alert("Vui lòng chọn ít nhất 1 khóa học để thanh toán.");
      return;
    }

    alert("Thanh toán đang được xử lý qua mã QR.");
  };

  const totalAmount = selectedCourses
    .map((id) => courses.find((c) => c.id === id)?.price || 0)
    .reduce((sum, price) => sum + price, 0);

  const renderItem = ({ item }: { item: RegisteredCourse }) => {
    if (item.paid) {
      return (
        <View style={[styles.courseItem, styles.paidCourse]}>
          <Text style={styles.courseName}>{item.name}</Text>
          <Text style={styles.courseDetail}>
            Học phí: {item.price.toLocaleString()} VNĐ
          </Text>
          <Text style={styles.paidLabel}>Đã thanh toán</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.courseItem,
          selectedCourses.includes(item.id) && styles.selected,
        ]}
        onPress={() => toggleSelect(item.id)}
      >
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.courseDetail}>
          Học phí: {item.price.toLocaleString()} VNĐ
        </Text>
        <Text style={styles.courseDetail}>Trạng thái: Chưa thanh toán</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán khóa học</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      {selectedCourses.length > 0 && (
        <View style={styles.paymentContainer}>
          <Text style={styles.totalText}>
            Tổng tiền: {totalAmount.toLocaleString()} VNĐ
          </Text>
          <Image
            source={{
              uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ThanhToan",
            }}
            style={styles.qrImage}
          />
          <Button title="Xác nhận thanh toán" onPress={handlePayment} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  courseItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  selected: { backgroundColor: "#d1f5d3" },
  paidCourse: { backgroundColor: "#e6e6e6" },
  courseName: { fontSize: 18, fontWeight: "bold" },
  courseDetail: { fontSize: 14, color: "#555" },
  paidLabel: { fontSize: 14, color: "green", marginTop: 5 },
  paymentContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  totalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
});
