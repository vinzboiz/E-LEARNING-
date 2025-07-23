import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SubjectService } from "../../services/subject.service";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Subject {
  subject_id: number;
  name: string;
}

export default function SubjectListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await SubjectService.getAll();
      console.log("Subjects in screen:", data); // Log dữ liệu lên màn hình
      setSubjects(data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải danh sách môn học.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa môn học này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await SubjectService.delete(id);
            Alert.alert("Thành công", "Môn học đã được xóa.");
            fetchSubjects();
          } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Xóa môn học thất bại.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchSubjects);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải danh sách môn học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách Subject</Text>
      <Button title="Thêm Subject" onPress={() => navigation.navigate("AddSubject")} />
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.subject_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Button
              title="Sửa"
              onPress={() => navigation.navigate("EditSubject", { id: item.subject_id })}
            />
            <Button
              title="Xóa"
              color="red"
              onPress={() => handleDelete(item.subject_id)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
