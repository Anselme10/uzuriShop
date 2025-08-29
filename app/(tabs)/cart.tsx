import { firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  productId: string;
}

const CartScreen = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Real-time cart listener
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const cartRef = collection(firestore, "carts", user.uid, "items");
    const unsubscribe = onSnapshot(
      cartRef,
      (snapshot) => {
        const items: CartItem[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CartItem[];
        setCartItems(items);
        setLoading(false);
      },
      (err) => {
        setError("Failed to load cart items");
        setLoading(false);
        console.error("Cart snapshot error:", err);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const updateQuantity = async (id: string, delta: number) => {
    try {
      if (!user?.uid) return;

      const item = cartItems.find((item) => item.id === id);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      await updateDoc(doc(firestore, "carts", user.uid, "items", id), {
        quantity: newQuantity,
      });
    } catch (err) {
      setError("Failed to update quantity");
      console.error("Update quantity error:", err);
    }
  };

  const removeItem = async (id: string) => {
    try {
      if (!user?.uid) return;

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await deleteDoc(doc(firestore, "carts", user.uid, "items", id));
    } catch (err) {
      setError("Failed to remove item");
      console.error("Remove item error:", err);
    }
  };

  const generateOrderSummary = () => {
    let summary = "Hello! I would like to place an order:\n\n";

    cartItems.forEach((item, index) => {
      summary += `${index + 1}. ${item.title} (Qty: ${item.quantity}) - $${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });

    summary += `\nTotal: $${total.toFixed(2)}\n`;
    summary += `\nMy details:\nName: ${
      user?.displayName || "Not provided"
    }\nEmail: ${user?.email || "Not provided"}`;

    return encodeURIComponent(summary);
  };

  const openWhatsApp = async () => {
    const phoneNumber = "12033900003";
    const message = generateOrderSummary();
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on your device");
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      Alert.alert("Error", "Failed to open WhatsApp");
    }
  };

  const handleCheckout = async () => {
    if (!user?.uid || cartItems.length === 0) return;

    setCheckoutLoading(true);
    try {
      // Create a batch for atomic operations
      const batch = writeBatch(firestore);
      const cartRef = collection(firestore, "carts", user.uid, "items");

      // Create order in 'orders' collection
      const orderRef = doc(collection(firestore, "users", user.uid, "orders"));
      batch.set(orderRef, {
        items: cartItems,
        total: total,
        createdAt: new Date(),
        status: "pending", // Changed from "processing" to "pending" until WhatsApp confirmation
      });

      // Clear the cart
      cartItems.forEach((item) => {
        batch.delete(doc(cartRef, item.id));
      });

      await batch.commit();

      // Open WhatsApp after successful order creation
      await openWhatsApp();
    } catch (err) {
      setError("Checkout failed");
      console.error("Checkout error:", err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Calculate total
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => setError("")}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons
          name="remove-shopping-cart"
          size={60}
          color={Colors.gray}
        />
        <Text style={styles.emptyText}>Votre panier est vide.</Text>
        <Link href={"/EcommeScreen"} asChild>
          <TouchableOpacity style={styles.continueShoppingBtn}>
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                {item.title}
              </Text>
              <Text style={styles.price}>{item.price.toFixed(2)} $</Text>

              <View style={styles.quantityContainer}>
                <View style={styles.quantity}>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <MaterialIcons
                      name="remove-circle-outline"
                      size={24}
                      color={item.quantity <= 1 ? Colors.gray : Colors.primary}
                    />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                    <MaterialIcons
                      name="add-circle-outline"
                      size={24}
                      color={Colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeItem(item.id)}
                >
                  <MaterialIcons
                    name="delete-outline"
                    size={24}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={<View style={styles.footerSpacer} />}
      />

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{total.toFixed(2)} $</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, checkoutLoading && styles.disabledBtn]}
          onPress={handleCheckout}
          disabled={checkoutLoading}
        >
          {checkoutLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.checkoutText}>Payer</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: Colors.primary,
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  retryText: {
    color: Colors.primary,
    fontSize: 16,
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.gray,
    marginVertical: 16,
  },
  continueShoppingBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 120,
  },
  footerSpacer: {
    height: 20,
  },
  item: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: "contain",
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
    maxWidth: "90%",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    marginVertical: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 16,
    marginHorizontal: 12,
    color: Colors.black,
    minWidth: 20,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.extraLightGray,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    color: Colors.gray,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledBtn: {
    opacity: 0.7,
  },
  checkoutText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CartScreen;
