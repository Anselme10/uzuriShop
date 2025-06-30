// components/Categories.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import { Category } from "@/types/type";

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const Categories = ({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoriesProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Categories</Text>
      </View>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onCategorySelect(item.id)}>
            <View
              style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.selectedCategoryItem,
              ]}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.categoryImage}
              />
              <Text
                style={[
                  styles.categoryName,
                  selectedCategory === item.id && styles.selectedCategoryName,
                ]}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    marginTop: 20,
  },
  titleWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
  },
  titleBtn: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
    padding: 8,
  },
  selectedCategoryItem: {
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: Colors.gray,
  },
  selectedCategoryName: {
    color: Colors.primary,
    fontWeight: "600",
  },
});

export default Categories;
