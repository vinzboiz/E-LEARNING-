import React, { useState } from "react";
import { View, Text, FlatList, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegistrationList"
>;

interface RegisterCourse {
  id: number;
  registerCourse: number;
  begin_register: string;
  end_register: string;

  course_id: number;
}

export default function RegistrationListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [registerCourses, setRegisterCourses] = useState<RegisterCourse[]>([
    {
      id: 1,
      registerCourse: 1,
      begin_register: "2024-09-01",
      end_register: "2024-09-30",

      course_id: 1,
    },
  ]);

  const handleDelete = (id: number) => {
    setRegisterCourses((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách đăng ký khóa học</Text>
      <Button
        title="Tạo đăng ký"
        onPress={() => navigation.navigate("AddRegistration")}
      />
      <FlatList
        data={registerCourses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.info}>Lịch đăng ký {item.registerCourse}</Text>
            <Text style={styles.detail}>
              Thời gian đăng ký: {item.begin_register} - {item.end_register}
            </Text>

            <View style={styles.actionRow}>
              <Button
                title="Chi tiết"
                onPress={() =>
                  navigation.navigate("RegisterCourseDetail", {
                    registerCourse: item,
                  })
                }
              />
              <Button
                title="Sửa"
                onPress={() =>
                  navigation.navigate("EditRegistration", {
                    registration: item,
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
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  info: { fontSize: 16, fontWeight: "bold" },
  detail: { fontSize: 14, color: "#555" },
  status: { fontSize: 14, color: "green" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
