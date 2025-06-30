import { auth, firestore } from "@/backend/firebase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Order {
  id: string;
  date: Date;
  status: string;
  items: { name: string; image: string }[];
  total: number;
}

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  images: string[];
  addedAt?: string;
}

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const EcommerceProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("Orders");
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    rewards: 0,
  });
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user is signed in
  useEffect(() => {
    if (!auth.currentUser) {
      Alert.alert(
        "Authentification requise",
        "Veuillez vous connecter pour accéder à votre profil",
        [
          {
            text: "Se connecter",
            onPress: () => router.replace("/signin"),
          },
          {
            text: "Cancel",
            onPress: () => router.back(),
            style: "cancel",
          },
        ]
      );
    }
  }, []);

  // Fetch user data
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(
          doc(firestore, "users", auth.currentUser!.uid)
        );
        if (userDoc.exists()) {
          setUser({
            id: userDoc.id,
            ...userDoc.data(),
            avatar: userDoc.data().avatar || "https://i.imgur.com/8Km9T0d.jpg",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch orders
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const ordersQuery = query(
      collection(firestore, "orders"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        date: doc.data().createdAt.toDate(),
        status: doc.data().status || "Processing",
        items: doc.data().items || [],
        total: doc.data().total || 0,
      }));
      setOrders(ordersData);
      setStats((prev) => ({ ...prev, orders: ordersData.length }));
      if (loading) setLoading(false);
    });

    return () => unsubscribeOrders();
  }, []);

  // Fetch wishlist
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const wishlistRef = collection(
      firestore,
      "wishlists",
      auth.currentUser.uid,
      "items"
    );

    const unsubscribeWishlist = onSnapshot(wishlistRef, (snapshot) => {
      const wishlistData: WishlistItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        price: doc.data().price,
        images: doc.data().images,
        addedAt: doc.data().addedAt,
      }));
      setWishlist(wishlistData);
      setStats((prev) => ({ ...prev, wishlist: wishlistData.length }));
    });

    return () => unsubscribeWishlist();
  }, []);

  const handleSignOut = async () => {
    Alert.alert(
      "Se déconnecter",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Se déconnecter",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/home");
            } catch (error) {
              console.error("Sign out error:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer définitivement votre compte ? Cette action est irréversible et supprimera toutes vos données.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const user = auth.currentUser;
            if (!user || !user.email) {
              Alert.alert("Erreur", "Aucun utilisateur connecté");
              return;
            }
            setIsDeleteModalVisible(true);
          },
        },
      ]
    );
  };

  const confirmAccountDeletion = async () => {
    if (!password) {
      Alert.alert("Erreur", "Le mot de passe est requis");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      Alert.alert("Erreur", "Aucun utilisateur connecté");
      return;
    }

    try {
      setIsProcessing(true);

      // Create credentials for re-authentication
      const credential = EmailAuthProvider.credential(user.email, password);

      // Re-authenticate user
      await reauthenticateWithCredential(user, credential);

      // Delete user data from Firestore in a batch
      const batch = writeBatch(firestore);

      // Delete user document
      batch.delete(doc(firestore, "users", user.uid));

      // Delete wishlist collection
      const wishlistItems = await getDocs(
        collection(firestore, "wishlists", user.uid, "items")
      );
      wishlistItems.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Delete cart items
      const cartItems = await getDocs(
        collection(firestore, "carts", user.uid, "items")
      );
      cartItems.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Commit all deletions
      await batch.commit();

      // Delete the user account
      await deleteUser(user);

      // Reset state and navigate
      setPassword("");
      setIsDeleteModalVisible(false);
      setIsProcessing(false);

      // Navigate to sign in screen
      router.replace("/signin");

      Alert.alert(
        "Compte supprimé",
        "Votre compte a été supprimé avec succès."
      );
    } catch (error: any) {
      setIsProcessing(false);
      console.error("Error during deletion:", error);

      let errorMessage =
        "Une erreur s'est produite lors de la suppression du compte.";

      if (error.code === "auth/wrong-password") {
        errorMessage = "Mot de passe incorrect. Veuillez réessayer.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
      }

      Alert.alert("Erreur", errorMessage);
    }
  };

  const gotToSetting = () => {
    if (!auth.currentUser) {
      Alert.alert("Please sign in to access settings");
      return;
    }
    router.push("/AccountSettings");
  };

  const gotToHelp = () => {
    router.push("/HelpCenter");
  };

  const gotToCgu = () => {
    router.push("/Cgu");
  };

  const removeFromWishlist = async (itemId: string) => {
    if (!auth.currentUser?.uid) {
      Alert.alert("Please sign in to manage your wishlist");
      return;
    }

    try {
      const wishlistRef = doc(
        firestore,
        "wishlists",
        auth.currentUser.uid,
        "items",
        itemId
      );
      await deleteDoc(wishlistRef);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Alert.alert(
        "Error",
        "Impossible de supprimer l'article de la liste de souhaits"
      );
    }
  };

  const addToCart = async (item: WishlistItem) => {
    if (!auth.currentUser?.uid) {
      Alert.alert(
        "Veuillez vous connecter pour ajouter des articles au panier"
      );
      return;
    }

    try {
      const cartRef = doc(
        firestore,
        "carts",
        auth.currentUser.uid,
        "items",
        item.id
      );

      const cartItem: CartItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.images[0],
        quantity: 1,
      };

      await setDoc(cartRef, cartItem);
      Alert.alert("Success", "Produit ajouté au panier");
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Impossible d'ajouter l'article au panier");
    }
  };

  const menuItems = [
    { icon: "person", name: "Paramètre", action: gotToSetting },
    { icon: "card-giftcard", name: "CGU", action: gotToCgu },
    { icon: "help", name: "Centre d'aide", action: gotToHelp },
    {
      icon: "delete",
      name: "Supprimer le compte",
      action: handleDeleteAccount,
    },
    { icon: "logout", name: "Se déconnecter", action: handleSignOut },
  ];

  if (!auth.currentUser) {
    return (
      <View style={styles.notSignedInContainer}>
        <Text style={styles.notSignedInText}>
          Please sign in to view your profile
        </Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.replace("/signin")}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F12498" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <LinearGradient colors={["#F12498", "#FF6B9E"]} style={styles.header}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || "Guest User"}</Text>
            <Text style={styles.email}>{user?.email || ""}</Text>
            <View style={styles.membershipBadge}>
              <Text style={styles.membershipText}>
                {user?.membership || "Membre Standard"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Bar */}
      <View style={styles.statsContainer}>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>{stats.orders}</Text>
          <Text style={styles.statLabel}>Commandes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>{stats.wishlist}</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statItem}>
          <Text style={styles.statValue}>{stats.rewards}</Text>
          <Text style={styles.statLabel}>Rewards</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Orders" && styles.activeTab]}
          onPress={() => setActiveTab("Orders")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Orders" && styles.activeTabText,
            ]}
          >
            Mes commandes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Wishlist" && styles.activeTab]}
          onPress={() => setActiveTab("Wishlist")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Wishlist" && styles.activeTabText,
            ]}
          >
            Wishlist
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {activeTab === "Orders" ? (
        <View style={styles.contentContainer}>
          {orders.length === 0 ? (
            <Text style={styles.emptyText}>Aucune commande trouvée</Text>
          ) : (
            orders.map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <Text style={styles.orderId}>
                    Commande #{order.id.slice(0, 6)}
                  </Text>
                  <Text style={styles.orderDate}>
                    {order.date.toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.orderStatus}>
                  <Ionicons
                    name={
                      order.status === "Delivered" ? "checkmark-circle" : "time"
                    }
                    size={16}
                    color={order.status === "Delivered" ? "#34C759" : "#FF9500"}
                  />
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
                <View style={styles.orderItems}>
                  {order.items.slice(0, 3).map((item, index) => (
                    <Image
                      key={index}
                      source={{ uri: item.image }}
                      style={styles.orderItemImage}
                    />
                  ))}
                  {order.items.length > 3 && (
                    <View style={styles.moreItems}>
                      <Text>+{order.items.length - 3}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.orderFooter}>
                  <Text style={styles.itemsCount}>
                    {order.items.length}{" "}
                    {order.items.length > 1 ? "items" : "item"}
                  </Text>
                  <Text style={styles.orderTotal}>
                    ${order.total.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      ) : (
        <View style={styles.wishlistContainer}>
          {wishlist.length === 0 ? (
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
          ) : (
            wishlist.map((item) => (
              <View key={item.id} style={styles.wishlistItem}>
                <Image
                  source={{ uri: item.images[0] }}
                  style={styles.wishlistImage}
                />
                <View style={styles.wishlistInfo}>
                  <Text style={styles.wishlistName}>{item.title}</Text>
                  <Text style={styles.wishlistPrice}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.wishlistActions}>
                  <TouchableOpacity
                    style={[styles.wishlistButton, styles.addToCartButton]}
                    onPress={() => addToCart(item)}
                  >
                    <Ionicons name="cart-outline" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.wishlistButton, styles.removeButton]}
                    onPress={() => removeFromWishlist(item.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Account Menu */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Compte</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              item.name === "Supprimer le compte" && styles.deleteMenuItem,
            ]}
            onPress={item.action || (() => {})}
          >
            <MaterialIcons
              name={item.icon}
              size={24}
              color={
                item.name === "Supprimer le compte" ? "#FF3B30" : "#F12498"
              }
            />
            <Text
              style={[
                styles.menuText,
                item.name === "Supprimer le compte" && styles.deleteMenuText,
              ]}
            >
              {item.name}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Password Confirmation Modal */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmation requise</Text>
            <Text style={styles.modalText}>
              Pour supprimer votre compte, veuillez entrer votre mot de passe
            </Text>

            <TextInput
              style={styles.passwordInput}
              placeholder="Mot de passe"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setPassword("");
                  setIsDeleteModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmAccountDeletion}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirmer</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  notSignedInContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  notSignedInText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  signInButton: {
    backgroundColor: "#F12498",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  email: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  membershipBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  membershipText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F12498",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 24,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#F12498",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#F12498",
    fontWeight: "600",
  },
  contentContainer: {
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "bold",
    color: "#333",
  },
  orderDate: {
    color: "#666",
    fontSize: 12,
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  orderItems: {
    flexDirection: "row",
    marginBottom: 12,
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  moreItems: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 12,
  },
  itemsCount: {
    color: "#666",
    fontSize: 14,
  },
  orderTotal: {
    fontWeight: "bold",
    color: "#333",
  },
  wishlistContainer: {
    padding: 16,
  },
  wishlistItem: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wishlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  wishlistInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  wishlistName: {
    fontWeight: "500",
    color: "#333",
  },
  wishlistPrice: {
    color: "#F12498",
    fontWeight: "bold",
    marginTop: 4,
  },
  wishlistActions: {
    flexDirection: "row",
    gap: 8,
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addToCartButton: {
    backgroundColor: "#F12498",
  },
  removeButton: {
    backgroundColor: "#FF3B30",
  },
  menuContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: "#FFF",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    color: "#333",
  },
  deleteMenuItem: {
    borderBottomColor: "#FFEBEE",
  },
  deleteMenuText: {
    color: "#FF3B30",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: "#666",
  },
  passwordInput: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#EEE",
  },
  confirmButton: {
    backgroundColor: "#F12498",
  },
  cancelButtonText: {
    color: "#333",
  },
  confirmButtonText: {
    color: "white",
  },
});

export default EcommerceProfileScreen;
