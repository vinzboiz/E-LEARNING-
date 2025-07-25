import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterCourseService } from "../../services/registercourse.service";

interface RegisterTime {
  begin_register: string;
  end_register: string;
  due_date_start: string;
  due_date_end: string;
  year: number;
  semester: number;
}

export default function RegisterTimeScreen() {
  const [registerTimes, setRegisterTimes] = useState<RegisterTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setRole] = useState<number | null>(null);

  const [begin, setBegin] = useState("");
  const [end, setEnd] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTime, setSelectedTime] = useState<RegisterTime | null>(null);

  // Format ngày giống DB (YYYY-MM-DD)
  const formatDate = (dateStr: string) => {
    return dateStr ? dateStr.slice(0, 10) : "";
  };

  // Kiểm tra hết hạn
  const isExpired = (date: string) => new Date(date) < new Date();

  // Lấy role
  useEffect(() => {
    const fetchRole = async () => {
      const savedRole = await AsyncStorage.getItem("role_id");
      setRole(savedRole ? parseInt(savedRole, 10) : null);
    };
    fetchRole();
  }, []);

  // Lấy dữ liệu từ BE
  const fetchRegisterTimes = async () => {
    try {
      setLoading(true);
      const data = await RegisterCourseService.getAll();

      const unique = data.reduce((acc: RegisterTime[], curr: RegisterTime) => {
        const formattedCurr = {
          ...curr,
          begin_register: formatDate(curr.begin_register),
          end_register: formatDate(curr.end_register),
          due_date_start: formatDate(curr.due_date_start),
          due_date_end: formatDate(curr.due_date_end),
        };
        const exists = acc.find(
          (x) =>
            x.begin_register === formattedCurr.begin_register &&
            x.end_register === formattedCurr.end_register
        );
        if (!exists) acc.push(formattedCurr);
        return acc;
      }, []);

      // Sinh viên chỉ xem những khoảng còn hạn
      const filtered =
        role === 2
          ? unique.filter(
              (item: RegisterTime) =>
                !isExpired(item.end_register) || !isExpired(item.due_date_end)
            )
          : unique;

      setRegisterTimes(filtered);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== null) fetchRegisterTimes();
  }, [role]);

  // Mở modal
  const openModal = (editData?: RegisterTime) => {
    if (editData) {
      setBegin(editData.begin_register);
      setEnd(editData.end_register);
      setYear(editData.year.toString());
      setSemester(editData.semester.toString());
      setSelectedTime(editData);
      setIsEditing(true);
    } else {
      setBegin("");
      setEnd("");
      setYear("");
      setSemester("");
      setIsEditing(false);
    }
    setModalVisible(true);
  };

  // Lưu dữ liệu
  const saveRegisterTime = async () => {
    if (!begin || !end || !year || !semester) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      if (isEditing && selectedTime) {
        await RegisterCourseService.updateRegisterTime({
          begin: selectedTime.begin_register,
          end: selectedTime.end_register,
          newBegin: begin,
          newEnd: end,
        });
        Alert.alert("Thành công", "Cập nhật thời gian thành công");
      } else {
        await RegisterCourseService.createForAll({
          begin_register: begin,
          end_register: end,
          year: Number(year),
          semester: Number(semester),
        });
        Alert.alert("Thành công", "Thêm thời gian đăng ký thành công");
      }
      setModalVisible(false);
      fetchRegisterTimes();
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể lưu dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const renderTimeCard = ({ item }: { item: RegisterTime }) => (
    <View style={styles.card}>
      <Text>Ngày bắt đầu: {item.begin_register}</Text>
      <Text>Ngày kết thúc: {item.end_register}</Text>
      <Text>Bắt đầu đóng học phí: {item.due_date_start}</Text>
      <Text>Kết thúc đóng học phí: {item.due_date_end}</Text>
      <Text>Học kỳ: {item.semester}</Text>
      <Text>Năm học: {item.year}</Text>
      {role === 1 && !isExpired(item.end_register) && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => openModal(item)}
        >
          <Text style={styles.buttonText}>Cập nhật</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản Lý Thời Gian Đăng Ký</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : (
        <>
          <FlatList
            data={registerTimes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderTimeCard}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          {role === 1 && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "green" }]}
              onPress={() => openModal()}
            >
              <Text style={styles.buttonText}>+ Tạo Thời Gian Đăng Ký</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {role === 1 && (
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {isEditing ? "Cập nhật" : "Thêm"} thời gian
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Ngày bắt đầu (YYYY-MM-DD)"
                value={begin}
                onChangeText={setBegin}
              />
              <TextInput
                style={styles.input}
                placeholder="Ngày kết thúc (YYYY-MM-DD)"
                value={end}
                onChangeText={setEnd}
              />
              <TextInput
                style={styles.input}
                placeholder="Năm học"
                keyboardType="numeric"
                value={year}
                onChangeText={setYear}
              />
              <TextInput
                style={styles.input}
                placeholder="Học kỳ"
                keyboardType="numeric"
                value={semester}
                onChangeText={setSemester}
              />

              <TouchableOpacity style={styles.saveButton} onPress={saveRegisterTime}>
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: "#999" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.saveButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  button: {
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
});
