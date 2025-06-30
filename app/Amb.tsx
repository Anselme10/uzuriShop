import { firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox, RadioButton, TextInput } from "react-native-paper";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  instagramUsername: string;
  instagramFollowers: string;
  tiktokFollowers: string;
  otherSocials: {
    facebook: boolean;
    twitter: boolean;
    youtube: boolean;
    snapchat: boolean;
  };
  motivation: string;
  previousExperience: "yes" | "no";
  skills: string;
  eventAvailability: "often" | "sometimes" | "no";
  postingFrequency: "daily" | "several" | "weekly" | "rarely";
  agreeToShare: boolean;
};

const Amb = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      otherSocials: {
        facebook: false,
        twitter: false,
        youtube: false,
        snapchat: false,
      },
      agreeToShare: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Save to Firebase
      const docRef = await addDoc(
        collection(firestore, "ambassadorApplications"),
        {
          ...data,
          timestamp: new Date(),
        }
      );

      // Prepare WhatsApp message
      const whatsappMessage = `
        *New Ambassador Application*
        Name: ${data.fullName}
        Email: ${data.email}
        Phone: ${data.phone}
        Instagram: ${data.instagramUsername}
        Followers: Instagram ${data.instagramFollowers}, TikTok ${
        data.tiktokFollowers
      }
        Autres activités sociales: ${Object.entries(data.otherSocials)
          .filter(([_, val]) => val)
          .map(([key]) => key)
          .join(", ")}
        Motivation: ${data.motivation}
        Expérience antérieure: ${data.previousExperience}
        Compétences: ${data.skills}
        Disponibilité de l'événement: ${data.eventAvailability}
        Fréquence de publication: ${data.postingFrequency}
        Accepte de partager: ${data.agreeToShare ? "Yes" : "No"}
      `;

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/12033900003?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      await Linking.openURL(whatsappUrl);

      Alert.alert(
        "Candidature soumise !",
        "Merci d'avoir postulé pour devenir ambassadeur de marque. Nous vous contacterons prochainement !",
        [{ text: "OK" }]
      );
      router.push("/Ambassador");
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de l'envoi de votre candidature. Veuillez réessayer.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.lightGray]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Brand Ambassador Application</Text>

        {/* Section 1: Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Personal Information</Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nom Complet *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.fullName}
                theme={{
                  colors: {
                    primary: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                outlineColor="#fff"
                textColor="#fff"
              />
            )}
            name="fullName"
            rules={{ required: "Obligatoir" }}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
                error={!!errors.email}
                theme={{
                  colors: {
                    primary: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                outlineColor="#fff"
                textColor="#fff"
              />
            )}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Numéro de telephone *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="phone-pad"
                error={!!errors.phone}
                theme={{
                  colors: {
                    primary: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                outlineColor="#fff"
                textColor="#fff"
              />
            )}
            name="phone"
            rules={{ required: "Phone number is required" }}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}
        </View>

        {/* Section 2: Social Media Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Social Media Information</Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nom d'utilisateur Instagram *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.instagramUsername}
                theme={{
                  colors: {
                    primary: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                outlineColor="#fff"
                textColor="#fff"
              />
            )}
            name="instagramUsername"
            rules={{ required: "Instagram username is required" }}
          />
          {errors.instagramUsername && (
            <Text style={styles.errorText}>
              {errors.instagramUsername.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nombre de Followers Instagram *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                error={!!errors.instagramFollowers}
                theme={{
                  colors: {
                    primary: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                outlineColor="#fff"
                textColor="#fff"
              />
            )}
            name="instagramFollowers"
            rules={{ required: "Instagram followers count is required" }}
          />
          {errors.instagramFollowers && (
            <Text style={styles.errorText}>
              {errors.instagramFollowers.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nombre de Follower sur TikTok *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                error={!!errors.tiktokFollowers}
                theme={{
                  colors: {
                    primary: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                outlineColor="#fff"
                textColor="#fff"
              />
            )}
            name="tiktokFollowers"
            rules={{ required: "TikTok followers count is required" }}
          />
          {errors.tiktokFollowers && (
            <Text style={styles.errorText}>
              {errors.tiktokFollowers.message}
            </Text>
          )}
        </View>

        {/* Section 3: Other Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            3. Autres plateformes de médias sociaux
          </Text>
          <Text style={styles.question}>
            Sur quelles autres plateformes de médias sociaux êtes-vous actif ?
          </Text>

          <Controller
            control={control}
            name="otherSocials.facebook"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>Facebook</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="otherSocials.twitter"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>Twitter</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="otherSocials.youtube"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>YouTube</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="otherSocials.snapchat"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>Snapchat</Text>
              </View>
            )}
          />
        </View>

        {/* Section 4: Motivation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Motivation</Text>
          <Text style={styles.question}>
            Pourquoi souhaitez-vous devenir ambassadeur de marque ? *
          </Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Explain your motivation"
                mode="outlined"
                style={[styles.input, { height: 100 }]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
                error={!!errors.motivation}
                theme={{
                  colors: {
                    primary: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                outlineColor="#fff"
                textColor="#fff"
              />
            )}
            name="motivation"
            rules={{ required: "Motivation is required" }}
          />
          {errors.motivation && (
            <Text style={styles.errorText}>{errors.motivation.message}</Text>
          )}
        </View>

        {/* Section 5: Previous Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Expérience antérieure</Text>
          <Text style={styles.question}>
            Avez-vous déjà travaillé comme ambassadeur de marque ? *
          </Text>

          <Controller
            control={control}
            name="previousExperience"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="yes"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Oui</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="no"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Non</Text>
                </View>
              </RadioButton.Group>
            )}
            rules={{ required: "This field is required" }}
          />
          {errors.previousExperience && (
            <Text style={styles.errorText}>Ce champ est obligatoire</Text>
          )}
        </View>

        {/* Section 6: Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Compétences</Text>
          <Text style={styles.question}>
            Quelles compétences apporteriez-vous à notre marque ? *
          </Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Décrivez vos compétences et votre expérience pertinente"
                mode="outlined"
                style={[styles.input, { height: 100 }]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
                error={!!errors.skills}
                theme={{
                  colors: {
                    primary: "#fff",
                    background: "rgba(255,255,255,0.1)",
                  },
                }}
                outlineColor="#fff"
                textColor="#fff"
              />
            )}
            name="skills"
            rules={{ required: "Skills description is required" }}
          />
          {errors.skills && (
            <Text style={styles.errorText}>{errors.skills.message}</Text>
          )}
        </View>

        {/* Section 7: Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Disponibilité</Text>
          <Text style={styles.question}>
            Êtes-vous disponible pour des événements promotionnels ? *
          </Text>

          <Controller
            control={control}
            name="eventAvailability"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="often"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Oui, souvent</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="sometimes"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Oui, parfois</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="no"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Non</Text>
                </View>
              </RadioButton.Group>
            )}
            rules={{ required: "This field is required" }}
          />
          {errors.eventAvailability && (
            <Text style={styles.errorText}>Ce champ est obligatoire</Text>
          )}
        </View>

        {/* Section 8: Posting Frequency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            8. Activité sur les réseaux sociaux
          </Text>
          <Text style={styles.question}>
            À quelle fréquence publiez-vous sur les réseaux sociaux ? *
          </Text>

          <Controller
            control={control}
            name="postingFrequency"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="daily"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Tous les jours</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="several"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>
                    Plusieurs fois par semaine
                  </Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="weekly"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Une fois par semaine</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="rarely"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Rarement</Text>
                </View>
              </RadioButton.Group>
            )}
            rules={{ required: "This field is required" }}
          />
          {errors.postingFrequency && (
            <Text style={styles.errorText}>Ce champ est obligatoire</Text>
          )}
        </View>

        {/* Section 9: Agreement */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Accord</Text>

          <Controller
            control={control}
            name="agreeToShare"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>
                  J&apos;accepte de partager des informations sur votre marque
                  sur mes réseaux sociaux*
                </Text>
              </View>
            )}
            rules={{ required: "Vous devez accepter ceci pour postuler" }}
          />
          {errors.agreeToShare && (
            <Text style={styles.errorText}>{errors.agreeToShare.message}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={styles.submitButton}
        >
          <LinearGradient
            colors={[Colors.lightGray, Colors.primary]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Soumission..." : "Soumettre ma demande"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxLabel: {
    color: "#fff",
    marginLeft: 8,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioLabel: {
    color: "#fff",
    marginLeft: 8,
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 10,
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 25,
    overflow: "hidden",
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Amb;
