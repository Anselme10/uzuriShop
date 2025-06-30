import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Link, router } from "expo-router";

import { Colors } from "@/constants/Colors";

import { FontAwesome5, Ionicons } from "@expo/vector-icons";

import { StatusBar } from "expo-status-bar";

const Ambassador = () => {
  const goToDistributor = () => {
    router.push("/Distributeur");
  };
  const goToAmbassador = () => {
    router.push("/Amb");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar style="light" backgroundColor={Colors.primary} />
      <Image
        style={{ width: 150, height: 100, marginHorizontal: 20 }}
        source={require("@/assets/images/uzlogotrans.png")}
      />
      <Link href={"/Amb"} asChild>
        <TouchableOpacity style={styles.button} onPress={goToAmbassador}>
          <View style={styles.iconLabel}>
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>DEVENIR AMBASSADEUR</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href={"/Distributeur"} asChild>
        <TouchableOpacity style={styles.button} onPress={goToDistributor}>
          <View style={styles.iconLabel}>
            <FontAwesome5
              name="chalkboard-teacher"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>DEVENIR DISTRIBUTEUR</Text>
          </View>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
};

export default Ambassador;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#fce8ea",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary, // rose doux
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.white, // brun foncé
    textAlign: "center",
  },
});
