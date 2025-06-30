// screens/EcommeScreen.tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import Categories from "@/components/Categories";
import ProductList from "@/components/ProductList";
import { Colors } from "@/constants/Colors";

import { firestore } from "@/backend/firebase";
import { Category, ProductType } from "@/types/type";
import { collection, getDocs } from "firebase/firestore";
const EcommeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesSnapshot = await getDocs(
          collection(firestore, "categories")
        );
        const categoriesData = categoriesSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Category)
        );
        setCategories(categoriesData);

        // Fetch products
        const productsSnapshot = await getDocs(
          collection(firestore, "products")
        );
        const productsData = productsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as ProductType)
        );
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Categories
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://img.freepik.com/free-vector/make-up-concept-illustration_1284-5341.jpg",
            }}
            style={styles.bannerImage}
          />
        </View>

        <ProductList products={filteredProducts} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  bannerContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    borderRadius: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});

export default EcommeScreen;
