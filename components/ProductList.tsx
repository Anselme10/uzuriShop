// components/ProductList.tsx
import { FlatList, StyleSheet, View } from "react-native";
import React from "react";
import ProductItem from "./ProductItem";
import { ProductType } from "@/types/type";

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
