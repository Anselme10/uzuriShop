import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Animated, Easing, Image, StyleSheet } from "react-native";

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({
  onAnimationComplete,
}) => {
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.7)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animate = async () => {
      // Run animations
      Animated.parallel([
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        // Scale up with bounce
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        // Continuous slow rotation
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 15000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ),
        // Pulsing effect
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      // Wait then call completion handler
      setTimeout(() => {
        onAnimationComplete();
      }, 10000);
    };

    animate();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "5deg"],
  });

  return (
    <LinearGradient
      colors={[Colors.highlight, "#FF6B9E"]}
      style={styles.container}
    >
      {/* Animated Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: Animated.multiply(scaleAnim, pulseAnim) },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        <Image
          source={require("@/assets/images/uzlogotrans.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Animated Circles */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle1,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.1],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
            }),
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />

      {/* Tagline */}
      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        L&apos;art des cils parfait
      </Animated.Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: "80%",
    height: "80%",
  },
  circle: {
    position: "absolute",
    borderRadius: 500,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  circle1: {
    width: 400,
    height: 400,
    top: -100,
    left: -100,
  },
  circle2: {
    width: 300,
    height: 300,
    bottom: -50,
    right: -50,
  },
  tagline: {
    position: "absolute",
    bottom: 100,
    color: "white",
    fontSize: 20,
    fontFamily: "PlayfairDisplay-Italic",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default AnimatedSplash;
