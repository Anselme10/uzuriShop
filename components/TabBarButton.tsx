import { useAuth } from "@/app/context/AuthContext";
import { firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { icon } from "@/constants/Icons";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RouteName = "index" | "cart" | "profile" | "notifications";

type Props = {
  onPress: () => void;
  onLongPress: () => void;
  isFocused: boolean;
  label: string;
  routeName: RouteName;
};

const TabBarButton = ({
  onPress,
  onLongPress,
  isFocused,
  label,
  routeName,
}: Props) => {
  const { user } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    if (!user?.uid || routeName !== "cart") return;

    const cartRef = collection(firestore, "carts", user.uid, "items");
    const unsubscribe = onSnapshot(cartRef, (snapshot) => {
      setCartItemCount(snapshot.size);
    });

    return unsubscribe;
  }, [user?.uid, routeName]);

  const IconComponent = icon[routeName];
  const iconColor = isFocused ? Colors.primary : Colors.black;
  const textStyle = {
    color: isFocused ? Colors.primary : Colors.black,
    fontSize: 12,
  };

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarButton}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
    >
      <View style={styles.iconContainer}>
        <IconComponent color={iconColor} />
        {routeName === "cart" && cartItemCount > 0 && (
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeText}>
              {cartItemCount > 9 ? "9+" : cartItemCount}
            </Text>
          </View>
        )}
      </View>
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabBarButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    paddingVertical: 8,
  },
  iconContainer: {
    position: "relative",
  },
  badgeWrapper: {
    position: "absolute",
    backgroundColor: Colors.highlight,
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  badgeText: {
    color: Colors.black,
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
});
