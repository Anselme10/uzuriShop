import { Timestamp } from "firebase/firestore";

export interface Category {
  id: string;
  name: string;
  image: string;
}

export type RouteName = "Home" | "Search" | "Favorites" | "Profile";

export interface ProductType {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  description: string;
}

export interface CategoryType {
  id: number;
  name: string;
  image: string;
}

export interface CartItemType {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface NotificationType {
  id: number;
  title: string;
  message: string;
  timestamp: string;
}

export interface Order {
  id: string; // Include the Firestore document ID
  billingAddress: { [key: string]: any };
  date: Timestamp;
  deliveryDate: Timestamp | null;
  estimatedDelivery: Timestamp;
  total: number;
  items: {
    image: string;
    name: string;
    price: number;
    productId: string;
    quantity: number;
    variant: string;
  }[];
  paymentMethod: string;
  progress: number;
  shippingFee: number;
  shippingMethod: string;
  status: string;
  subtotal: number;
  trackingNumber: string;
  userId: string;
  image: string;
}
