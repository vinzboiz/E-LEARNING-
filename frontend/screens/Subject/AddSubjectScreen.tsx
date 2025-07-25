import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { SubjectService } from "../../services/subject.service";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "AddSubject">;

export default function AddSubjectScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddSubject = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ tên và mô tả môn học.");
      return;
    }

    try {
      setLoading(true);
      await SubjectService.create({
        name: name.trim(),
        description: description.trim(),
      });
      Alert.alert("Thành công", "Môn học đã được tạo thành công!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tạo môn học.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thêm Môn Học</Text>

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

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Button title="Tạo môn học" onPress={handleAddSubject} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top", // để text bắt đầu từ trên
  },
});
