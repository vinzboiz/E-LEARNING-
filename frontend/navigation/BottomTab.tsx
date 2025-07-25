import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/Auth/AccountScreen";
import SubjectListScreen from "../screens/Subject/SubjectListScreen";
import CourseListScreen from "../screens/Course/CourseListScreen";
import RegistrationListScreen from "../screens/Registration/RegistrationListScreen";
import UserManagementScreen from "../screens/Auth/UserManagementScreen";
import RegisterTimeScreen from "../screens/Registration/RegisterTimeScreen";
import StudentCourseListScreen from "../screens/ClassMember/StudentCourseListScreen";
import AdminClassMemberListScreen from "../screens/ClassMember/AdminClassMemberListScreen";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type BottomTabParamList = {
  Home: undefined;
  Subject: undefined;
  Course: undefined;
  Registration: undefined;
  RegisterTime: undefined;
  UserManagement: undefined;
  Account: undefined;
  StudentCourseListScreen: undefined;
  AdminClassMemberListScreen: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTab() {
  const [role, setRole] = useState<number | null>(null); // 1=Admin, 2=Student, 3=Teacher

  useEffect(() => {
    const fetchRole = async () => {
      const savedRole = await AsyncStorage.getItem("role_id");
      setRole(savedRole ? parseInt(savedRole, 10) : null);
    };
    fetchRole();
  }, []);

  const renderTabs = () => {
    if (role === 1) {
      // Admin
      return (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Subject" component={SubjectListScreen} />
          <Tab.Screen name="Course" component={CourseListScreen} />
          <Tab.Screen
            name="Registration"
            component={RegistrationListScreen}
            options={{ title: "Mở đăng ký" }}
          />
          <Tab.Screen
            name="RegisterTime"
            component={RegisterTimeScreen}
            options={{ title: "Thời gian đăng ký" }}
          />
          <Tab.Screen
            name="UserManagement"
            component={UserManagementScreen}
            options={{ title: "Quản lý người dùng" }}
          />
          <Tab.Screen
            name="AdminClassMemberListScreen"
            component={AdminClassMemberListScreen}
            options={{ title: "Đăng ký" }}
          />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      );
    } else if (role === 3) {
      // Teacher
      return (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Course" component={CourseListScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      );
    } else {
      // Student
      return (
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Course" component={CourseListScreen} />
          <Tab.Screen
            name="RegisterTime"
            component={RegisterTimeScreen}
            options={{ title: "Thời gian đăng ký" }}
          />
          <Tab.Screen
            name="StudentCourseListScreen"
            component={StudentCourseListScreen}
            options={{ title: "Đăng ký" }}
          />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      );
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Subject") iconName = "book-outline";
          else if (route.name === "Course") iconName = "school-outline";
          else if (route.name === "Registration") iconName = "clipboard-outline";
          else if (route.name === "RegisterTime") iconName = "calendar-outline";
          else if (route.name === "UserManagement") iconName = "people-outline";
          else if (
            route.name === "StudentCourseListScreen" ||
            route.name === "AdminClassMemberListScreen"
          )
            iconName = "create-outline";
          else if (route.name === "Account") iconName = "person-outline";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {renderTabs()}
    </Tab.Navigator>
  );
}
