import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "@/app/context/AuthContext";
import { OrdersProvider } from "@/app/context/OrdersContext";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Custom StatusBar component to fix edge-to-edge warning
function CustomStatusBar({
  backgroundColor = "#F12498ff",
  style = "auto",
}: {
  backgroundColor?: string;
  style?: "auto" | "inverted" | "light" | "dark";
}) {
  // Get status bar height safely
  const statusBarHeight = Platform.OS === "ios" ? 44 : 24;

  return (
    <>
      <View
        style={[
          styles.statusBarBackground,
          { backgroundColor, height: statusBarHeight },
        ]}
      />
      <StatusBar style={style} />
    </>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LinearGradient
        colors={["#0e0c0cff", "#1a1a2eff", "#16213eff"]}
        style={styles.background}
      />
    );
  }

  return (
    <LinearGradient
      colors={["#0e0c0cff", "#1a1a2eff", "#16213eff"]}
      style={styles.background}
    >
      <CustomStatusBar backgroundColor="#F12498ff" style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen
          name="signin"
          options={{
            presentation: "modal",
            title: "Sign In",
            headerStyle: { backgroundColor: "#0e0c0cff" },
            headerTintColor: "#fff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            presentation: "modal",
            title: "Sign Up",
            headerStyle: { backgroundColor: "#0e0c0cff" },
            headerTintColor: "#fff",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            ),
          }}
        />
        {/* Other modal screens */}
        <Stack.Screen
          name="InspirationConseils"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="BrandCreationForm"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EcommeScreen"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MoodBoardScreen"
          options={{
            presentation: "modal",
            headerStyle: { backgroundColor: "#0e0c0cff" },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Ambassador"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CoachingScreen"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CommandesScreen"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SuccessStoryDetail"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProTipDetail"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Contact"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MoodBoardDetail"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HelpCenter"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AccountSettings"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Distributeur"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Amb"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Modules"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </LinearGradient>
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/Quicksand-Regular.ttf"),
  });
  const [appReady, setAppReady] = useState(false);

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
    }
  }, [appReady, fontsLoaded]);

  if (!appReady || !fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <AuthProvider>
        <OrdersProvider>
          <RootLayoutNav />
        </OrdersProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0e0c0cff",
  },
  background: {
    flex: 1,
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});
