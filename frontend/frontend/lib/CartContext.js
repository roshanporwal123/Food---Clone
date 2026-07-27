"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { menuItem, quantity }
  const [restaurantId, setRestaurantId] = useState(null);

  function addItem(menuItem, restId) {
    if (restaurantId && restaurantId !== restId) {
      const confirmSwitch = window.confirm(
        "Aapke cart me dusre restaurant ke items hain. Cart clear karke naya item add karein?"
      );
      if (!confirmSwitch) return;
      setItems([]);
    }
    setRestaurantId(restId);
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  }

  function removeItem(menuItemId) {
    setItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
  }

  function updateQuantity(menuItemId, quantity) {
    if (quantity <= 0) return removeItem(menuItemId);
    setItems((prev) =>
      prev.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i))
    );
  }

  function clearCart() {
    setItems([]);
    setRestaurantId(null);
  }

  const total = items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, restaurantId, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
