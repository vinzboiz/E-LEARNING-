import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LessonList"
>;

interface Lesson {
  id: number;
  title: string;
  description: string;
}

export default function LessonListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { courseId } = route.params;

  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Lesson 1: Introduction",
      description: "Giới thiệu khóa học",
    },
    {
      id: 2,
      title: "Lesson 2: Basic Concepts",
      description: "Những khái niệm cơ bản",
    },
  ]);

  const handleDelete = (id: number) => {
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Danh sách bài học - Course ID: {courseId}
      </Text>
      <Button
        title="Thêm bài học"
        onPress={() => navigation.navigate("AddLesson", { courseId })}
      />

      <FlatList
        data={lessons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.lessonItem}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("LessonDetail", { lesson: item })
              }
            >
              <Text style={styles.lessonTitle}>{item.title}</Text>
              <Text style={styles.lessonDescription}>{item.description}</Text>
            </TouchableOpacity>
            <View style={styles.actionRow}>
              <Button
                title="Sửa"
                onPress={() =>
                  navigation.navigate("EditLesson", {
                    lessonId: item.id,
                    courseId,
                  })
                }
              />
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
  lessonItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  lessonTitle: { fontSize: 18, fontWeight: "bold" },
  lessonDescription: { fontSize: 14, color: "#555" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
