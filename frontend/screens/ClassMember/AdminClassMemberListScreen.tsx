import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ClassMemberService } from "../../services/classmember.service";

export default function AdminClassMemberListScreen() {
  const [classMembers, setClassMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllClassMembers = async () => {
    try {
      setLoading(true);
      const res = await ClassMemberService.getAllClassMembers();
      setClassMembers(res.data || []);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách classmember");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllClassMembers();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách ClassMember (Admin)</Text>
      {classMembers.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Hiện chưa có sinh viên đăng ký môn học nào.
        </Text>
      ) : (
        <FlatList
          data={classMembers}
          keyExtractor={(item, index) => `${item.user_id}-${index}`}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.name}>{item.name} (UserID: {item.user_id})</Text>
              <Text>Môn học: {item.subject_name}</Text>
              <Text>Giá: {item.price.toLocaleString()} VNĐ</Text>
              <Text>Trạng thái: {item.status}</Text>
              <Text>Hạn đóng: {new Date(item.due_date_end).toLocaleDateString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  name: { fontSize: 18, fontWeight: "bold" },
});
