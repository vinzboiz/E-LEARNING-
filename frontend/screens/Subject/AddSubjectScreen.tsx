import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function AddSubjectScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !description.trim()) {
      alert("Vui lòng nhập đầy đủ Tên môn học và Mô tả.");
      return;
    }
    alert(`Đã thêm môn học: ${name}\nMô tả: ${description}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm Subject</Text>

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

      <Button title="Thêm" onPress={handleAdd} />
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
    textAlignVertical: "top", // Cho phép gõ từ trên xuống
  },
});
