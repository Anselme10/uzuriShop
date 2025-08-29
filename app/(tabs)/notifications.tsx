// NotificationScreen.tsx
import { auth, firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: Timestamp;
  icon: string;
}

// const notifications: Notification[] = [
//   {
//     id: "1",
//     title: "Order Placed",
//     description: "Your order has been successfully placed.",
//     time: "3 hours ago",
//     icon: "bell",
//   },
//   {
//     id: "2",
//     title: "Payment Received",
//     description: "Your payment has been successfully received.",
//     time: "4 hours ago",
//     icon: "dollar-sign",
//   },
//   {
//     id: "3",
//     title: "Order Delivered",
//     description: "Your order has been successfully delivered.",
//     time: "2 days ago",
//     icon: "truck",
//   },
//   {
//     id: "4",
//     title: "Order Cancelled",
//     description: "Your order has been successfully cancelled.",
//     time: "5 days ago",
//     icon: "x-circle",
//   },
//   {
//     id: "5",
//     title: "Order Shipped",
//     description: "Your order has been successfully shipped.",
//     time: "1 week ago",
//     icon: "box",
//   },
// ];

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(firestore, "notifications"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);
      const fetchedNotifications: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      setNotifications(fetchedNotifications);
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.card}>
      <Ionicons
        name={item.icon}
        size={20}
        color={Colors.primary}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Text style={styles.time}> {item.time.toDate().toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.black,
    marginBottom: 20,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
    marginTop: 3,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.black,
    fontWeight: "600",
    fontSize: 16,
  },
  description: {
    color: Colors.gray,
    marginTop: 2,
    fontSize: 13,
  },
  time: {
    color: Colors.lightGray,
    fontSize: 12,
    marginLeft: 5,
    marginTop: 2,
  },
});
