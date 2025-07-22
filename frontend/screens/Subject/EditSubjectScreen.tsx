import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function EditSubjectScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { id } = route.params;

  // Dữ liệu ban đầu (có thể lấy từ API hoặc props)
  const [name, setName] = useState("Tên môn cũ");
  const [description, setDescription] = useState("Mô tả môn học cũ");

  const handleEdit = () => {
    if (!name.trim() || !description.trim()) {
      alert("Vui lòng nhập đầy đủ Tên môn học và Mô tả.");
      return;
    }
    alert(`Đã sửa môn học (ID: ${id})\nTên: ${name}\nMô tả: ${description}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sửa Subject</Text>

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

      <Button title="Lưu" onPress={handleEdit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
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
