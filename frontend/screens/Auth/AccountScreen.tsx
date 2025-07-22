import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AccountScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bạn chưa đăng nhập</Text>
      <View style={styles.button}>
        <Button
          title="Đăng Nhập"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Đăng Ký"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 20 },
  button: { marginVertical: 10 },
});
