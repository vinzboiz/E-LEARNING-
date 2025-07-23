import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SubjectService } from "../../services/subject.service";

export default function EditSubjectScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lấy thông tin môn học khi mở màn
  useEffect(() => {
    (async () => {
      try {
        const subject = await SubjectService.getById(id);
        setName(subject.name || "");
        setDescription(subject.description || "");
      } catch (error: any) {
        Alert.alert("Lỗi", error.message || "Không thể tải thông tin môn học.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleEdit = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ Tên môn học và Mô tả.");
      return;
    }

    setSaving(true);
    try {
      const data = { name, description };
      await SubjectService.update(id, data);
      Alert.alert("Thành công", "Môn học đã được cập nhật thành công!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Cập nhật môn học thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải thông tin môn học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sửa Môn Học</Text>

      <TextInput
        placeholder="Tên môn học"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Mô tả môn học"
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Button
        title={saving ? "Đang lưu..." : "Lưu"}
        onPress={handleEdit}
        disabled={saving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
