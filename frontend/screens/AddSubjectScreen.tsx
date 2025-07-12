import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { addSubject } from "../services/subjectService";

export default function AddSubjectScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    if (!name) return Alert.alert("Lỗi", "Tên không được bỏ trống");
    try {
      await addSubject({
        name,
        description,
        created_at: new Date().toISOString(),
      });
      Alert.alert("Thành công", "Đã thêm môn học");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Lỗi", "Không thể thêm môn học");
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

      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Thêm</Text>
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
