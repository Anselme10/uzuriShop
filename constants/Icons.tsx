import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet } from "react-native";

interface IconProps {
  color: string;
  avatar?: string; // Optional prop for the profile image
}

export const icon = {
  index: ({ color }: IconProps) => (
    <Ionicons name="home-outline" size={22} color={color} />
  ),
  cart: ({ color }: IconProps) => (
    <Ionicons name="cart-outline" size={22} color={color} />
  ),
  explore: ({ color }: IconProps) => (
    <Ionicons name="search-outline" size={22} color={color} />
  ),
  profile: ({ color, avatar }: IconProps) =>
    avatar ? (
      <Image source={{ uri: avatar }} style={styles.userImage} />
    ) : (
      <Ionicons name="person-outline" size={22} color={color} />
    ),
  notifications: ({ color }: IconProps) => (
    <Ionicons name="notifications-outline" size={22} color={color} />
  ),
};

const styles = StyleSheet.create({
  userImage: {
    height: 24,
    width: 24,
    borderRadius: 12, // Half of height/width to make it circular
    borderWidth: 1,
    borderColor: "#e0e0e0", // Light gray border
  },
});
