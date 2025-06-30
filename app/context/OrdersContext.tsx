import { auth, firestore } from "@/backend/firebase";
import { Order } from "@/types/type";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType>({
  orders: [],
  loading: false,
  error: null,
  refreshOrders: async () => {},
});

export const useOrders = () => useContext(OrdersContext);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const q = query(
        collection(firestore, "orders"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      setOrders(ordersData);
    } catch (err) {
      //console.error("Error fetching user orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <OrdersContext.Provider
      value={{ orders, loading, error, refreshOrders: fetchUserOrders }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
