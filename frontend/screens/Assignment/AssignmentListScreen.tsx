import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";

interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  status: string;
}

export default function AssignmentListScreen() {
  const route = useRoute<any>();
  const { lessonId } = route.params;

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 1, title: "Bài tập 1", dueDate: "2024-09-20", status: "Chưa nộp" },
    { id: 2, title: "Bài tập 2", dueDate: "2024-09-25", status: "Đã nộp" },
  ]);

  const handleDelete = (id: number) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Danh sách bài tập - Lesson ID: {lessonId}
      </Text>
      <Button
        title="Thêm bài tập"
        onPress={() => alert("Chức năng thêm bài tập")}
      />

      <FlatList
        data={assignments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.assignmentItem}>
            <TouchableOpacity
              onPress={() => alert(`Chi tiết bài tập: ${item.title}`)}
            >
              <Text style={styles.assignmentTitle}>{item.title}</Text>
              <Text style={styles.assignmentDetail}>
                Hạn nộp: {item.dueDate}
              </Text>
              <Text style={styles.assignmentDetail}>
                Trạng thái: {item.status}
              </Text>
            </TouchableOpacity>
            <View style={styles.actionRow}>
              <Button title="Sửa" onPress={() => alert("Sửa bài tập")} />
              <Button
                title="Xóa"
                color="red"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  assignmentItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  assignmentTitle: { fontSize: 18, fontWeight: "bold" },
  assignmentDetail: { fontSize: 14, color: "#555" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
