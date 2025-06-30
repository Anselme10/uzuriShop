import { firestore } from "@/backend/firebase";
import { TabBar } from "@/components/TabBar";
import { Tabs } from "expo-router";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

//import { useAuth } from "../context/AuthContext";

export default function TabLayout() {
  const { user, loading } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Listen to cart items count changes
  useEffect(() => {
    if (!user?.uid) {
      setCartItemCount(0);
      return;
    }

    const cartRef = collection(firestore, "carts", user.uid, "items");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      setCartItemCount(snapshot.size); // Update count based on number of documents
    });

    return () => unsubscribe(); // Clean up listener
  }, [user?.uid]);

  // 🚨 Redirect to root if user is not logged in
  // useEffect(() => {
  //   if (!loading && !user) {
  //     router.replace("/");
  //   }
  // }, [user, loading]);

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notification",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
