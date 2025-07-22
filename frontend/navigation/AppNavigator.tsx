import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "./BottomTab";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import OTPScreen from "../screens/Auth/OTPScreen";
import SubjectListScreen from "../screens/Subject/SubjectListScreen";
import AddSubjectScreen from "../screens/Subject/AddSubjectScreen";
import EditSubjectScreen from "../screens/Subject/EditSubjectScreen";

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  OTP: undefined;
  SubjectList: undefined;
  AddSubject: undefined;
  EditSubject: { id: number };
};
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTab} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="SubjectList" component={SubjectListScreen} />
      <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
      <Stack.Screen name="EditSubject" component={EditSubjectScreen} />
    </Stack.Navigator>
  );
}
