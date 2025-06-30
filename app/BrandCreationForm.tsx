import { firestore } from "@/backend/firebase";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
type FormData = {
  fullName: string;
  phone: string;
  email: string;
  brandName?: string;
  products: string[];
  brandStyle: string;
  packagingType: string;
  colors: string;
  quantity: string;
  budget: string;
  deliveryTime: string;
  languages: string[];
  inspiration: any[];
  additionalInfo: string;
  acceptTerms: boolean;
};

const BrandCreationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    brandName: "",
    products: [],
    brandStyle: "",
    packagingType: "",
    colors: "",
    quantity: "",
    budget: "",
    deliveryTime: "",
    languages: [],
    inspiration: [],
    additionalInfo: "",
    acceptTerms: false,
  });

  const productOptions = [
    "Extensions de cils",
    "Colle",
    "Primer",
    "Bonder",
    "Remover",
    "Accessoires (pinces, miroir, etc.)",
    "Autre",
  ];

  const styleOptions = [
    "Luxueux & chic",
    "Girly & doux",
    "Minimaliste & pro",
    "Coloré & fun",
    "Autre",
  ];

  const packagingOptions = ["Boîte magnétique", "Plastique", "Carton", "Étuis"];

  const quantityOptions = ["250 pièces", "500 pièces", "+1000"];

  const languageOptions = ["Français", "Anglais", "Bilingue"];

  const handleProductToggle = (product: string) => {
    setFormData((prev) => {
      if (prev.products.includes(product)) {
        return {
          ...prev,
          products: prev.products.filter((p) => p !== product),
        };
      } else {
        return {
          ...prev,
          products: [...prev.products, product],
        };
      }
    });
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev: any) => ({
        ...prev,
        inspiration: [...prev.inspiration, ...result.assets],
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.acceptTerms) {
      alert("Veuillez accepter les CGU");
      return;
    }

    try {
      // Create a reference to the 'brandRequests' collection
      const brandRequestsRef = collection(firestore, "brandRequests");

      // Add a new document with the form data
      const docRef = await addDoc(brandRequestsRef, {
        ...formData,
        createdAt: serverTimestamp(),
        status: "pending",
        // Convert image objects to their URIs
        inspiration: formData.inspiration.map((img) => img.uri),
      });

      console.log("Document written with ID: ", docRef.id);
      alert("Votre demande a été envoyée avec succès!");
      router.back();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTitle: "Créer ma Marque",
          headerTitleAlign: "center",
          headerTitleStyle: { color: Colors.white },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="close" size={24} color={Colors.black} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <LinearGradient colors={["#F12498", "#FF6B9E"]} style={styles.header}>
          <Animated.View
            entering={FadeInUp.delay(900).duration(300).springify()}
          >
            <Text style={styles.headerTitle}>Créez votre Marque</Text>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(1000).duration(300).springify()}
            style={styles.stepIndicator}
          >
            <Text style={styles.headerSubtitle}>
              Le meilleur endroit pour créer ta marque !
            </Text>
          </Animated.View>
          <View style={styles.divider} />
        </LinearGradient>

        {/* Personal Information */}
        <View style={{ padding: 20 }}>
          <Animated.Text
            style={styles.sectionTitle}
            entering={FadeIn.delay(500).duration(300).springify()}
          >
            Informations personnelles
          </Animated.Text>
          <TextInput
            style={styles.input}
            placeholder="Nom et prénom"
            value={formData.fullName}
            onChangeText={(text) =>
              setFormData({ ...formData, fullName: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Numéro de téléphone"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="Adresse email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Nom de marque souhaité (optionnel)"
            value={formData.brandName}
            onChangeText={(text) =>
              setFormData({ ...formData, brandName: text })
            }
          />

          {/* Products */}
          <Animated.Text
            style={styles.sectionTitle}
            entering={FadeIn.delay(600).duration(400).springify()}
          >
            Quel(s) produit(s) veux-tu créer ?
          </Animated.Text>
          {productOptions.map((product) => (
            <View key={product} style={styles.checkboxContainer}>
              <Checkbox
                value={formData.products.includes(product)}
                onValueChange={() => handleProductToggle(product)}
              />
              <Text style={styles.checkboxLabel}>{product}</Text>
            </View>
          ))}

          {/* Brand Style */}
          <Text style={styles.sectionTitle}>
            Quel style veux-tu pour ta marque ?
          </Text>
          <View style={styles.optionsContainer}>
            {styleOptions.map((style) => (
              <TouchableOpacity
                key={style}
                style={[
                  styles.optionButton,
                  formData.brandStyle === style && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, brandStyle: style })}
              >
                <Text style={styles.optionText}>{style}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Packaging */}
          <Text style={styles.sectionTitle}>Type de packaging</Text>
          <View style={styles.optionsContainer}>
            {packagingOptions.map((packaging) => (
              <TouchableOpacity
                key={packaging}
                style={[
                  styles.optionButton,
                  formData.packagingType === packaging &&
                    styles.optionButtonSelected,
                ]}
                onPress={() =>
                  setFormData({ ...formData, packagingType: packaging })
                }
              >
                <Text style={styles.optionText}>{packaging}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Couleurs préférées"
            value={formData.colors}
            onChangeText={(text) => setFormData({ ...formData, colors: text })}
          />

          {/* Quantity */}
          <Text style={styles.sectionTitle}>
            Quantité estimée pour ta première commande ?
          </Text>
          <View style={styles.optionsContainer}>
            {quantityOptions.map((quantity) => (
              <TouchableOpacity
                key={quantity}
                style={[
                  styles.optionButton,
                  formData.quantity === quantity && styles.optionButtonSelected,
                ]}
                onPress={() => setFormData({ ...formData, quantity: quantity })}
              >
                <Text style={styles.optionText}>{quantity}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Budget */}
          <Text style={styles.sectionTitle}>
            Quel est ton budget global estimé ?
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Budget"
            value={formData.budget}
            onChangeText={(text) => setFormData({ ...formData, budget: text })}
            keyboardType="numeric"
          />

          {/* Delivery */}
          <Text style={styles.sectionTitle}>
            Quel est ton délai idéal de livraison ?
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Délai de livraison"
            value={formData.deliveryTime}
            onChangeText={(text) =>
              setFormData({ ...formData, deliveryTime: text })
            }
          />

          {/* Languages */}
          <Text style={styles.sectionTitle}>Langue pour ton packaging</Text>
          {languageOptions.map((language) => (
            <View key={language} style={styles.checkboxContainer}>
              <Checkbox
                value={formData.languages.includes(language)}
                onValueChange={() => {
                  setFormData((prev) => {
                    if (prev.languages.includes(language)) {
                      return {
                        ...prev,
                        languages: prev.languages.filter((l) => l !== language),
                      };
                    } else {
                      return {
                        ...prev,
                        languages: [...prev.languages, language],
                      };
                    }
                  });
                }}
              />
              <Text style={styles.checkboxLabel}>{language}</Text>
            </View>
          ))}

          {/* Inspiration */}
          <Text style={styles.sectionTitle}>Inspiration ou moodboard</Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImageUpload}
          >
            <Text style={styles.uploadButtonText}>Télécharger des images</Text>
          </TouchableOpacity>
          <View style={styles.imagePreviewContainer}>
            {formData.inspiration.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.uri }}
                style={styles.imagePreview}
              />
            ))}
          </View>

          {/* Additional Info */}
          <Text style={styles.sectionTitle}>Autres informations utiles</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Message libre"
            value={formData.additionalInfo}
            onChangeText={(text) =>
              setFormData({ ...formData, additionalInfo: text })
            }
            multiline
            numberOfLines={4}
          />

          {/* Terms */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={formData.acceptTerms}
              onValueChange={() =>
                setFormData({ ...formData, acceptTerms: !formData.acceptTerms })
              }
            />
            <Text style={styles.checkboxLabel}>
              J`&apos;accepte les CGU & politique de confidentialité
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              Envoyer ma demande à Uzuri
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",

    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  optionButton: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    minWidth: "48%",
    alignItems: "center",
  },
  optionButtonSelected: {
    backgroundColor: "#e0f7fa",
    borderColor: "#00acc1",
  },
  optionText: {
    textAlign: "center",
  },
  uploadButton: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  uploadButtonText: {
    color: "#555",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  eaderTitle: {
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
  headerTitle: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  stepIndicator: {
    alignItems: "center",
  },
});

export default BrandCreationForm;
