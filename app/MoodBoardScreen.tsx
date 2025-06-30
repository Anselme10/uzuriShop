import { firestore } from "@/backend/firebase"; // Adjust import path as needed
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const MoodboardScreen = () => {
  const navigation = useNavigation();
  const [mockImages, setMockImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log("1111111111");
  useEffect(() => {
    const fetchMockImages = async () => {
      try {
        const docRef = doc(firestore, "moodboards", "mockImagesDoc");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.mockImages && Array.isArray(data.mockImages)) {
            setMockImages(data.mockImages);
          } else {
            setError("No mockImages array found in document");
          }
        } else {
          setError("Document not found");
        }
      } catch (err) {
        setError("Failed to fetch images");
        console.error("Error fetching mock images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMockImages();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FFAFBD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#FFC3A0", "#FFAFBD"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Moodboard</Text>
      </LinearGradient>

      {/* Gallery Grid */}
      {mockImages.length > 0 ? (
        <FlatList
          data={mockImages}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item }} style={styles.image} />
            </View>
          )}
        />
      ) : (
        <View style={[styles.center, { flex: 1 }]}>
          <Text style={styles.emptyText}>No images found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  backIcon: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  grid: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f4f4f4",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: (width - 40) / 2,
    height: 200,
    resizeMode: "cover",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
});

export default MoodboardScreen;
