import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
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
  interpolate,
  SlideInLeft,
  SlideInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { ensureArray } from "@/components/utils/arrayHelpers";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.4;

const ProTipDetail = () => {
  const params = useLocalSearchParams();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [isSaved, setIsSaved] = useState(false);

  console.log("params: ", params);

  // Parse the data from params with fallbacks
  const title = (params.title as string) || "Pro Tip";
  const category = (params.category as string) || "Business";
  const color = (params.color as string) || "#7c3aed"; // Default purple
  const content =
    (params.content as string) || "Expert advice to grow your business.";
  const isVideo = params.isVideo === "true"; // Will be false if undefined
  // Safely parse keyPoint as an array
  const keyPoints = React.useMemo(() => {
    try {
      const parsed =
        typeof params.keyPoint === "string"
          ? JSON.parse(params.keyPoint)
          : params.keyPoint;
      return ensureArray(parsed);
    } catch (error) {
      console.error("Error parsing key points:", error);
      return [];
    }
  }, [params.keyPoint]);
  const expertName = (params.expertName as string) || "None";
  const expertQuote = (params.expertQuote as string) || "None";
  const expertTitle = (params.expertTitle as string) || "None";

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

      // Create safe content for sharing
      const safeTitle = title || "Pro Tip";
      const safeContent = content
        ? content.length > 100
          ? `${content.substring(0, 100)}...`
          : content
        : "Expert advice for your business";

      await Share.share({
        message: `Check out this pro tip on Uzuri App: ${safeTitle} - ${safeContent}`,
        url: "https://uzuri.app",
        title: `Pro Tip: ${safeTitle}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      // Optionally show user feedback
      Alert.alert("Sharing Error", "Could not share at this time");
    }
  };

  const handleSave = () => {
    Haptics.notificationAsync(
      isSaved
        ? Haptics.NotificationFeedbackType.Warning
        : Haptics.NotificationFeedbackType.Success
    );
    setIsSaved(!isSaved);
  };

  const handlePlayVideo = () => {
    // Replace with your actual video URL or navigation to video player
    Linking.openURL("https://youtube.com");
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
            <LinearGradient
              colors={[color, "#000"]}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />

            {isVideo ? (
              <TouchableOpacity
                style={styles.videoPlayButton}
                onPress={handlePlayVideo}
                activeOpacity={0.8}
              >
                <MaterialIcons
                  name="play-circle-filled"
                  size={80}
                  color="white"
                />
              </TouchableOpacity>
            ) : (
              <FontAwesome
                name="lightbulb-o"
                size={80}
                color="white"
                style={styles.tipIcon}
              />
            )}
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

            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>

            <Animated.Text
              style={styles.title}
              entering={FadeInUp.duration(1000).delay(300)}
            >
              {title}
            </Animated.Text>
          </Animated.View>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View
            style={styles.actionButtons}
            entering={SlideInRight.duration(600).delay(500)}
          >
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: color }]}
              onPress={handleSave}
            >
              <Ionicons
                name={isSaved ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isSaved ? color : "#666"}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  { color: isSaved ? color : "#666" },
                ]}
              >
                {isSaved ? "Saved" : "Save"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: color }]}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={20} color="white" />
              <Text style={[styles.actionButtonText, { color: "white" }]}>
                Share
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={styles.tipContentContainer}
            entering={FadeIn.duration(600).delay(600)}
          >
            <Text style={styles.sectionTitle}>Pro Tip</Text>
            <Text style={styles.tipContentText}>
              {content}
              {/* {"\n\n"}Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie
              vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh
              porttitor. Ut in nulla enim.
              {"\n\n"}Phasellus molestie magna non est bibendum non venenatis
              nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris
              iaculis porttitor posuere. Praesent id metus massa, ut blandit
              odio. */}
            </Text>
          </Animated.View>

          {isVideo && (
            <Animated.View
              style={styles.videoSection}
              entering={FadeInUp.duration(800).delay(700)}
            >
              <Text style={styles.sectionTitle}>Watch Video Tutorial</Text>
              <TouchableOpacity
                style={[styles.videoContainer, { borderColor: color }]}
                onPress={handlePlayVideo}
              >
                <LinearGradient
                  colors={[color, "#000"]}
                  style={styles.videoThumbnail}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialIcons
                    name="play-circle-filled"
                    size={60}
                    color="white"
                  />
                  <Text style={styles.videoDuration}>5:23</Text>
                </LinearGradient>
                <View style={styles.videoInfo}>
                  <Text style={styles.videoTitle}>
                    Step-by-Step {category} Tutorial
                  </Text>
                  <Text style={styles.videoDescription}>
                    Watch how to implement this pro tip in your business
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}

          <Animated.View
            style={styles.keyPointsContainer}
            entering={FadeIn.duration(600).delay(800)}
          >
            <Text style={styles.sectionTitle}>Key Points</Text>

            {keyPoints.length > 0 ? (
              keyPoints.map((point, index) => (
                <Animated.View
                  key={`point-${index}`}
                  style={[styles.keyPointItem, { borderLeftColor: color }]}
                  entering={SlideInLeft.duration(600).delay(900 + index * 150)}
                >
                  <View
                    style={[styles.keyPointIcon, { backgroundColor: color }]}
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                  <Text style={styles.keyPointText}>{point}</Text>
                </Animated.View>
              ))
            ) : (
              <Text style={styles.noKeyPointsText}>
                No key points available
              </Text>
            )}
          </Animated.View>

          <Animated.View
            style={styles.expertContainer}
            entering={FadeInUp.duration(800).delay(1100)}
          >
            <Text style={styles.sectionTitle}>Expert Advice</Text>
            <View style={styles.expertCard}>
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/women/44.jpg",
                }}
                style={styles.expertImage}
              />
              <View style={styles.expertInfo}>
                <Text style={styles.expertName}>{expertName}</Text>
                <Text style={styles.expertTitle}>{expertTitle}</Text>
                <Text style={styles.expertQuote}>{expertQuote}</Text>
              </View>
            </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  videoPlayButton: {
    zIndex: 2,
  },
  tipIcon: {
    opacity: 0.9,
  },
  titleContainer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
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
  categoryTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  categoryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
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
  tipContentContainer: {
    marginBottom: 30,
  },
  tipContentText: {
    color: "#555",
    lineHeight: 24,
    fontSize: 16,
  },
  videoSection: {
    marginBottom: 30,
  },
  videoContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  videoThumbnail: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  videoDuration: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  videoInfo: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  videoTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  videoDescription: {
    color: "#666",
    fontSize: 12,
  },
  keyPointsContainer: {
    marginBottom: 30,
  },
  keyPointItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingLeft: 15,
    borderLeftWidth: 3,
  },
  keyPointIcon: {
    width: 25,
    height: 25,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  keyPointText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  expertContainer: {
    marginBottom: 30,
  },
  expertCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
  },
  expertImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontWeight: "bold",
    marginBottom: 2,
    color: "#333",
  },
  expertTitle: {
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
  },
  expertQuote: {
    fontStyle: "italic",
    color: "#555",
    lineHeight: 20,
  },
  relatedContainer: {
    marginBottom: 30,
  },
  relatedTipsContainer: {
    paddingBottom: 10,
  },
  relatedTipCard: {
    width: 200,
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
  },
  relatedTipCategory: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 5,
  },
  relatedTipTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  relatedTipArrow: {
    alignSelf: "flex-end",
  },
  noKeyPointsText: {
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
});

export default ProTipDetail;
