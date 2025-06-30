import { firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
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
  shopName: string;
  email: string;
  physicalAddress: string;
  phone: string;
  previousExperience: "oui" | "non";
  shopSize: "moins50" | "50a100" | "100a200" | "plus200";
  motivation: string;
  salesChannels: {
    instagram: boolean;
    facebook: boolean;
    website: boolean;
    physicalStore: boolean;
    other: boolean;
    otherText?: string;
  };
  motivationLevel: number;
  openingDate: Date;
  openingHours: string;
};

const Distributeur = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      salesChannels: {
        instagram: false,
        facebook: false,
        website: false,
        physicalStore: false,
        other: false,
      },
      motivationLevel: 5,
      openingDate: new Date(),
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const salesChannels = watch("salesChannels");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Save to Firebase
      await addDoc(collection(firestore, "distributorApplications"), {
        ...data,
        timestamp: new Date(),
      });

      // Prepare WhatsApp message
      const whatsappMessage = `
        *Nouvelle demande de distributeur UZURI*
        Nom complet: ${data.fullName}
        Boutique: ${data.shopName}
        Email: ${data.email}
        Adresse: ${data.physicalAddress}
        Téléphone: ${data.phone}
        Expérience: ${data.previousExperience}
        Taille boutique: ${data.shopSize
          .replace("moins50", "Moins de 50m²")
          .replace("50a100", "50 à 100m²")
          .replace("100a200", "100 à 200m²")
          .replace("plus200", "Plus de 200m²")}
        Canaux de vente: ${Object.entries(data.salesChannels)
          .filter(([key, val]) => val && key !== "otherText")
          .map(([key]) => {
            if (key === "physicalStore") return "Magasin physique";
            if (key === "other")
              return `Autre: ${data.salesChannels.otherText || ""}`;
            return key.charAt(0).toUpperCase() + key.slice(1);
          })
          .join(", ")}
        Niveau motivation: ${data.motivationLevel}/10
        Date ouverture: ${data.openingDate.toLocaleDateString()}
        Horaires: ${data.openingHours}
        Motivation: ${data.motivation}
      `;

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/12033900003?text=${encodeURIComponent(
        whatsappMessage
      )}`;
      await Linking.openURL(whatsappUrl);

      Alert.alert(
        "Demande soumise !",
        "Merci pour votre candidature comme distributeur UZURI. Nous vous contacterons bientôt !",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error adding document: ", error);
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la soumission. Veuillez réessayer.",
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
        <Text style={styles.title}>Devenir Distributeur UZURI</Text>

        {/* Section 1: Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Informations Personnelles</Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nom complet *"
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
            rules={{ required: "Ce champ est obligatoire" }}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName.message}</Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Nom de votre boutique *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.shopName}
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
            name="shopName"
            rules={{ required: "Ce champ est obligatoire" }}
          />
          {errors.shopName && (
            <Text style={styles.errorText}>{errors.shopName.message}</Text>
          )}
        </View>

        {/* Section 2: Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Informations de Contact</Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Adresse e-mail *"
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
              required: "Email requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email invalide",
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
                label="Adresse physique *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.physicalAddress}
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
            name="physicalAddress"
            rules={{ required: "Ce champ est obligatoire" }}
          />
          {errors.physicalAddress && (
            <Text style={styles.errorText}>
              {errors.physicalAddress.message}
            </Text>
          )}

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Numéro de téléphone *"
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
            rules={{ required: "Ce champ est obligatoire" }}
          />
          {errors.phone && (
            <Text style={styles.errorText}>{errors.phone.message}</Text>
          )}
        </View>

        {/* Section 3: Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Expérience</Text>
          <Text style={styles.question}>
            Avez-vous déjà vendu des produits similaires ? *
          </Text>

          <Controller
            control={control}
            name="previousExperience"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="oui"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Oui</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="non"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Non</Text>
                </View>
              </RadioButton.Group>
            )}
            rules={{ required: "Ce champ est obligatoire" }}
          />
          {errors.previousExperience && (
            <Text style={styles.errorText}>Ce champ est obligatoire</Text>
          )}
        </View>

        {/* Section 4: Shop Size */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Taille de la Boutique</Text>
          <Text style={styles.question}>
            Quelle est la taille de votre boutique ou espace de vente ? *
          </Text>

          <Controller
            control={control}
            name="shopSize"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="moins50"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Moins de 50 m²</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="50a100"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>50 à 100 m²</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="100a200"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>100 à 200 m²</Text>
                </View>
                <View style={styles.radioContainer}>
                  <RadioButton.Android
                    value="plus200"
                    color="#fff"
                    uncheckedColor="#fff"
                  />
                  <Text style={styles.radioLabel}>Plus de 200 m²</Text>
                </View>
              </RadioButton.Group>
            )}
            rules={{ required: "Ce champ est obligatoire" }}
          />
          {errors.shopSize && (
            <Text style={styles.errorText}>Ce champ est obligatoire</Text>
          )}
        </View>

        {/* Section 5: Motivation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Motivation</Text>
          <Text style={styles.question}>
            Pourquoi souhaitez-vous devenir distributeur de UZURI ? *
          </Text>

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Décrivez vos motivations"
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
            rules={{ required: "Ce champ est obligatoire" }}
          />
          {errors.motivation && (
            <Text style={styles.errorText}>{errors.motivation.message}</Text>
          )}
        </View>

        {/* Section 6: Sales Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Canaux de Vente</Text>
          <Text style={styles.question}>
            Quels canaux de vente et communication utilisez-vous ?
          </Text>

          <Controller
            control={control}
            name="salesChannels.instagram"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>Instagram</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="salesChannels.facebook"
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
            name="salesChannels.website"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>Site Web</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="salesChannels.physicalStore"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>Magasin Physique</Text>
              </View>
            )}
          />

          <Controller
            control={control}
            name="salesChannels.other"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxContainer}>
                <Checkbox.Android
                  status={value ? "checked" : "unchecked"}
                  onPress={() => onChange(!value)}
                  color="#fff"
                  uncheckedColor="#fff"
                />
                <Text style={styles.checkboxLabel}>Autre</Text>
              </View>
            )}
          />

          {salesChannels.other && (
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Précisez"
                  mode="outlined"
                  style={styles.input}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
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
              name="salesChannels.otherText"
            />
          )}
        </View>

        {/* Section 7: Motivation Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Niveau de Motivation</Text>
          <Text style={styles.question}>
            Sur une échelle de 1 à 10, à quel point êtes-vous motivé à vendre
            nos produits ? *
          </Text>

          <Controller
            control={control}
            name="motivationLevel"
            render={({ field: { onChange, value } }) => (
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderValue}>{value}/10</Text>
                <View style={styles.sliderTrack}>
                  <View style={styles.sliderBackground} />
                  <View
                    style={[
                      styles.sliderFill,
                      { width: `${(value / 10) * 100}%` },
                    ]}
                  />
                  <View style={styles.sliderDotsContainer}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={[
                          styles.sliderThumb,
                          { left: `${(num - 1) * (100 / 9)}%` },
                        ]}
                        onPress={() => onChange(num)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.sliderDot,
                            value >= num && styles.sliderDotActive,
                          ]}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabel}>1 - Pas motivé</Text>
                  <Text style={styles.sliderLabel}>10 - Très motivé</Text>
                </View>
              </View>
            )}
            rules={{ required: "Ce champ est obligatoire" }}
          />
        </View>

        {/* Section 8: Opening Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            8. Informations d&apos;Ouverture
          </Text>

          <Text style={styles.question}>
            Date d&apos;ouverture de votre boutique
          </Text>
          <Controller
            control={control}
            name="openingDate"
            render={({ field: { onChange, value } }) => (
              <>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {value.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={(event: any, selectedDate: any) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              </>
            )}
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Horaires d'ouverture (ex: 9h-18h) *"
                mode="outlined"
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.openingHours}
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
            name="openingHours"
            rules={{ required: "Ce champ est obligatoire" }}
          />
          {errors.openingHours && (
            <Text style={styles.errorText}>{errors.openingHours.message}</Text>
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
              {isSubmitting ? "Envoi en cours..." : "Soumettre ma demande"}
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
    flex: 1,
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
  sliderContainer: {
    marginBottom: 20,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    position: "relative",
    marginTop: 10,
    marginBottom: 5,
  },
  sliderFill: {
    height: "100%",
    backgroundColor: Colors.lightGray,
    position: "absolute",
  },
  sliderThumb: {
    position: "absolute",
    width: "10%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -5,
  },
  sliderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  sliderDotActive: {
    backgroundColor: Colors.lightGray,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderLabel: {
    color: "#fff",
    fontSize: 12,
  },
  sliderValue: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 5,
  },
  dateInput: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "#fff",
    borderRadius: 4,
    padding: 15,
    marginBottom: 15,
  },
  dateText: {
    color: "#fff",
  },
  sliderBackground: {
    position: "absolute",
    height: 4,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  sliderDotsContainer: {
    position: "relative",
    width: "100%",
    height: 30,
  },
});

export default Distributeur;
