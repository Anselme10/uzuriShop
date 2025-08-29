import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const modules = [
  {
    id: "1",
    title: "Formation de Base",
    description:
      "Cils Classique\n\nPour qui ?\nIdéale pour les débutantes souhaitant découvrir et maîtriser les fondamentaux.\n• Contenu : Techniques de pose classique, conseils pratiques, et méthodologie.\n• Mesures d'hygiène et de sécurité pour garantir un service de qualité et protéger vos clientes.\n• Durée : 1 journée complète.\n• Kit de formation inclus.\n\nPrix: 290,000 FCFA",
    icon: "sparkles",
    features: [],
  },
  {
    id: "2",
    title: "Formation Complète",
    description:
      "Techniques Basic + Avancées\n\nPour qui ?\nLes débutantes qui souhaitent apprendre et maîtriser toutes les techniques essentielles et avancées dès le départ. Et Les professionnelles souhaitant élargir leur palette technique et atteindre un niveau expert.\n\nContenu :\n• Pose classique\n• Volume russe\n• Hybrid\n• Wispy\n• Wet Effect\n• Manga Effect\n• Autres techniques avancées de volume\n• Approfondissement sur la rétention pour fidéliser vos clientes\n• Les mesures essentielles d'hygiène et de sécurité adaptées à votre activité\n\nDurée : 3 jours intensifs, mêlant théorie et pratique.\n\nAvantages :\n• Kit professionnel inclus\n• Suivi personnalisé pour vous accompagner après la formation\n• Bonus exceptionnel : Coaching Business les erreurs fréquentes à éviter en début de carrière. Comment bâtir une entreprise rentable et durable. Et attirer une clientèle high profil\n\nPrix: 490,000 FCFA",
    icon: "heart",
    features: [],
  },
  {
    id: "3",
    title: "TOP LASH MASTER",
    description:
      "Mentorat & Coaching Privé\n\nProfessionnel(le) des cils et tu ASPIRES À PASSER AU NIVEAU SUPÉRIEUR en devenant formateur/trice ? Ce programme est fait pour toi.\n\nAu Programme :\n• Créer et structurer une formation professionnelle.\nConcevoir un programme pédagogique clair, complet\n\n• Maîtriser l'art de l'enseignement\nApprendre à transmettre vos compétences avec aisance et à captiver votre audience.\n\n• Adopter une pédagogie adaptée et inclusive\nIdentifier les besoins spécifiques de vos élèves, à adapter vos méthodes\n\n• Développer ton image de marque.\nConstruire une image de marque professionnelle, attirer des clients haut de gamme et se positionner en leader\n\n• Lancer et gérer une activité de formation rentable.\nTransformer tes connaissances en une source de revenus durables.\n\nBonus : Comment Construire un Réseau Professionel Puissant\n\nPrix: 1,000,000 FCFA",
    icon: "body",
    features: [],
  },
];

export default function Modules() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleRef1 = useRef(new Animated.Value(1)).current;
  const scaleRef2 = useRef(new Animated.Value(1)).current;
  const scaleRef3 = useRef(new Animated.Value(1)).current;
  const scaleValues = [scaleRef1, scaleRef2, scaleRef3];
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handlePressIn = (scaleValue: Animated.Value) => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleValue: Animated.Value) => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const toggleExpand = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const selectModule = (module: (typeof modules)[0]) => {
    const phoneNumber = "12033900003";
    const message = `Bonjour Uzuri! 🎀\n\nJe suis intéressé par le ${module.title}.\n\n${module.description}\n\nPouvez-vous m'en dire plus?`;

    Linking.openURL(
      `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    ).catch(() => alert("WhatsApp n'est pas installé"));
  };

  const renderDescription = (module: (typeof modules)[0]) => {
    const isExpanded = expandedModules[module.id];
    const maxLines = 5; // Number of lines to show before truncating

    if (isExpanded) {
      return (
        <View>
          <Text style={styles.cardDescription}>{module.description}</Text>
          <TouchableOpacity onPress={() => toggleExpand(module.id)}>
            <Text style={styles.seeMoreText}>Voir moins</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <Text
          style={styles.cardDescription}
          numberOfLines={maxLines}
          ellipsizeMode="tail"
        >
          {module.description}
        </Text>
        <TouchableOpacity onPress={() => toggleExpand(module.id)}>
          <Text style={styles.seeMoreText}>Voir plus</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.header}>Choisissez Votre Expérience</Text>
        <Text style={styles.subheader}>
          Sélectionnez le module qui correspond à vos besoins
        </Text>

        <View style={styles.modulesContainer}>
          {modules.map((module, index) => (
            <Animated.View
              key={module.id}
              style={[
                styles.card,
                {
                  transform: [{ scale: scaleValues[index] }],
                  borderColor: "#F12498",
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={() => handlePressIn(scaleValues[index])}
                onPressOut={() => handlePressOut(scaleValues[index])}
                onPress={() => selectModule(module)}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "rgba(241, 36, 152, 0.1)" },
                    ]}
                  >
                    <Ionicons
                      name={module.icon as any}
                      size={28}
                      color="#F12498"
                    />
                  </View>
                  <Text style={styles.cardTitle}>{module.title}</Text>
                </View>

                {renderDescription(module)}

                <View style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>Choisir ce module</Text>
                  <Ionicons name="arrow-forward" size={18} color="white" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subheader: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  modulesContainer: {
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: "#F12498",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    lineHeight: 22,
  },
  seeMoreText: {
    color: "#F12498",
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "right",
  },
  selectButton: {
    backgroundColor: "#F12498",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  selectButtonText: {
    color: "white",
    fontWeight: "600",
    marginRight: 10,
  },
});
