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
  SlideInRight,
  ZoomIn,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// Utility function to safely parse arrays
const ensureArray = (input: any): any[] => {
  if (Array.isArray(input)) return input;
  if (input === undefined || input === null) return [];
  return [input];
};

const { height } = Dimensions.get("window");
const IMAGE_HEIGHT = height * 0.5;

const MoodBoardDetail = () => {
  const params = useLocalSearchParams();
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  // Safely parse and validate the images array
  const images = React.useMemo(() => {
    try {
      const parsed =
        typeof params.images === "string"
          ? JSON.parse(params.images)
          : params.images;
      return ensureArray(parsed);
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  }, [params.images]);

  const title = (params.title as string) || "Moodboard";
  const style = (params.style as string) || "Inspiration";
  const color = (params.color as string) || "#C9B6E4";

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, IMAGE_HEIGHT - 100],
        [IMAGE_HEIGHT, 100],
        Extrapolate.CLAMP
      ),
      opacity: interpolate(
        scrollY.value,
        [0, IMAGE_HEIGHT - 200],
        [1, 0.8],
        Extrapolate.CLAMP
      ),
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, IMAGE_HEIGHT - 100],
            [0, -50],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [0, IMAGE_HEIGHT - 100],
            [1, 0.8],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-100, 0, 100],
            [50, 0, -50],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const handleShare = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `Check out this ${title} moodboard on Uzuri App!`,
        url: "https://uzuri.app",
        title: `${title} Moodboard`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // const handleSave = () => {
  //   Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  //   // Implement your save functionality here
  // };

  // Fallback image if no images are available
  const fallbackImage =
    "https://images.unsplash.com/photo-1587506203809-93913996383d";

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.header, headerStyle]}>
          <LinearGradient
            colors={["rgba(0,0,0,0.7)", "transparent"]}
            style={styles.gradient}
          />

          <Animated.View style={[styles.imageContainer, imageStyle]}>
            <Image
              source={{
                uri:
                  images.length > 0
                    ? `https://firebasestorage.googleapis.com/v0/b/uzuri-de01c.firebasestorage.app/o/${encodeURIComponent(
                        images[0]
                      )}?alt=media`
                    : fallbackImage,
              }}
              style={styles.mainImage}
              resizeMode="cover"
              defaultSource={{ uri: fallbackImage }}
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
              {title}
            </Animated.Text>

            <Animated.Text
              style={styles.subtitle}
              entering={FadeInUp.duration(1000).delay(400)}
            >
              {style} Style
            </Animated.Text>
          </Animated.View>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View
            style={styles.actionButtons}
            entering={SlideInRight.duration(600).delay(500)}
          >
            {/* <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: color }]}
              onPress={handleSave}
            >
              <Ionicons name="bookmark-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: color }]}
              onPress={handleShare}
            >
              <Ionicons name="share-social-outline" size={20} color="white" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </Animated.View>

          {images.length > 0 ? (
            <>
              <Animated.Text
                style={styles.sectionTitle}
                entering={FadeIn.duration(600).delay(600)}
              >
                Inspiration Gallery
              </Animated.Text>

              <Animated.View
                style={styles.gallery}
                entering={FadeIn.duration(800).delay(700)}
              >
                {images.map((image: string, index: number) => (
                  <Animated.View
                    key={`${image}-${index}`}
                    style={styles.galleryItem}
                    entering={ZoomIn.duration(600).delay(800 + index * 100)}
                  >
                    <Image
                      source={{
                        uri:
                          `https://firebasestorage.googleapis.com/v0/b/uzuri-de01c.firebasestorage.app/o/${encodeURIComponent(
                            image
                          )}?alt=media` || fallbackImage,
                      }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                      defaultSource={{ uri: fallbackImage }}
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.7)"]}
                      style={styles.imageOverlay}
                    />
                    <Text style={styles.imageNumber}>{index + 1}</Text>
                  </Animated.View>
                ))}
              </Animated.View>
            </>
          ) : (
            <Animated.Text
              style={[styles.sectionTitle, { color: "red" }]}
              entering={FadeIn.duration(600).delay(600)}
            >
              No images available for this moodboard
            </Animated.Text>
          )}

          {/* <Animated.Text
            style={styles.sectionTitle}
            entering={FadeIn.duration(600).delay(900 + images.length * 100)}
          >
            Key Elements
          </Animated.Text> */}

          <Animated.View
            style={styles.elementsContainer}
            entering={FadeInUp.duration(800).delay(1000 + images.length * 100)}
          >
            {/* {["Color Palette", "Typography", "Textures", "Composition"].map(
              (item, index) => (
                <Animated.View
                  key={item}
                  style={[
                    styles.elementCard,
                    { backgroundColor: `${color}20` },
                  ]}
                  entering={SlideInLeft.duration(600).delay(1100 + index * 150)}
                >
                  <View
                    style={[styles.elementIcon, { backgroundColor: color }]}
                  >
                    <Ionicons
                      name={
                        index === 0
                          ? "color-palette-outline"
                          : index === 1
                          ? "text-outline"
                          : index === 2
                          ? "layers-outline"
                          : "grid-outline"
                      }
                      size={20}
                      color="white"
                    />
                  </View>
                  <Text style={styles.elementText}>{item}</Text>
                </Animated.View>
              )
            )} */}
          </Animated.View>

          <Animated.Text
            style={styles.sectionTitle}
            entering={FadeIn.duration(600).delay(1400 + images.length * 100)}
          >
            Details Moodboard
          </Animated.Text>

          <Animated.View
            style={styles.detailsContainer}
            entering={FadeInUp.duration(800).delay(1500 + images.length * 100)}
          >
            <Text style={styles.detailsText}>
              This {style.toLowerCase()} Ce moodboard est conçu pour inspirer
              votre prochaine collection. La palette de couleurs et les textures
              créent une esthétique idéale pour les produits de beauté de luxe.
              Utilisez ces éléments comme point de départ pour votre identité de
              marque, votre packaging et vos supports marketing.
            </Text>

            <View style={styles.tagsContainer}>
              {["Luxury", "Elegant", "Minimal", "Chic"].map((tag) => (
                <View key={tag} style={[styles.tag, { borderColor: color }]}>
                  <Text style={[styles.tagText, { color }]}>{tag}</Text>
                </View>
              ))}
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
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
    zIndex: 1,
  },
  imageContainer: {
    width: "100%",
    height: IMAGE_HEIGHT,
  },
  mainImage: {
    width: "100%",
    height: "100%",
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
  },
  actionButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  galleryItem: {
    width: "48%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  imageNumber: {
    position: "absolute",
    bottom: 10,
    right: 10,
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  elementsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  elementCard: {
    width: "48%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  elementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  elementText: {
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailsText: {
    color: "#555",
    lineHeight: 24,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontWeight: "600",
    fontSize: 12,
  },
});

export default MoodBoardDetail;
