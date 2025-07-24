import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { LessonService } from "../../services/lesson.service";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LessonDetail"
>;

export default function LessonDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { lessonId } = route.params;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const data = await LessonService.getLessonById(lessonId);
        setLesson(data);
      } catch (err: any) {
        Alert.alert("Lỗi", err.message || "Không thể tải chi tiết bài học.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  const openPdf = async (fileUrl: string) => {
    try {
      await Linking.openURL(fileUrl);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở file PDF.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải bài học...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy bài học.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.content}>
        {lesson.content || "Chưa có nội dung cho bài học này."}
      </Text>

      {lesson.file && (
        <Button
          title="Mở file PDF"
          onPress={() => openPdf(lesson.file)}
          color="#007BFF"
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Xem bài tập"
          onPress={() =>
            navigation.navigate("AssignmentList", { lessonId: lesson.lesson_id })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  content: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
