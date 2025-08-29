import { firestore } from "@/backend/firebase";
import { ensureArray } from "@/components/utils/arrayHelpers";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Animated as ReactAnimated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface Moodboard {
  id: string;
  title: string;
  style: string;
  color: string;
  images: string[];
  icon?: string;
  details?: string;
}

interface SuccessStory {
  id: string;
  name: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  quote: string;
  tips?: string[] | string | null;
}

interface ProTip {
  id: string;
  title: string;
  category: string;
  color: string;
  content: string;
  isVideo: boolean;
  icon?: string;
}

// Icons
const Icons = {
  play: "▶", // Version plus épurée sans emoji
  luxury: "💫", // Étoile qui brille (plus moderne que le diamant)
  girly: "💖", // Cœur moderne et universel
  branding: "🏷", // Étiquette sans le cadre de l'emoji
  production: "⚙", // Engrenage minimaliste
  video: "🎬", // Clap de cinéma (plus spécifique)
  quote: "〝", // Guillemet plus stylisé
};

const FADE_IN_DURATION = 800;

const useFadeIn = () => {
  const fadeAnim = React.useRef(new ReactAnimated.Value(0)).current;
  React.useEffect(() => {
    ReactAnimated.timing(fadeAnim, {
      toValue: 1,
      duration: FADE_IN_DURATION,
      useNativeDriver: true,
    }).start();
  }, []);
  return fadeAnim;
};

const useScale = () => {
  const scaleAnim = React.useRef(new ReactAnimated.Value(0.9)).current;
  React.useEffect(() => {
    ReactAnimated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, []);
  return scaleAnim;
};

const Card = ({ children, style }: any) => {
  const fadeAnim = useFadeIn();
  const scaleAnim = useScale();

  return (
    <ReactAnimated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {children}
    </ReactAnimated.View>
  );
};

const CategoryTag = ({ icon, label, color }: any) => (
  <View style={[styles.categoryTag, { backgroundColor: color }]}>
    <Text style={styles.categoryIcon}>{icon}</Text>
    <Text style={styles.categoryText}>{label}</Text>
  </View>
);

const InspirationConseils = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [proTips, setProTips] = useState<ProTip[]>([]);
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [assetsLoading, setAssetsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Moodboards
        const moodboardsSnapshot = await getDocs(
          collection(firestore, "moodboards")
        );
        const moodboardsData = moodboardsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              title: doc.data().title,
              style: doc.data().style,
              color: doc.data().color,
              images: doc.data().images,
              icon: doc.data().icon,
              details: doc.data().details,
            } as Moodboard)
        );
        setMoodboards(moodboardsData);

        const storiesSnapshot = await getDocs(
          collection(firestore, "successStories")
        );
        const storiesData = storiesSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            location: data.location,
            beforeImage: data.beforeImage,
            afterImage: data.afterImage,
            quote: data.quote,
            tips: ensureArray(data.tips), // Use our utility
          } as SuccessStory;
        });
        setSuccessStories(storiesData);

        const tipsSnapshot = await getDocs(collection(firestore, "proTips"));
        const tipsData = tipsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              title: doc.data().title,
              category: doc.data().category,
              color: Colors.primary,
              content: doc.data().content,
              isVideo: doc.data().isVideo,
              icon: doc.data().icon,
            } as ProTip)
        );
        setProTips(tipsData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const docRef = doc(firestore, "appAssets", "assetUrls");
        const docSnap = await getDoc(docRef);

        console.log("doc is: ", docSnap.exists());

        if (docSnap.exists()) {
          setAssets(docSnap.data() as Record<string, string>);
        } else {
          console.log("No asset document found");
          // Fallback to default assets if needed
          setAssets({
            MOODBOARD_1: "https://default.url/1",
            MOODBOARD_2: "https://default.url/4",
            // ... etc
          });
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setAssetsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  if (loading || assetsLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </SafeAreaView>
    );
  }

  const handleMoodboardPress = (item: any) => {
    router.push({
      pathname: "/MoodBoardDetail",
      params: {
        title: item.title,
        style: item.style,
        color: item.color,
        images: JSON.stringify(item.images),
      },
    });
  };

  const handleSuccessStoryPress = (item: any) => {
    router.push({
      pathname: "/SuccessStoryDetail",
      params: {
        name: item.name,
        location: item.location,
        beforeImage: item.beforeImage,
        afterImage: item.afterImage,
        quote: item.quote,
        tips: JSON.stringify(item.tips),
      },
    });
  };

  const handleProTipPress = (item: any) => {
    router.push({
      pathname: "/ProTipDetail",
      params: {
        title: item.title,
        category: item.category,
        color: item.color,
        content: item.content,
        isVideo: item.isVideo.toString(),
        keyPoint: item.keyPoint,
        expertName: item.expertName,
        expertQuote: item.expertQuote,
        expertTitle: item.expertTitle,
      },
    });
  };

  const renderMoodboardItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleMoodboardPress(item)}>
      <Card style={[styles.moodboardCard, { borderLeftColor: item.color }]}>
        <View style={styles.moodboardHeader}>
          <View style={styles.moodboardTitleContainer}>
            <Text style={styles.moodboardIcon}>
              {item.icon || Icons.luxury}
            </Text>
            <Text style={styles.moodboardTitle}>{item.title}</Text>
          </View>
          <Text style={styles.moodboardStyle}>{item.style}</Text>
        </View>
        <View style={styles.moodboardImages}>
          {item.images?.map((image: any, index: any) => (
            <Image
              key={index}
              source={{
                uri: `https://firebasestorage.googleapis.com/v0/b/uzuri-de01c.firebasestorage.app/o/${encodeURIComponent(
                  image
                )}?alt=media`,
              }}
              style={styles.moodboardImage}
            />
          ))}
        </View>
        <Text style={styles.moodboardDetails}>{item.details || ""}</Text>
      </Card>
    </TouchableOpacity>
  );

  const renderSuccessStory = ({ item }: { item: SuccessStory }) => {
    const tips = ensureArray(item.tips);

    return (
      <TouchableOpacity onPress={() => handleSuccessStoryPress(item)}>
        <Card style={styles.storyCard}>
          <LinearGradient
            colors={["#FFF9C4", "#FFFFFF"]}
            style={styles.storyGradient}
          >
            <View style={styles.storyHeader}>
              <Text style={styles.storyName}>{item.name}</Text>
              <Text style={styles.storyLocation}>{item.location}</Text>
            </View>
            <View style={styles.beforeAfterContainer}>
              <View style={styles.imageContainer}>
                <Text style={styles.imageLabel}>Avant</Text>
                <Image
                  source={{ uri: item.beforeImage }}
                  style={styles.beforeAfterImage}
                />
              </View>
              <View style={styles.imageContainer}>
                <Text style={styles.imageLabel}>Après</Text>
                <Image
                  source={{ uri: item.afterImage }}
                  style={styles.beforeAfterImage}
                />
              </View>
            </View>
            <View style={styles.quoteContainer}>
              <Text style={styles.quoteIcon}>{Icons.quote}</Text>
              <Text style={styles.storyQuote}>{item.quote}</Text>
            </View>
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>
                Conseils de {item.name?.split(" ")[0]}:
              </Text>
              {tips.length > 0 ? (
                tips.map((tip, index) => (
                  <Text key={index} style={styles.tip}>
                    • {tip}
                  </Text>
                ))
              ) : (
                <Text style={styles.tip}>Aucun conseil disponible</Text>
              )}
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderProTip = ({ item }: any) => (
    <TouchableOpacity onPress={() => handleProTipPress(item)}>
      <Card style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <CategoryTag
            icon={item.icon || Icons.branding}
            label={item.category}
            color={item.color}
          />
          {item.isVideo && (
            <View style={styles.videoTag}>
              <Text style={styles.videoIcon}>{Icons.video}</Text>
              <Text style={styles.videoLabel}>VIDEO</Text>
            </View>
          )}
        </View>
        <Text style={styles.tipTitle}>{item.title}</Text>
        <Text style={styles.tipContent} numberOfLines={2}>
          {item.content}
        </Text>
        {item.isVideo && (
          <TouchableOpacity style={styles.playButton}>
            <Text style={styles.playIcon}>{Icons.play}</Text>
            <Text style={styles.playText}>Regarder</Text>
          </TouchableOpacity>
        )}
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={{ uri: assets.INSPIRATION_HEADER }}
            style={styles.headerImage}
            blurRadius={2}
          />
          <LinearGradient
            colors={["rgba(192, 38, 211, 0.8)", "rgba(219, 39, 119, 0.8)"]}
            style={styles.headerGradient}
          >
            <Animated.Text
              style={styles.title}
              entering={FadeInRight.delay(900).duration(300).springify()}
            >
              Explore, inspire-toi, et lance-toi !
            </Animated.Text>

            <Animated.Text
              style={styles.subtitle}
              entering={FadeInLeft.delay(900).duration(300).springify()}
            >
              Ressources pour booster ton business de cils
            </Animated.Text>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          {/* <View style={styles.sectionHeader}>
            <Animated.Text
              style={styles.sectionTitle}
              entering={FadeInUp.delay(1000).duration(800).springify()}
            >
              Moodboards de Marque
            </Animated.Text>
            <Text style={styles.sectionSubtitle}>
              Galeries d&apos;inspirations classées par styles
            </Text>
          </View> */}
          {moodboards.length > 0 ? (
            <FlatList
              horizontal
              data={moodboards}
              renderItem={renderMoodboardItem}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.moodboardList}
            />
          ) : (
            <Text style={styles.noDataText}>Aucun moodboard disponible</Text>
          )}
        </View>

        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Success Stories</Text>
            <Text style={styles.sectionSubtitle}>
              Témoignages d&apos;autres Lash Artists
            </Text>
          </View>
          {successStories.length > 0 ? (
            <FlatList
              horizontal
              data={successStories}
              renderItem={renderSuccessStory}
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storyList}
            />
          ) : (
            <Text style={styles.noDataText}>
              Aucune success story disponible
            </Text>
          )}
        </View> */}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Conseils de pro by Uzuri</Text>
            <Text style={styles.sectionSubtitle}>
              Astuces pour développer ton business
            </Text>
          </View>
          {proTips.length > 0 ? (
            <FlatList
              data={proTips}
              renderItem={renderProTip}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noDataText}>Aucun conseil disponible</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    marginBottom: 50,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 180,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  headerGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    marginTop: 8,
    textAlign: "center",
  },
  section: {
    paddingVertical: 15,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  moodboardList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  moodboardCard: {
    width: 250,
    marginRight: 15,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    borderLeftWidth: 5,
    paddingBottom: 15,
  },
  moodboardHeader: {
    padding: 15,
    paddingBottom: 10,
  },
  moodboardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodboardIcon: {
    marginRight: 8,
    fontSize: 16,
  },
  moodboardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  moodboardStyle: {
    fontSize: 12,
    color: "#9d174d",
    marginTop: 5,
  },
  moodboardImages: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  moodboardImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  moodboardDetails: {
    fontSize: 10,
    color: "#888",
    paddingHorizontal: 15,
    paddingTop: 10,
    textAlign: "center",
  },
  storyList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  storyCard: {
    width: 300,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  storyGradient: {
    padding: 15,
  },
  storyHeader: {
    marginBottom: 10,
  },
  storyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  storyLocation: {
    fontSize: 12,
    color: "#888",
  },
  beforeAfterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  imageContainer: {
    width: "48%",
  },
  imageLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 5,
    textAlign: "center",
  },
  beforeAfterImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  quoteContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  quoteIcon: {
    fontSize: 24,
    color: "#7c3aed",
    marginRight: 5,
    lineHeight: 22,
  },
  storyQuote: {
    fontStyle: "italic",
    color: "#7c3aed",
    flex: 1,
  },
  tipsContainer: {
    marginTop: 10,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    padding: 10,
    borderRadius: 8,
  },
  tipsTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#7c3aed",
  },
  tip: {
    fontSize: 12,
    marginLeft: 5,
    marginBottom: 3,
    color: "#555",
  },
  tipCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  tipContent: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  categoryTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryIcon: {
    marginRight: 4,
    fontSize: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  videoTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  videoIcon: {
    marginRight: 4,
    fontSize: 12,
    color: "#EF4444",
  },
  videoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#EF4444",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  playIcon: {
    color: "white",
    marginRight: 5,
  },
  playText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  noDataText: {
    textAlign: "center",
    color: "#666",
    marginTop: 10,
    paddingHorizontal: 20,
  },
});

export default InspirationConseils;
