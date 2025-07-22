import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/Auth/AccountScreen";
import SubjectListScreen from "../screens/Subject/SubjectListScreen"; // Import Subject
import Icon from "react-native-vector-icons/Ionicons";

export type BottomTabParamList = {
  Home: undefined;
  Subject: undefined; // Thêm Subject
  Account: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTab() {
  return (
    <Tab.Navigator
      id={undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = "home-outline";
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Subject") iconName = "book-outline";
          else if (route.name === "Account") iconName = "person-outline";

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Subject" component={SubjectListScreen} />

      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
