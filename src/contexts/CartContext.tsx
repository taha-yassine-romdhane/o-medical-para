'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  promoPrice: number | null;
  quantity: number;
  image: string | null;
  brand: string | null;
  inStock: boolean;
  stockQuantity: number;
  packId?: string;
  packName?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  removePack: (packId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  lastAddedItem: CartItem | null;
  showNotification: boolean;
  hideNotification: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Ensure it's an array
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart'); // Clear corrupted data
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prevItems) => {
      // If this is a pack item, don't merge with existing items - always add as new
      if (product.packId) {
        const newItem = { ...product, quantity };
        setLastAddedItem(newItem);
        setShowNotification(true);
        return [...prevItems, newItem];
      }

      // For regular items, check if it exists and is not part of a pack
      const existingItem = prevItems.find((item) =>
        item.productId === product.productId && !item.packId
      );

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        const maxQuantity = product.stockQuantity;

        const updatedItem = { ...existingItem, quantity: Math.min(newQuantity, maxQuantity) };
        setLastAddedItem(updatedItem);
        setShowNotification(true);

        return prevItems.map((item) =>
          item.productId === product.productId && !item.packId ? updatedItem : item
        );
      } else {
        // Add new item
        const newItem = { ...product, quantity };
        setLastAddedItem(newItem);
        setShowNotification(true);
        return [...prevItems, newItem];
      }
    });
  };

  const hideNotification = () => {
    setShowNotification(false);
  };

  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const removePack = (packId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.packId !== packId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.stockQuantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
      const price = item.promoPrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        removePack,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        lastAddedItem,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
