import { auth } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Veuillez entrer votre adresse e-mail");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "E-mail de réinitialisation du mot de passe envoyé",
        "Veuillez vérifier votre courrier électronique pour obtenir des instructions sur la réinitialisation de votre mot de passe.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/home"),
          },
        ]
      );
    } catch (error: any) {
      let errorMessage =
        "Échec de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer..";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "L'adresse email n'est pas valide.";
          break;
        case "auth/user-not-found":
          errorMessage = "Aucun utilisateur trouvé avec cette adresse e-mail.";
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
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Mot de passe oublié" }} />

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Saisissez votre adresse e-mail et nous vous enverrons un lien pour
        réinitialiser votre mot de passe.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Envoie..." : "Envoyer le lien de réinitialisation"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLink}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#b3d7ff",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backLink: {
    color: "#007bff",
    textAlign: "center",
    fontSize: 16,
  },
});
