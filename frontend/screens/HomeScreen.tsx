import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
  const featuredCourses = [
    {
      id: 1,
      title: "React Native Cơ Bản",
      instructor: "Nguyễn Văn A",
      rating: 4.8,
      students: 1234,
      image: "/placeholder.svg?height=120&width=200",
      price: "299,000đ",
    },
    {
      id: 2,
      title: "JavaScript ES6+",
      instructor: "Trần Thị B",
      rating: 4.9,
      students: 2156,
      image: "/placeholder.svg?height=120&width=200",
      price: "199,000đ",
    },
  ];

  const categories = [
    { id: 1, name: "Lập trình", icon: "💻", color: "#4F46E5" },
    { id: 2, name: "Thiết kế", icon: "🎨", color: "#EF4444" },
    { id: 3, name: "Marketing", icon: "📈", color: "#10B981" },
    { id: 4, name: "Kinh doanh", icon: "💼", color: "#F59E0B" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Xin chào! 👋</Text>
            <Text style={styles.userName}>Học viên</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm khóa học..."
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Khám phá thế giới kiến thức</Text>
          <Text style={styles.heroSubtitle}>
            Hơn 1000+ khóa học chất lượng cao từ các chuyên gia hàng đầu
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => navigation.navigate("SubjectList")}
          >
            <Text style={styles.heroButtonText}>Bắt đầu học ngay</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.heroImage}>
          <Text style={styles.heroEmoji}>📚</Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danh mục phổ biến</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { borderColor: category.color }]}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Featured Courses */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Khóa học nổi bật</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredCourses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
              <View style={styles.courseImageContainer}>
                <Text style={styles.courseImagePlaceholder}>📖</Text>
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {course.title}
                </Text>
                <Text style={styles.courseInstructor}>{course.instructor}</Text>
                <View style={styles.courseStats}>
                  <Text style={styles.courseRating}>⭐ {course.rating}</Text>
                  <Text style={styles.courseStudents}>
                    ({course.students} học viên)
                  </Text>
                </View>
                <Text style={styles.coursePrice}>{course.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Truy cập nhanh</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>📝</Text>
            <Text style={styles.quickActionText}>Bài tập</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>📊</Text>
            <Text style={styles.quickActionText}>Tiến độ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>🏆</Text>
            <Text style={styles.quickActionText}>Thành tích</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionCard}>
            <Text style={styles.quickActionIcon}>💬</Text>
            <Text style={styles.quickActionText}>Hỗ trợ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    color: "#6B7280",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#C7D2FE",
    marginBottom: 16,
    lineHeight: 20,
  },
  heroButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 14,
  },
  heroImage: {
    marginLeft: 20,
  },
  heroEmoji: {
    fontSize: 60,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  seeAllText: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: (width - 60) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  courseCard: {
    width: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  courseImageContainer: {
    height: 120,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  courseImagePlaceholder: {
    fontSize: 40,
  },
  courseInfo: {
    padding: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  courseInstructor: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  courseRating: {
    fontSize: 12,
    color: "#F59E0B",
    marginRight: 5,
  },
  courseStudents: {
    fontSize: 12,
    color: "#6B7280",
  },
  coursePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4F46E5",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  quickActionCard: {
    width: (width - 80) / 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
});
