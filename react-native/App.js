import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import MySubmissions from './pages/MySubmissions';
import SubmissionDetail from './pages/SubmissionDetails';
import { FormProvider } from "./context/FormContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <FormProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Admin" component={AdminPage} />
          <Stack.Screen name="Form" component={UserPage} />
          <Stack.Screen name="MySubmissions" component={MySubmissions} />
          <Stack.Screen name="SubmissionDetail" component={SubmissionDetail} />

        </Stack.Navigator>
      </NavigationContainer>
    </FormProvider>
  );
}
