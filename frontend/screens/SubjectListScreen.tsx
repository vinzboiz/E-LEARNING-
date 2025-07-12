import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  fetchSubjects,
  deleteSubject,
  Subject,
} from "../services/subjectService";
import { useIsFocused } from "@react-navigation/native";

export default function SubjectListScreen({ navigation }: any) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải môn học");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await deleteSubject(id);
            loadSubjects(); // reload lại sau khi xóa
          } catch (e) {
            Alert.alert("Lỗi", "Xóa thất bại");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (isFocused) loadSubjects();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Danh sách môn học</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddSubject")}
      >
        <Text style={styles.addButtonText}>+ Thêm môn học</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#4F46E5" />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.subject_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("EditSubject", { id: item.subject_id })
                  }
                >
                  <Text style={styles.edit}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.subject_id)}>
                  <Text style={styles.delete}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  addButton: {
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  name: { fontSize: 18, fontWeight: "bold" },
  desc: { color: "#555" },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginLeft: 10,
  },
  edit: { fontSize: 20, marginHorizontal: 5 },
  delete: { fontSize: 20, marginHorizontal: 5 },
});
