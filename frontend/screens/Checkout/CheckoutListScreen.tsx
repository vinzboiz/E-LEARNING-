import React, { useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";

interface Checkout {
  id: number;
  studentName: string;
  email: string;
  paid: boolean; // true = đã đóng, false = chưa đóng
  pay: number;
}

export default function CheckoutListScreen() {
  const route = useRoute<any>();
  const { courseId } = route.params;

  const [checkouts, setCheckouts] = useState<Checkout[]>([
    {
      id: 1,
      studentName: "Nguyen Van A",
      email: "a@gmail.com",
      paid: true,
      pay: 200000,
    },
    {
      id: 2,
      studentName: "Tran Thi B",
      email: "b@gmail.com",
      paid: false,
      pay: 200000,
    },
  ]);

  const togglePayment = (id: number) => {
    setCheckouts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, paid: !c.paid } : c))
    );
    Alert.alert("Thông báo", "Cập nhật trạng thái thanh toán thành công!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách Checkout - Course: {courseId}</Text>
      <FlatList
        data={checkouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.student}>{item.studentName}</Text>
            <Text>Email: {item.email}</Text>
            <Text style={{ color: item.paid ? "green" : "red" }}>
              Trạng thái: {item.paid ? "Đã đóng" : "Chưa đóng"}
            </Text>
            <Text>Giá: {item.pay} VNĐ</Text>
            <Button
              title={item.paid ? "Đánh dấu chưa đóng" : "Đánh dấu đã đóng"}
              onPress={() => togglePayment(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  student: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
});
