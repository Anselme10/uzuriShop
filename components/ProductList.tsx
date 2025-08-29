// components/ProductList.tsx
import { ProductType } from "@/types/type";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ProductItem from "./ProductItem";

interface ProductListProps {
  products: ProductType[];
  flatlist?: boolean;
}

const ProductList = ({ products, flatlist = false }: ProductListProps) => {
  if (flatlist) {
    return (
      <FlatList
        data={products}
        renderItem={({ item, index }) => (
          <ProductItem item={item} index={index} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.container}
      />
    );
  }

  return (
    <View style={styles.gridContainer}>
      {products.map((product, index) => (
        <ProductItem key={product.id} item={product} index={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
});

export default ProductList;
