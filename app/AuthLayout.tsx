import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="AnimatedSplash" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="signin"
        options={{
          presentation: "modal",
          title: "Sign In",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          presentation: "modal",
          title: "Sign Up",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="InspirationConseils"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="BrandCreationForm"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="EcommeScreen"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="MoodBoardScreen"
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="CoachingScreen"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="CommandesScreen"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPassword"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
};

export default AuthLayout;
