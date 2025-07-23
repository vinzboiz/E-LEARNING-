import React from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LessonDetail"
>;

export default function LessonDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { lesson } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{lesson.title}</Text>
      <Text style={styles.description}>{lesson.description}</Text>
      <Text style={styles.content}>
        {lesson.content || "Chưa có nội dung."}
      </Text>
      {lesson.videoUrl ? (
        <Text style={styles.video}>Video URL: {lesson.videoUrl}</Text>
      ) : null}

      <View style={{ marginTop: 20 }}>
        <Button
          title="Xem bài tập"
          onPress={() =>
            navigation.navigate("AssignmentList", { lessonId: lesson.id })
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, color: "#666", marginBottom: 20 },
  content: { fontSize: 16, lineHeight: 22 },
  video: { fontSize: 14, color: "blue", marginTop: 15 },
});
