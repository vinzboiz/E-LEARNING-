import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "./BottomTab";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import OTPScreen from "../screens/Auth/OTPScreen";
import SubjectListScreen from "../screens/Subject/SubjectListScreen";
import AddSubjectScreen from "../screens/Subject/AddSubjectScreen";
import EditSubjectScreen from "../screens/Subject/EditSubjectScreen";
import CourseListScreen from "../screens/Course/CourseListScreen";
import AddCourseScreen from "../screens/Course/AddCourseScreen";
import EditCourseScreen from "../screens/Course/EditCourseScreen";
import EditCourseScheduleScreen  from "../screens/Schedule/EditCourseScheduleScreen";
import ScheduleListScreen from "../screens/Schedule/ScheduleListScreen";
import CourseDetailScreen from "../screens/Course/CourseDetailScreen";
import EditLessonScreen from "../screens/Lesson/EditLessonScreen";
import LessonListScreen from "../screens/Lesson/LessonListScreen";
import AddLessonScreen from "../screens/Lesson/AddLessonScreen";
import LessonDetailScreen from "../screens/Lesson/LessonDetailScreen";
import AssignmentListScreen from "../screens/Assignment/AssignmentListScreen";

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  OTP: { name: string; email: string; password: string };
  SubjectList: undefined;
  AddSubject: undefined;
  EditSubject: { id: number };
  CourseList: undefined;
  AddCourse: undefined;
  EditCourse: { id: number };
  EditCourseSchedule: { schedule: any };
  ScheduleList: { courseId: number };
  CourseDetail: { courseId: number };
  LessonList: { courseId: number };
  AssignmentList: { lessonId: number };
  AddLesson: { courseId: number };
  EditLesson: { lessonId: number; courseId: number };
  LessonDetail: { lesson: any };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={BottomTab} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="SubjectList" component={SubjectListScreen} />
      <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
      <Stack.Screen name="EditSubject" component={EditSubjectScreen} />
      <Stack.Screen name="CourseList" component={CourseListScreen} />
      <Stack.Screen name="AddCourse" component={AddCourseScreen} />
      <Stack.Screen name="EditCourse" component={EditCourseScreen} />
      <Stack.Screen
        name="EditCourseSchedule"
        component={EditCourseScheduleScreen}
      />
      <Stack.Screen name="ScheduleList" component={ScheduleListScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="LessonList" component={LessonListScreen} />

      <Stack.Screen name="EditLesson" component={EditLessonScreen} />
      <Stack.Screen name="AddLesson" component={AddLessonScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
      <Stack.Screen name="AssignmentList" component={AssignmentListScreen} />
    </Stack.Navigator>
  );
}
