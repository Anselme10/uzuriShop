import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { OrdersProvider } from "@/app/context/OrdersContext";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Handle initial auth state and redirects
  // useEffect(() => {
  //   if (!loading) {
  //     if (user) {
  //       router.replace("/(tabs)");
  //     } else {
  //       router.replace("/home");
  //     }
  //   }
  // }, [user, loading]);

  // useEffect(() => {
  //   router.replace("/home");
  // }, []);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
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
        options={{ presentation: "modal", headerShown: false }}
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
        name="Ambassador"
        options={{ presentation: "modal", headerShown: false }}
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
      <Stack.Screen
        name="SuccessStoryDetail"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="ProTipDetail"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="Contact"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="MoodBoardDetail"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="HelpCenter"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="AccountSettings"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="Distributeur"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="Amb"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/Quicksand-Regular.ttf"),
  });
  const [appReady, setAppReady] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setAppReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (appReady && fontsLoaded) {
      SplashScreen.hideAsync();
      setSplashComplete(true);
    }
  }, [appReady, fontsLoaded]);

  if (!appReady || !fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <OrdersProvider>
        <RootLayoutNav />
      </OrdersProvider>
    </AuthProvider>
  );
}
