// components/ProductItem.tsx
import { useAuth } from "@/app/context/AuthContext";
import { firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { ProductType } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface ProductItemProps {
  item: ProductType;
  index?: number; // Made optional
}

const width = Dimensions.get("window").width - 40;

const ProductItem = ({ item, index = 0 }: ProductItemProps) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (user?.uid) {
        const wishlistRef = doc(
          firestore,
          "wishlists",
          user.uid,
          "items",
          item.id
        );
        const docSnap = await getDoc(wishlistRef);
        setIsInWishlist(docSnap.exists());
      }
    };
    checkWishlistStatus();
  }, [user, item.id]);

  const toggleWishlist = async () => {
    if (!user?.uid) {
      // Show alert if user is not logged in
      Alert.alert(
        "Connexion requise",
        "Vous devez être connecté pour ajouter des articles à vos favoris. Voulez-vous vous connecter maintenant?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Se connecter",
            onPress: () => router.push("/signin"),
          },
        ]
      );
      return;
    }

    const wishlistRef = doc(firestore, "wishlists", user.uid, "items", item.id);

    if (isInWishlist) {
      await deleteDoc(wishlistRef);
      setIsInWishlist(false);
    } else {
      await setDoc(wishlistRef, {
        ...item,
        addedAt: new Date().toISOString(),
      });
      setIsInWishlist(true);
    }
  };

  return (
    <Link href={`/product-details/${item.id}`} asChild>
      <TouchableOpacity>
        <Animated.View
          entering={FadeInDown.delay(300 + index * 100)
            .duration(500)
            .springify()}
          style={styles.container}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.images[0] }}
              style={styles.productImage}
            />
            <TouchableOpacity
              style={[
                styles.heartButton,
                {
                  backgroundColor: isInWishlist ? Colors.primary : Colors.white,
                },
              ]}
              onPress={(e) => {
                e.preventDefault();
                toggleWishlist();
              }}
            >
              <Ionicons
                name={isInWishlist ? "heart" : "heart-outline"}
                size={20}
                color={isInWishlist ? Colors.white : Colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 16,
    marginBottom: 16,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    paddingHorizontal: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: Colors.black,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ProductItem;
