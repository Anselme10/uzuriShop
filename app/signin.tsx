import InputField from "@/components/inputField";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signInUser } = useAuth();
  const handleSignIn = async () => {
    console.log("SignIn");

    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      await signInUser(email, password);
      // Redirect after successful sign-in
      router.replace("/(tabs)");
    } catch (error: any) {
      router.replace("/signin");
      let errorMessage = "An error occurred during sign in";
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Try again later";
          break;
      }
      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Se connecter",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Connectez vous</Text>
          <InputField
            placeholder="Addresse Email"
            placeholderTextColor={Colors.gray}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <InputField
            placeholder="Mot de passe"
            placeholderTextColor={Colors.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.disabledBtn]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.btnTxt}>
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Text>
          </TouchableOpacity>

          <Link href={"/ForgotPassword"} asChild>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Mot de passe oublié?</Text>
            </TouchableOpacity>
          </Link>

          <Text style={styles.loginTxt}>
            Vous n&apos;avez pas de compte?{" "}
            <Link href={"/signup"} asChild>
              <Text style={styles.loginTxtSpan}>S&apos;inscrire</Text>
            </Link>
          </Text>
          <View style={styles.divider} />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: Colors.black,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 20,
  },
  disabledBtn: {
    backgroundColor: Colors.gray,
    opacity: 0.7,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  forgotPassword: {
    color: Colors.primary,
    marginBottom: 20,
    fontWeight: "500",
  },
  loginTxt: {
    marginTop: 30,
    fontSize: 14,
    color: Colors.black,
    lineHeight: 24,
  },
  loginTxtSpan: {
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: "30%",
    marginVertical: 30,
  },
});

export default SignIn;
