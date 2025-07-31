import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import styles chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen({ route }: Props) {
  const navigation = useNavigation<NavigationProp>();
  const { user: userData } = route.params;
  const [user, setUser] = useState<any>(userData);
  const [roleName, setRoleName] = useState<string>("Chưa có");
  const [loading, setLoading] = useState(false);

  const fetchRoleName = async (userId: number) => {
    try {
      const roleData = await UserService.getRoleByUserId(userId);
      if (roleData?.role) setRoleName(roleData.role);
      else if (roleData?.name) setRoleName(roleData.name);
      else setRoleName("Không xác định");
    } catch (error: any) {
      setRoleName("Không xác định");
    }
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const freshUser = await UserService.getById(user.user_id);
      setUser(freshUser);
      await fetchRoleName(freshUser.user_id);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.user_id) fetchUserInfo();
  }, [user?.user_id]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      Alert.alert("Thông báo", "Bạn đã đăng xuất");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất");
    }
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải thông tin người dùng...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.schedule}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Hồ sơ cá nhân</Text>
          <Text style={textStyles.bannerSubtitle}>
            Thông tin chi tiết tài khoản của bạn
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Thông tin người dùng */}
      <View style={[layoutStyles.center, { marginVertical: 20 }]}>
        <Image
          style={{ width: 120, height: 120, borderRadius: 60 }}
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              user?.name || "User"
            )}&background=6C63FF&color=fff&size=128`,
          }}
        />
        <Text style={[textStyles.listTitle, { marginTop: 10 }]}>
          {user?.name || "No Name"}
        </Text>
        <Text style={textStyles.subjectDesc}>Email: {user?.email}</Text>
        <Text style={textStyles.subjectDesc}>Vai trò: {roleName}</Text>
      </View>

      {/* Nút hành động */}
      <TouchableOpacity
        style={[
          buttonStyles.primary,
          { marginHorizontal: 20, marginBottom: 10 },
        ]}
        onPress={() =>
          Alert.alert("Thông báo", "Chức năng cập nhật đang phát triển!")
        }
      >
        <Text style={buttonStyles.primaryText}>Cập nhật thông tin</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[buttonStyles.primaryButton, { backgroundColor: "red" }]}
        onPress={handleLogout}
      >
        <Text style={buttonStyles.primaryText}>Đăng xuất</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img1}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Hãy cập nhật thông tin cá nhân để nhận trải nghiệm tốt nhất!
        </Text>
      </View>
    </ScrollView>
  );
}
