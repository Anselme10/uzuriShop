import { auth } from "@/backend/firebase";
import InputField from "@/components/inputField";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link, router, Stack } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Erreur",
        "Le mot de passe doit comporter au moins 6 caractères "
      );
      return;
    }

    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/signin"); // Redirect to main app after signup
    } catch (error: any) {
      let errorMessage = "Échec de la création du compte. Veuillez réessayer.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "L'adresse e-mail est déjà utilisée.";
          break;
        case "auth/invalid-email":
          errorMessage = "L'adresse email n'est pas valide.";
          break;
        case "auth/weak-password":
          errorMessage = "Le mot de passe est trop faible.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Trop de demandes. Veuillez réessayer plus tard.";
          break;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "S'inscrire",
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Créer un compte</Text>

          <InputField
            placeholder="Addresse Email"
            placeholderTextColor={Colors.gray}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <InputField
            placeholder="Mot de passe"
            placeholderTextColor={Colors.gray}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <InputField
            placeholder="Confirmer mot de passe"
            placeholderTextColor={Colors.gray}
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.btnTxt}>
              {loading ? "Creation de compte..." : "Créer un coompte"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.loginTxt}>
            Vous avez déja un compte?{" "}
            <Link href="/signin" asChild>
              <Text style={styles.loginTxtSpan}>Se connecter</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: Colors.black,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 20,
  },
  btnDisabled: {
    backgroundColor: Colors.lightGray,
  },
  btnTxt: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  loginTxt: {
    marginTop: 30,
    fontSize: 14,
    color: Colors.black,
    lineHeight: 24,
  },
  loginTxtSpan: {
    fontWeight: "600",
    color: Colors.primary,
  },
  divider: {
    borderTopColor: Colors.gray,
    borderTopWidth: StyleSheet.hairlineWidth,
    width: "30%",
    marginBottom: 30,
  },
});
