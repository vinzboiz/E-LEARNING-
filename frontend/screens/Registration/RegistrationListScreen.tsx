import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { RegisterCourseService } from "../../services/registercourse.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import styles
import { colors } from "../../constants/colors";
import { textStyles } from "../../constants/textStyles";
import { layoutStyles } from "../../constants/layoutStyles";
import { cardStyles } from "../../constants/cardStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegistrationList"
>;

interface RegisterCourse {
  registercourse_id: number;
  begin_register: string;
  end_register: string;
  due_date_start: string;
  due_date_end: string;
  tuition: number;
  status: string;
  semester: number;
  year: number;
  course_id: number;
  user_id: number;
  user_name: string;
  email: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

export default function RegistrationListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [registerCourses, setRegisterCourses] = useState<RegisterCourse[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu từ API
  const fetchRegisterCourses = async () => {
    try {
      setLoading(true);
      const data = await RegisterCourseService.getAll();
      setRegisterCourses(data);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tải danh sách đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisterCourses();
  }, []);

  const renderItem = ({ item }: { item: RegisterCourse }) => (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() =>
        navigation.navigate("RegisterCourseDetail", {
          courseId: item.course_id,
        })
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={textStyles.subjectName}>
          Đăng ký học kỳ {item.semester}/{item.year}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Người dùng: {item.user_name} ({item.email})
        </Text>
        <Text style={textStyles.subjectDesc}>
          Thời gian đăng ký: {formatDate(item.begin_register)} -{" "}
          {formatDate(item.end_register)}
        </Text>
        <Text style={[textStyles.subjectDesc, { color: colors.primary }]}>
          Trạng thái: {item.status || "Chưa xác định"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải danh sách đăng ký...</Text>
      </View>
    );
  }

  return (
    <View style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.registration}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Đăng ký</Text>
          <Text style={textStyles.bannerSubtitle}>
            Quản lý danh sách đăng ký khóa học của bạn
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh sách */}
      <Text style={textStyles.listTitle}>Danh sách đăng ký</Text>
      {registerCourses.length === 0 ? (
        <View style={layoutStyles.center}>
          <Image
            source={Images.Common.nothing}
            style={imageStyles.emptyImage}
            resizeMode="contain"
          />
          <Text style={textStyles.emptyText}>Chưa có bản ghi đăng ký nào.</Text>
        </View>
      ) : (
        <FlatList
          data={registerCourses}
          keyExtractor={(item, index) =>
            (item?.registercourse_id ?? index).toString()
          }
          renderItem={renderItem}
          ListFooterComponent={
            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Image
                source={Images.More.img8}
                style={imageStyles.footerImage}
                resizeMode="contain"
              />
              <Text style={textStyles.footerText}>
                Tiếp tục hành trình của bạn!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
