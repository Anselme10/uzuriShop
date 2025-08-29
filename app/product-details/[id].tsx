import { firestore } from "@/backend/firebase";
import ImageSlider from "@/components/ImageSlider";
import { Colors } from "@/constants/Colors";
import { ProductType } from "@/types/type";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const headerHeight = useHeaderHeight();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const { user } = useAuth();

  // Convert id to string if it's an array
  const productId = Array.isArray(id) ? id[0] : id;
  //console.log("Id is ", productId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) return;

        const productRef = doc(firestore, "products", productId);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          setProduct({
            id: productSnap.id,
            ...productSnap.data(),
          } as ProductType);
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        Alert.alert("Error", "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const createOrder = async () => {
    if (!product || !user?.uid) return;

    setOrderLoading(true);
    try {
      const ordersRef = collection(firestore, "orders");

      const newOrder = {
        userId: user.uid,
        productId: product.id,
        productName: product.title,
        productImage: product.images[0], // Use first image
        quantity: 1,
        price: product.price,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        shippingAddress: null, // Can be added later
        paymentMethod: null, // Can be added later
        progress: 2,
      };

      const docRef = await addDoc(ordersRef, newOrder);
      console.log("Order created with ID: ", docRef.id);

      Alert.alert(
        "Commande passée",
        "Votre commande a été passée avec succès!",
        [{ text: "OK", onPress: () => router.push("/(tabs)") }]
      );

      // You can also send a notification or update user's order history here
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Error", "Failed to create order. Please try again.");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to place an order",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push("/signin") },
        ]
      );
      return;
    }

    Alert.alert(
      "Confirmez la commande",
      `Êtes-vous sûr de vouloir acheter ${product?.title} pour $${product?.price}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Acheter Maintenant",
          onPress: createOrder,
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Product not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Détails du Produit",
          headerTransparent: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/cart")}>
              <Ionicons name="cart-outline" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={{ marginBottom: 60, marginTop: headerHeight }}>
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <ImageSlider imageList={product.images} />
        </Animated.View>
        <View style={styles.container}>
          {/* <Animated.View
            entering={FadeInRight.delay(500).duration(300).springify()}
            style={styles.ratingWrapper}
          >
            <View style={styles.ratingWrapper}>
              <Ionicons name="star" size={18} color="#D4AF37" />
              <Text style={styles.rating}>
                4.7 <Text>(136)</Text>
              </Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={20} color={Colors.black} />
            </TouchableOpacity>
          </Animated.View> */}
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.priceWraper}>
            <Text style={styles.price}>${product.price}</Text>
            {/* <View style={styles.priceDiscount}>
              <Text style={styles.priceDiscountText}>6% Off</Text>
            </View>
            <Text style={styles.oldPrice}>{product.price + 2}</Text> */}
          </View>
          <Animated.View
            entering={FadeInUp.delay(1100).duration(500).springify()}
          >
            <Text style={styles.description}>{product.description}</Text>
          </Animated.View>
        </View>
      </ScrollView>
      <Animated.View
        entering={FadeInUp.delay(900).duration(500).springify()}
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <TouchableOpacity
          style={styles.buyButton}
          onPress={handleBuyNow}
          disabled={orderLoading}
        >
          {orderLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buyButtonText}>Acheter Maintenant</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 18,
    color: Colors.black,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  rating: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "400",
    color: Colors.gray,
  },
  title: {
    fontSize: 20,
    fontWeight: "400",
    color: Colors.black,
    letterSpacing: 0.6,
    lineHeight: 32,
  },
  priceWraper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
  },
  priceDiscount: {
    backgroundColor: Colors.extraLightGray,
    padding: 5,
    borderRadius: 6,
  },
  priceDiscountText: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.primary,
  },
  oldPrice: {
    fontSize: 16,
    fontWeight: "400",
    textDecorationLine: "line-through",
    color: Colors.gray,
  },
  description: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "400",
    color: Colors.black,
    letterSpacing: 0.6,
    lineHeight: 24,
  },
  buyButton: {
    position: "absolute",
    width: 200,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  buyButtonText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: "700",
  },
});

export default ProductDetails;
