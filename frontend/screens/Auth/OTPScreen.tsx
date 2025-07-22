import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

export default function OTPScreen() {
  const [otp, setOtp] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác Thực OTP</Text>
      <TextInput
        placeholder="Nhập OTP"
        style={styles.input}
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Xác nhận" onPress={() => alert(`OTP: ${otp}`)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, marginBottom: 20 },
  input: {
    width: "80%",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
