import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { LessonService } from "../../services/lesson.service";
import Ionicons from "react-native-vector-icons/Ionicons";

// Import styles
import { layoutStyles } from "../../constants/layoutStyles";
import { textStyles } from "../../constants/textStyles";
import { imageStyles } from "../../constants/imageStyles";
import { buttonStyles } from "../../constants/buttonStyles";
import { colors } from "../../constants/colors";

//assets
import { Images } from "../../constants/images/images";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LessonDetail"
>;

export default function LessonDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<NavigationProp>();
  const { lessonId } = route.params;

  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const data = await LessonService.getLessonById(lessonId);
        setLesson(data);
      } catch (err: any) {
        Alert.alert("Lỗi", err.message || "Không thể tải chi tiết bài học.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  const openPdf = async (fileUrl: string) => {
    try {
      await Linking.openURL(fileUrl);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể mở file PDF.");
    }
  };

  if (loading) {
    return (
      <View style={layoutStyles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Đang tải bài học...</Text>
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={layoutStyles.center}>
        <Text>Không tìm thấy bài học.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={layoutStyles.container}>
      {/* Banner */}
      <View style={layoutStyles.bannerWrapper}>
        <Image
          source={Images.TopBanner.lesson}
          style={imageStyles.banner}
          resizeMode="cover"
        />
        <View style={layoutStyles.bannerTextContainer}>
          <Text style={textStyles.bannerTitle}>Chi Tiết Bài Học</Text>
          <Text style={textStyles.bannerSubtitle}>
            Thông tin đầy đủ của bài học
          </Text>
        </View>
        <TouchableOpacity
          style={buttonStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Nội dung bài học */}
      <View style={{ padding: 20 }}>
        <Text style={textStyles.listTitle}>{lesson.title}</Text>
        <Text style={[{ marginBottom: 20, textAlign: "center" }]}>
          {lesson.content || "Chưa có nội dung cho bài học này."}
        </Text>

        {lesson.file && (
          <TouchableOpacity
            style={buttonStyles.primary}
            onPress={() => openPdf(lesson.file)}
          >
            <Text style={buttonStyles.primaryText}>Mở file PDF</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[buttonStyles.primary, { marginTop: 10 }]}
          onPress={() =>
            navigation.navigate("AssignmentList", {
              lessonId: lesson.lesson_id,
            })
          }
        >
          <Text style={buttonStyles.primaryText}>Xem bài tập</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Image
          source={Images.More.img2}
          style={imageStyles.footerImage}
          resizeMode="contain"
        />
        <Text style={textStyles.footerText}>
          Tiếp tục học tập và phát triển kỹ năng của bạn!
        </Text>
      </View>
    </ScrollView>
  );
}
