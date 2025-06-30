import { Colors } from "@/constants/Colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="light" backgroundColor={Colors.primary} />
      <Image
        style={{ width: 150, height: 100, marginHorizontal: 20 }}
        source={require("@/assets/images/uzlogotrans.png")}
      />
      <Link href={"/BrandCreationForm"} asChild>
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconLabel}>
            <Ionicons
              name="add-circle-outline"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>CRÉER MA MARQUE</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href={"/CoachingScreen"} asChild>
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconLabel}>
            <FontAwesome5
              name="chalkboard-teacher"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>COACHING ET FORMATIONS</Text>
          </View>
        </TouchableOpacity>
      </Link>
      <Link href={"/Ambassador"} asChild>
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconLabel}>
            <FontAwesome5
              name="chalkboard-teacher"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>AMBASSADOR/DISTRIBUTEUR</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href={"/EcommeScreen"} asChild>
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconLabel}>
            <Ionicons
              name="bag-outline"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>ACHETER DES PRODUITS UZURI</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href={"/InspirationConseils"} asChild>
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconLabel}>
            <Ionicons
              name="newspaper-outline"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>LASH MAGAZINE</Text>
          </View>
        </TouchableOpacity>
      </Link>

      <Link href={"/CommandesScreen"} asChild>
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconLabel}>
            <FontAwesome5
              name="clipboard-list"
              size={22}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.text}>SUIVRE MES DEMANDES</Text>
          </View>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

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
