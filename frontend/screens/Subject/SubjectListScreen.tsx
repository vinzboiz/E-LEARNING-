import React, { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Subject {
  id: number;
  name: string;
}

export default function SubjectListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Math" },
    { id: 2, name: "Physics" },
  ]);

  const handleDelete = (id: number) => {
    setSubjects(subjects.filter((sub) => sub.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách Subject</Text>
      <Button
        title="Thêm Subject"
        onPress={() => navigation.navigate("AddSubject")}
      />
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Button
              title="Sửa"
              onPress={() =>
                navigation.navigate("EditSubject", { id: item.id })
              }
            />
            <Button
              title="Xóa"
              color="red"
              onPress={() => handleDelete(item.id)}
            />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});
