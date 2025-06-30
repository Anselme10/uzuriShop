import { firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import {
  collection,
  onSnapshot,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "./context/AuthContext";

interface Order {
  id: string;
  billingAddress: { [key: string]: any };
  createdAt: Timestamp;
  deliveryDate: Timestamp | null;
  estimatedDelivery: Timestamp;
  items: {
    image: string;
    name: string;
    price: number;
    productId: string;
    quantity: number;
    variant: string;
  }[];
  paymentMethod: string;
  progress: number;
  shippingFee: number;
  shippingMethod: string;
  status: string;
  subtotal: number;
  trackingNumber: string;
  userId: string;
  total: number;
}

const CommandesScreen = () => {
  const [activeTab, setActiveTab] = useState("En cours");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const ordersQuery = query(
      collection(firestore, "orders"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const ordersData: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "Tous") return true;
    if (activeTab === "En cours") return order.progress < 3;
    if (activeTab === "Terminés") return order.progress >= 3;
    return false;
  });

  const gotToContact = () => {
    router.push("/HelpCenter");
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() =>
        setExpandedOrder(expandedOrder === item.id ? null : item.id)
      }
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Commande #{item.id.slice(0, 6)}</Text>
        <Text style={styles.orderDate}>
          {item.createdAt.toDate().toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(item.progress / 3) * 100}%` },
            ]}
          />
        </View>
        <View style={styles.progressLabels}>
          <Text
            style={[
              styles.progressLabel,
              item.progress >= 1 && styles.activeProgress,
            ]}
          >
            Préparation
          </Text>
          <Text
            style={[
              styles.progressLabel,
              item.progress >= 2 && styles.activeProgress,
            ]}
          >
            Expédié
          </Text>
          <Text
            style={[
              styles.progressLabel,
              item.progress >= 3 && styles.activeProgress,
            ]}
          >
            Livré
          </Text>
        </View>
        <Text
          style={[
            styles.statusText,
            item.status === "En préparation" && styles.preparing,
            item.status === "Expédié" && styles.shipped,
            item.status === "Livré" && styles.delivered,
            item.status === "En cours" && styles.preparing, // Added this line
          ]}
        >
          {item.status}
        </Text>
      </View>

      {expandedOrder === item.id && (
        <View style={styles.orderDetails}>
          <Text style={styles.detailTitle}>Articles ({item.items.length})</Text>
          {item.items.map((product, index) => (
            <View key={index} style={styles.productItem}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productMeta}>
                  {product.quantity} x ${product.price.toFixed(2)}
                </Text>
              </View>
            </View>
          ))}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>${item.total.toFixed(2)}</Text>
          </View>

          {item.trackingNumber && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Numéro de suivi</Text>
              <Text style={styles.summaryValue}>{item.trackingNumber}</Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Livraison estimée</Text>
            <Text style={styles.summaryValue}>
              {item.estimatedDelivery.toDate().toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity style={styles.trackButton}>
            <Ionicons name="location" size={18} color="#F12498" />
            <Text style={styles.trackButtonText}>Suivre le colis</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Suivre Ma Commande",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container}>
        {/* Header */}
        <LinearGradient colors={["#F12498", "#FF6B9E"]} style={styles.header}>
          <Text style={styles.headerTitle}>Suivre Mes Commandes</Text>
          <Text style={styles.headerSubtitle}>
            Vos achats Uzuri en un seul endroit
          </Text>
        </LinearGradient>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "En cours" && styles.activeTab]}
            onPress={() => setActiveTab("En cours")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "En cours" && styles.activeTabText,
              ]}
            >
              En cours
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Terminés" && styles.activeTab]}
            onPress={() => setActiveTab("Terminés")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Terminés" && styles.activeTabText,
              ]}
            >
              Terminés
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Tous" && styles.activeTab]}
            onPress={() => setActiveTab("Tous")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Tous" && styles.activeTabText,
              ]}
            >
              Tout
            </Text>
          </TouchableOpacity>
        </View>

        {/* Order List */}
        {filteredOrders.length > 0 ? (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.ordersContainer}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cube" size={48} color="#DDD" />
            <Text style={styles.emptyText}>
              Aucune commande{" "}
              {activeTab === "En cours" ? "en cours" : "terminée"}
            </Text>
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpCard}>
          <Ionicons name="help-circle" size={24} color="#F12498" />
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>Besoin d&apos;aide ?</Text>
            <Text style={styles.helpSubtitle}>
              Contactez notre service client
            </Text>
          </View>
          <TouchableOpacity style={styles.helpButton} onPress={gotToContact}>
            <Text style={styles.helpButtonText}>Nous contacter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    marginBottom: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  header: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFF",
    opacity: 0.9,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#FFF",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#F12498",
  },
  tabText: {
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#F12498",
    fontWeight: "600",
  },
  ordersContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderId: {
    fontWeight: "bold",
    color: "#333",
  },
  orderDate: {
    color: "#666",
  },
  statusContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#EEE",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F12498",
    borderRadius: 2,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "#999",
  },
  activeProgress: {
    color: "#F12498",
    fontWeight: "500",
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  preparing: {
    color: "#FF9500",
  },
  shipped: {
    color: "#007AFF",
  },
  delivered: {
    color: "#34C759",
  },
  orderDetails: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    paddingTop: 16,
  },
  detailTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#EEE",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    fontWeight: "500",
    marginBottom: 4,
  },
  productMeta: {
    color: "#666",
    fontSize: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    color: "#666",
  },
  summaryValue: {
    fontWeight: "500",
  },
  trackButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F12498",
    borderRadius: 8,
    padding: 10,
    marginTop: 16,
  },
  trackButtonText: {
    color: "#F12498",
    fontWeight: "500",
    marginLeft: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    color: "#999",
    marginTop: 16,
  },
  helpCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  helpTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  helpTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  helpSubtitle: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  helpButton: {
    backgroundColor: "#F12498",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  helpButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default CommandesScreen;
