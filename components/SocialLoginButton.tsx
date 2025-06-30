import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  // signInPath: Href; // Path for sign in ("Se Connecter")
  // signUpPath: Href; // Path for sign up ("S'inscrire")
  continueToHome: Href; // Path for sign up ("S'inscrire")
};

const SocialLoginButton = ({ continueToHome }: Props) => {
  // Add default paths in case props are undefined
  //const continueToHome = continueToHome || "/home";

  return (
    <View style={styles.socialLoginWrapper}>
      <Animated.View entering={FadeInDown.delay(300).duration(500)}>
        <Link href={continueToHome} asChild>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="log-in" size={20} color={Colors.black} />
            <Text style={styles.btnTxt}>Commencer</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>

      {/* <Animated.View entering={FadeInDown.delay(700).duration(500)}>
        <Link href={signInHref} asChild>
          <TouchableOpacity style={styles.button}>
            <Ionicons name="person-add" size={20} color={Colors.black} />
            <Text style={styles.btnTxt}>S&apos;inscrirer</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View> */}
    </View>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  socialLoginWrapper: {
    alignSelf: "stretch",
  },
  button: {
    flexDirection: "row",
    padding: 10,
    borderColor: Colors.gray,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    gap: 5,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.black,
  },
});
