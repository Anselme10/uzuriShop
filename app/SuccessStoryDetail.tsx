import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import {
  Dimensions,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.5;

const SuccessStoryDetail = () => {
  const params = useLocalSearchParams();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  // Parse the data from params
  const name = params.name as string;
  const location = params.location as string;
  const beforeImage = params.beforeImage as string;
  const afterImage = params.afterImage as string;
  const quote = params.quote as string;
  const tips = JSON.parse(params.tips as string);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT - 100],
        [HEADER_HEIGHT, 100],
        Extrapolate.CLAMP
      ),
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-100, 0, 100],
            [30, 0, -30],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-100, 0, 200],
            [1.1, 1, 0.9],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT - 100],
            [0, -50],
            Extrapolate.CLAMP
          ),
        },
      ],
      opacity: interpolate(
        scrollY.value,
        [0, HEADER_HEIGHT - 150],
        [1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const handleShare = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `Check out ${name}'s success story on Uzuri App! ${quote}`,
        url: "https://uzuri.app",
        title: `${name}'s Success Story`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Implement your save functionality here
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <Animated.View style={[styles.imageContainer, imageStyle]}>
            <Image
              source={{ uri: afterImage }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.7)", "transparent"]}
              style={styles.gradient}
            />
          </Animated.View>

          <Animated.View
            style={[styles.titleContainer, titleStyle]}
            entering={FadeInDown.duration(800).delay(200)}
          >
            <View style={styles.backButton}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Animated.Text
              style={styles.title}
              entering={FadeInUp.duration(1000).delay(300)}
            >
              {name}&apos;s Journey
            </Animated.Text>

            <Animated.Text
              style={styles.subtitle}
              entering={FadeInUp.duration(1000).delay(400)}
            >
              {location}
            </Animated.Text>
          </Animated.View>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View
            style={styles.actionButtons}
            entering={SlideInRight.duration(600).delay(500)}
          >
            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons
                name="bookmark-outline"
                size={20}
                color={Colors.primary}
              />
              <Text
                style={[styles.actionButtonText, { color: Colors.primary }]}
              >
                Save
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: Colors.primary }]}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={20} color="white" />
              <Text style={[styles.actionButtonText, { color: "white" }]}>
                Share
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={styles.beforeAfterContainer}
            entering={FadeIn.duration(600).delay(600)}
          >
            <Text style={styles.sectionTitle}>Transformation</Text>

            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonImageContainer}>
                <Text style={styles.comparisonLabel}>Before</Text>
                <Image
                  source={{ uri: beforeImage }}
                  style={styles.comparisonImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.comparisonImageContainer}>
                <Text style={styles.comparisonLabel}>After</Text>
                <Image
                  source={{ uri: afterImage }}
                  style={styles.comparisonImage}
                  resizeMode="cover"
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={styles.quoteContainer}
            entering={FadeInUp.duration(800).delay(700)}
          >
            <Ionicons
              name="chatbubble-outline"
              size={30}
              color={Colors.primary}
              style={styles.quoteIcon}
            />
            <Text style={styles.quoteText}>{quote}</Text>
          </Animated.View>

          <Animated.View
            style={styles.tipsContainer}
            entering={FadeIn.duration(600).delay(800)}
          >
            <Text style={styles.sectionTitle}>
              {name.split(" ")[0]}&apos;s Top Tips
            </Text>

            {tips.map((tip: string, index: number) => (
              <Animated.View
                key={index}
                style={styles.tipItem}
                entering={SlideInLeft.duration(600).delay(900 + index * 150)}
              >
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </Animated.View>
            ))}
          </Animated.View>

          <Animated.View
            style={styles.storyContainer}
            entering={FadeInUp.duration(800).delay(900 + tips.length * 150)}
          >
            <Text style={styles.sectionTitle}>The Full Story</Text>
            <Text style={styles.storyText}>
              {name} started their lash business in {location} with just a small
              kit and big dreams. After joining the Uzuri community and applying
              our proven methods, they were able to grow their client base by
              300% in just 6 months. Today, {name.split(" ")[0]} runs a
              successful lash studio with a waiting list of clients eager to
              experience their signature style.
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>300%</Text>
                <Text style={styles.statLabel}>Growth</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>6</Text>
                <Text style={styles.statLabel}>Months</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>50+</Text>
                <Text style={styles.statLabel}>Clients</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={styles.ctaContainer}
            entering={ZoomIn.duration(600).delay(1000 + tips.length * 150)}
          >
            <Text style={styles.ctaTitle}>Ready to Start Your Journey?</Text>
            <Text style={styles.ctaText}>
              Join Uzuri today and get access to the same tools and resources
              that helped {name.split(" ")[0]} succeed.
            </Text>

            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.ctaButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 50,
  },
  header: {
    width: "100%",
    backgroundColor: "#f0f0f0",
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
    zIndex: 1,
  },
  titleContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    zIndex: 2,
  },
  backButton: {
    backgroundColor: "rgba(0,0,0,0.4)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    padding: 20,
    paddingTop: 30,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    width: "48%",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  beforeAfterContainer: {
    marginBottom: 30,
  },
  comparisonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  comparisonImageContainer: {
    width: "48%",
  },
  comparisonImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },
  comparisonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  quoteContainer: {
    backgroundColor: "#f3e8ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    position: "relative",
  },
  quoteIcon: {
    position: "absolute",
    top: 10,
    left: 10,
    opacity: 0.2,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#5b21b6",
    lineHeight: 24,
  },
  tipsContainer: {
    marginBottom: 30,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#f5f3ff",
    borderRadius: 12,
    padding: 15,
  },
  tipNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  tipNumberText: {
    color: "white",
    fontWeight: "bold",
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  storyContainer: {
    marginBottom: 30,
  },
  storyText: {
    color: "#555",
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
    width: "30%",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  ctaContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    textAlign: "center",
  },
  ctaText: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
});

export default SuccessStoryDetail;
