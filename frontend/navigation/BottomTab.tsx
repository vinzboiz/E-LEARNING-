import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/Auth/AccountScreen";
import SubjectListScreen from "../screens/Subject/SubjectListScreen";
import CoursetListScreen from "../screens/Course/CourseListScreen";
import RegistrationListScreen from "../screens/Registration/RegistrationListScreen";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudentRegisteredCoursesScreen from "../screens/ClassMember/StudentRegisteredCoursesScreen";

export type BottomTabParamList = {
  Home: undefined;
  Subject: undefined;
  Account: undefined;
  Course: undefined;
  Registration: undefined;
  StudentRegisteredCourses: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTab() {
  const [role, setRole] = useState<number | null>(null);

  // Lấy role từ AsyncStorage khi app load
  useEffect(() => {
    const fetchRole = async () => {
      const savedRole = await AsyncStorage.getItem("role_id");
      setRole(savedRole ? parseInt(savedRole, 10) : null);
    };
    fetchRole();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Subject") iconName = "book-outline";
          else if (route.name === "Course") iconName = "school-outline";
          else if (route.name === "Registration")
            iconName = "clipboard-outline";
          else if (route.name === "Account") iconName = "person-outline";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {role === 1 && (
        <Tab.Screen name="Subject" component={SubjectListScreen} />
      )}
      
      <Tab.Screen name="Course" component={CoursetListScreen} />
      <Tab.Screen
        name="Registration"
        component={RegistrationListScreen}
        options={{ title: "Mở đăng ký" }}
      />
      <Tab.Screen name="Account" component={AccountScreen} />
      <Tab.Screen
        name="StudentRegisteredCourses"
        component={StudentRegisteredCoursesScreen}
        options={{ title: "Đăng ký" }}
      />
    </Tab.Navigator>
  );
}
