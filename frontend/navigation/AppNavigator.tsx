import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SubjectListScreen from "../screens/SubjectListScreen";
import AddSubjectScreen from "../screens/AddSubjectScreen";
import EditSubjectScreen from "../screens/EditSubjectScreen";

export type RootStackParamList = {
  Home: undefined;
  SubjectList: undefined;
  AddSubject: undefined;
  EditSubject: { id: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Home" id={undefined}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SubjectList" component={SubjectListScreen} />
      <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
      <Stack.Screen name="EditSubject" component={EditSubjectScreen} />
    </Stack.Navigator>
  );
}
