import { firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const CoachingScreen = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [otherLevel, setOtherLevel] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levels = [
    "Débutante – Je n'ai jamais fait de lash extensions",
    "Intermédiaire – Je pratique déjà mais je veux progresser",
    "Avancée – Je suis lash artist confirmée, je veux créer ma marque ou former",
    "Autre",
  ];

  const handleContinue = async () => {
    if (!selectedLevel || (selectedLevel === "Autre" && !otherLevel)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Firebase
      const docRef = await addDoc(collection(firestore, "coachingRequests"), {
        level: selectedLevel === "Autre" ? otherLevel : selectedLevel,
        createdAt: serverTimestamp(),
        status: "new",
      });

      console.log("Document written with ID: ", docRef.id);

      // 2. Redirect to WhatsApp
      const whatsappMessage = `Bonjour Uzuri ! Je suis intéressée par vos formations. Mon niveau: ${
        selectedLevel === "Autre" ? otherLevel : selectedLevel
      }. Envoyé depuis l'application Uzuri`;
      const whatsappUrl = `https://wa.me/12033900003?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      await Linking.openURL(whatsappUrl);

      // 3. Go to next step (optional)
      setCurrentStep(2);
    } catch (error) {
      console.error("Error:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Coaching & Formations Uzuri",
          headerTitleAlign: "center",
          headerTitleStyle: {},
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
          <Animated.View
            entering={FadeInUp.delay(900).duration(300).springify()}
          >
            <Text style={styles.headerTitle}>Coaching & Formations Uzuri</Text>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(1000).duration(300).springify()}
            style={styles.stepIndicator}
          >
            <Text style={styles.headerSubtitle}>
              Trouve le programme parfait pour ton évolution !
            </Text>
          </Animated.View>
          <View style={styles.divider} />
        </LinearGradient>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          <Animated.View
            entering={FadeInUp.delay(900).duration(300).springify()}
            style={styles.stepIndicator}
          >
            <View
              style={[
                styles.stepNumber,
                currentStep === 1 && styles.activeStep,
              ]}
            >
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepLabel}>Informations</Text>
          </Animated.View>

          <View style={styles.stepLine} />
          <View style={styles.stepIndicator}>
            <View
              style={[
                styles.stepNumber,
                currentStep === 2 && styles.activeStep,
              ]}
            >
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Objectifs</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepIndicator}>
            <View
              style={[
                styles.stepNumber,
                currentStep === 3 && styles.activeStep,
              ]}
            >
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Programme</Text>
          </View>
        </View>

        {/* Step 1 Content */}
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>
            Étape 1 – Informations de base à remplir :
          </Text>

          <Text style={styles.question}>
            1. Quel est ton niveau actuel ?{" "}
            <Text style={styles.required}>(obligatoire)</Text>
          </Text>

          {levels.map((level, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.levelOption,
                selectedLevel === level && styles.selectedLevel,
              ]}
              onPress={() => setSelectedLevel(level)}
            >
              <Ionicons
                name={
                  selectedLevel === level
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={selectedLevel === level ? "#F12498" : "#999"}
              />
              <Text style={styles.levelText}>{level}</Text>
            </TouchableOpacity>
          ))}

          {selectedLevel === "Autre" && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Précisez votre niveau..."
                value={otherLevel}
                onChangeText={setOtherLevel}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.nextButton, isSubmitting && styles.disabledButton]}
            onPress={handleContinue}
            disabled={
              isSubmitting ||
              !selectedLevel ||
              (selectedLevel === "Autre" && !otherLevel)
            }
          >
            <Text style={styles.nextButtonText}>
              {isSubmitting ? "Envoi en cours..." : "Continuer"}
            </Text>
            {!isSubmitting && (
              <Ionicons name="arrow-forward" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Course Preview */}
        <View style={styles.coursePreview}>
          <Image
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/uzuri-de01c.firebasestorage.app/o/uzp.jpg?alt=media&token=605937c1-9cde-491d-9c00-7dd0644a341e",
            }}
            style={styles.courseImage}
          />
          <Text style={styles.coursePreviewText}>
            Nos formations incluent comment:
          </Text>
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#F12498" />
              <Text style={styles.benefitText}>
                Créer et structurer une formation professionnelle
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#F12498" />
              <Text style={styles.benefitText}>
                Maitriser l&apos;art de l&apos;enseignement
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#F12498" />
              <Text style={styles.benefitText}>
                Adopter une pédagogie adaptée et inclusive
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#F12498" />
              <Text style={styles.benefitText}>
                Développer ton image de marque
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color="#F12498" />
              <Text style={styles.benefitText}>
                Lancer et gérer une activité de formation rentable
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  headerSubtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#FFF",
    opacity: 0.9,
  },
  divider: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginTop: 16,
    width: "30%",
    alignSelf: "center",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  stepIndicator: {
    alignItems: "center",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEE",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "#F12498",
  },
  stepNumberText: {
    color: "#999",
    fontWeight: "bold",
  },
  activeStepText: {
    color: "#FFF",
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
  },
  stepLine: {
    height: 1,
    width: 40,
    backgroundColor: "#EEE",
    marginHorizontal: 8,
  },
  stepContent: {
    padding: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
  },
  question: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  required: {
    color: "#F12498",
    fontSize: 12,
  },
  levelOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLevel: {
    borderColor: "#F12498",
    backgroundColor: "rgba(241, 36, 152, 0.05)",
  },
  levelText: {
    marginLeft: 12,
    color: "#333",
  },
  inputContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  nextButton: {
    backgroundColor: "#F12498",
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  nextButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    marginRight: 8,
  },
  coursePreview: {
    margin: 24,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  courseImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  coursePreviewText: {
    padding: 16,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  benefitsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 8,
    color: "#666",
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default CoachingScreen;
