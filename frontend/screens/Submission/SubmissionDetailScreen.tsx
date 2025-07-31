import React from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Linking,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import style chung
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { cardStyles } from "../../constants/cardStyles";

//assets
import { Images } from "../../constants/images/images";
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SubmissionDetail"
>;

export default function SubmissionDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { submission } = route.params;

  const handleOpenDriveLink = () => {
    if (submission.drive_link) {
      Linking.openURL(submission.drive_link).catch(() =>
        Alert.alert("Lỗi", "Không thể mở link Google Drive.")
      );
    } else {
      Alert.alert("Thông báo", "Không có link bài nộp.");
    }
  };

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "Chưa có";
    const d = new Date(dateTime);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.submission}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Chi tiết bài nộp</Text>
          <Text style={textStyles.bannerSubtitle}>
            Thông tin và nội dung bài làm
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nội dung bài nộp */}
      <View style={[cardStyles.card, { margin: 15 }]}>
        <Text style={textStyles.subjectName}>
          Tên học sinh: {submission.student_name || "Không rõ"}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Nộp lúc: {formatDateTime(submission.submitted_at)}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Điểm: {submission.score != null ? submission.score : "Chưa chấm"}
        </Text>
        <Text style={textStyles.subjectDesc}>
          Đánh giá: {submission.feedback || "Chưa nhận xét"}
        </Text>

        <Text style={[textStyles.subjectDesc, { marginTop: 10 }]}>
          Nội dung bài làm:
        </Text>
        <Text style={textStyles.modalDesc}>
          {submission.content || "Không có nội dung"}
        </Text>
        {submission.drive_link && (
          <Text
            style={[textStyles.linkText, { color: "blue" }]}
            onPress={handleOpenDriveLink}
          >
            Link bài nộp (Google Drive)
          </Text>
        )}

        {/* Nút chấm điểm */}
        <TouchableOpacity
          style={[buttonStyles.primary, { marginTop: 15 }]}
          onPress={() =>
            navigation.navigate("GradeSubmissionScreen", { submission })
          }
        >
          <Text style={buttonStyles.primaryText}>Chấm điểm</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img11}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Đánh giá bài làm để hỗ trợ sinh viên tốt hơn!
        </Text>
      </View>
    </ScrollView>
  );
}
