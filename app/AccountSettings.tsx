import { auth, firestore, storage } from "@/backend/firebase";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type NotificationTypes = "promotions" | "orderUpdates" | "stockAlerts";

interface Notifications {
  promotions: boolean;
  orderUpdates: boolean;
  stockAlerts: boolean;
}

const AccountSettingsScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [notifications, setNotifications] = useState<Notifications>({
    promotions: true,
    orderUpdates: true,
    stockAlerts: true,
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch user data
  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(
          doc(firestore, "users", auth.currentUser!.uid)
        );
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            id: userDoc.id,
            ...userData,
            avatar: userData.avatar || "https://i.imgur.com/8Km9T0d.jpg",
          });
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
          });
          setNotifications({
            promotions: userData.notifications?.promotions ?? true,
            orderUpdates: userData.notifications?.orderUpdates ?? true,
            stockAlerts: userData.notifications?.stockAlerts ?? true,
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangeAvatar = async () => {
    console.log("0 - Start");

    try {
      // Request permissions
      console.log("1 - Requesting permissions");
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        console.log("2 - Permissions not granted");
        Alert.alert(
          "Permission required",
          "We need access to your photos to change your avatar"
        );
        return;
      }

      console.log("3 - Launching image picker");
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      console.log("4 - Picker result:", pickerResult);
      if (
        pickerResult.canceled ||
        !pickerResult.assets ||
        pickerResult.assets.length === 0
      ) {
        console.log("5 - Picker canceled or no assets");
        return;
      }

      console.log("6 - Starting upload process");
      setUploading(true);

      // Image manipulation with new API
      console.log("7 - Starting image manipulation");
      const manipResult = await ImageManipulator.manipulateAsync(
        pickerResult.assets[0].uri,
        [{ resize: { width: 400, height: 400 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: false,
        }
      );
      console.log("8 - Image manipulation complete:", manipResult);

      console.log("9 - Fetching manipulated image");
      const response = await fetch(manipResult.uri);
      if (!response.ok) throw new Error("Failed to fetch image");

      console.log("10 - Creating blob");
      const blob = await response.blob();

      console.log("11 - Getting user ID");
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("No authenticated user");

      console.log("12 - Creating storage reference");
      const storageRef = ref(storage, `avatars/${uid}`);

      console.log("13 - Uploading to storage");
      await uploadBytes(storageRef, blob);

      console.log("14 - Getting download URL");
      const downloadURL = await getDownloadURL(storageRef);

      console.log("15 - Updating Firestore");
      await updateDoc(doc(firestore, "users", uid), {
        avatar: downloadURL,
      });

      console.log("16 - Updating local state");
      setUser((prev: any) => ({ ...prev, avatar: downloadURL }));

      console.log("17 - Showing success alert");
      Alert.alert("Success", "Your avatar has been updated");
    } catch (error) {
      console.error("Avatar upload error:", error);
      Alert.alert("Error", "Failed to update avatar. Please try again.");
    } finally {
      console.log("18 - Upload complete (success or failure)");
      setUploading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    if (!auth.currentUser?.uid) return;

    try {
      await updateDoc(doc(firestore, "users", auth.currentUser.uid), {
        name: formData.name,
        phone: formData.phone,
        notifications: {
          promotions: notifications.promotions,
          orderUpdates: notifications.orderUpdates,
          stockAlerts: notifications.stockAlerts,
        },
        updatedAt: new Date(),
      });

      setUser({ ...user, name: formData.name, phone: formData.phone });
      setEditing(false);
      Alert.alert("Success", "Your profile has been updated");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const toggleNotification = (type: NotificationTypes) => {
    setNotifications({
      ...notifications,
      [type]: !notifications[type],
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F12498" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      {/* Header */}
      <LinearGradient colors={["#F12498", "#FF6B9E"]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Paramètres</Text>
          {editing ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                onPress={() => setEditing(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={styles.editButton}
            >
              <Feather name="edit" size={20} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Profile Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations de profile</Text>
          <MaterialIcons name="person" size={24} color="#F12498" />
        </View>

        {/* <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            {editing && (
              <TouchableOpacity
                style={styles.avatarEditButton}
                onPress={handleChangeAvatar}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Ionicons name="camera" size={20} color="#FFF" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View> */}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom Complet</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Enter your name"
            />
          ) : (
            <Text style={styles.value}>{user?.name || "Not provided"}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || "Not provided"}</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Telephone</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{user?.phone || "Not provided"}</Text>
          )}
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          <MaterialIcons name="notifications" size={24} color="#F12498" />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Ionicons name="megaphone" size={20} color="#F12498" />
            <Text style={styles.notificationText}>Promotions & Offers</Text>
          </View>
          <Switch
            value={notifications.promotions}
            onValueChange={() => toggleNotification("promotions")}
            thumbColor="#FFF"
            trackColor={{ false: "#DDD", true: "#F12498" }}
          />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Ionicons name="cart" size={20} color="#F12498" />
            <Text style={styles.notificationText}>Order Updates</Text>
          </View>
          <Switch
            value={notifications.orderUpdates}
            onValueChange={() => toggleNotification("orderUpdates")}
            thumbColor="#FFF"
            trackColor={{ false: "#DDD", true: "#F12498" }}
          />
        </View>

        <View style={styles.notificationItem}>
          <View style={styles.notificationInfo}>
            <Ionicons name="alert-circle" size={20} color="#F12498" />
            <Text style={styles.notificationText}>Stock Alerts</Text>
          </View>
          <Switch
            value={notifications.stockAlerts}
            onValueChange={() => toggleNotification("stockAlerts")}
            thumbColor="#FFF"
            trackColor={{ false: "#DDD", true: "#F12498" }}
          />
        </View>
      </View>

      {/* Security Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security</Text>
          <MaterialIcons name="security" size={24} color="#F12498" />
        </View>

        <TouchableOpacity style={styles.securityItem}>
          <View style={styles.securityInfo}>
            <Ionicons name="lock-closed" size={20} color="#F12498" />
            <Text style={styles.securityText}>Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.securityItem}>
          <View style={styles.securityInfo}>
            <Ionicons name="finger-print" size={20} color="#F12498" />
            <Text style={styles.securityText}>Biometric Login</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity> */}
      </View>

      {/* Danger Zone */}
      {/* <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, styles.dangerTitle]}>
            Danger Zone
          </Text>
          <MaterialIcons name="warning" size={24} color="#FF3B30" />
        </View>

        <TouchableOpacity style={styles.dangerItem}>
          <View style={styles.dangerInfo}>
            <Ionicons name="trash" size={20} color="#FF3B30" />
            <Text style={styles.dangerText}>Delete Account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFF",
  },
  saveButtonText: {
    color: "#F12498",
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    margin: 16,
    padding: 16,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dangerTitle: {
    color: "#FF3B30",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#F12498",
  },
  avatarEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#F12498",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FAFAFA",
  },
  notificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  notificationInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
  },
  securityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  securityText: {
    fontSize: 16,
    color: "#333",
  },
  dangerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  dangerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dangerText: {
    fontSize: 16,
    color: "#FF3B30",
  },
});

export default AccountSettingsScreen;
