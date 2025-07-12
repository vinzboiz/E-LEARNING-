import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { fetchSubjectById, updateSubject } from "../services/subjectService";

export default function EditSubjectScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchSubjectById(id).then((data) => {
      setName(data.name);
      setDescription(data.description);
    });
  }, [id]);

  const handleUpdate = async () => {
    if (!name) return Alert.alert("Lỗi", "Tên không được bỏ trống");
    try {
      await updateSubject(id, { name, description });
      Alert.alert("Cập nhật thành công");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Lỗi", "Không thể cập nhật");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tên môn học</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: "bold", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4F46E5",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
