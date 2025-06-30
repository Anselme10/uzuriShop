import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

const Cgu = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Conditions Générales",
          headerTitleAlign: "center",
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          Conditions Générales d&apos;Utilisation
        </Text>
        <Text style={styles.effectiveDate}>
          Dernière mise à jour : 01/05/2025
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptation des conditions</Text>
        <Text style={styles.paragraph}>
          En utilisant cette application, vous acceptez sans réserve les
          présentes Conditions Générales d&apos;Utilisation (CGU). Si vous
          n&apos;acceptez pas ces conditions, veuillez ne pas utiliser notre
          application.
        </Text>

        <Text style={styles.sectionTitle}>2. Description du service</Text>
        <Text style={styles.paragraph}>
          Notre application mobile permet aux utilisateurs d&apos;acheter des
          produits de beauté et d&apos;accéder à des tutoriels. Les
          fonctionnalités peuvent évoluer sans préavis.
        </Text>

        <Text style={styles.sectionTitle}>3. Compte utilisateur</Text>
        <Text style={styles.paragraph}>
          Pour certaines fonctionnalités, la création d&apos;un compte est
          nécessaire. Vous êtes responsable de la confidentialité de vos
          identifiants et de toutes les activités sur votre compte.
        </Text>

        <Text style={styles.sectionTitle}>4. Commandes et paiements</Text>
        <Text style={styles.paragraph}>
          Les prix sont indiqués en dollar toutes taxes comprises. Nous
          acceptons les cartes bancaires et PayPal. Tout paiement est dû
          immédiatement au moment de la commande.
        </Text>

        <Text style={styles.sectionTitle}>5. Livraison</Text>
        <Text style={styles.paragraph}>
          Les délais de livraison sont indicatifs. En cas de retard, nous vous
          informerons par email. Les frais de port sont calculés en fonction du
          poids et de la destination.
        </Text>

        <Text style={styles.sectionTitle}>6. Retours et remboursements</Text>
        <Text style={styles.paragraph}>
          Vous disposez d&apos;un délai de 14 jours pour retourner un produit
          non utilisé. Les produits d&apos;hygiène personnelle ne peuvent être
          retournés pour des raisons sanitaires.
        </Text>

        <Text style={styles.sectionTitle}>7. Données personnelles</Text>
        <Text style={styles.paragraph}>
          Vos données sont traitées conformément à notre Politique de
          Confidentialité. Nous collectons uniquement les données nécessaires au
          bon fonctionnement du service.
        </Text>

        <Text style={styles.sectionTitle}>8. Propriété intellectuelle</Text>
        <Text style={styles.paragraph}>
          Tout le contenu de l&apos;application (textes, images, logos) est la
          propriété exclusive de notre société. Toute reproduction sans
          autorisation est interdite.
        </Text>

        <Text style={styles.sectionTitle}>
          9. Limitations de responsabilité
        </Text>
        <Text style={styles.paragraph}>
          Nous ne pouvons être tenus responsables des dommages indirects liés à
          l&apos;utilisation de l&apos;application. Nous nous engageons
          cependant à fournir un service de qualité.
        </Text>

        <Text style={styles.sectionTitle}>10. Modifications des CGU</Text>
        <Text style={styles.paragraph}>
          Nous nous réservons le droit de modifier ces CGU à tout moment. Les
          nouvelles conditions seront applicables immédiatement après leur
          publication dans l&apos;application.
        </Text>

        <Text style={styles.sectionTitle}>11. Loi applicable</Text>
        <Text style={styles.paragraph}>
          Les présentes CGU sont régies par le droit français. Tout litige
          relèvera des tribunaux compétents de Paris.
        </Text>

        <Text style={styles.contactTitle}>Contact</Text>
        <Text style={styles.paragraph}>
          Pour toute question concernant nos CGU, veuillez nous contacter au:
          +12033900003
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  effectiveDate: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 12,
    lineHeight: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 24,
    marginBottom: 8,
  },
});

export default Cgu;
