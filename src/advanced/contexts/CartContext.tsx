import React, { createContext, useContext, useState, ReactNode } from "react";

import { CartItem, Product } from "../types";

interface CartContextType {
  cartItems: CartItem[];
  plusCartItem: (
    product: Product,
    updateProductQuantityFunction: (id: string, delta: number) => void,
  ) => void;
  minusCartItem: (
    product: Product,
    updateProductQuantityFunction: (id: string, delta: number) => void,
  ) => void;
  removeCartItem: (
    product: Product,
    updateProductQuantityFunction: (id: string, delta: number) => void,
  ) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useProducts must be inside ProductsProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => []);

  const _getProductById = (id: string) => {
    return cartItems.find((cartItem) => id === cartItem.id);
  };

  const plusCartItem: CartContextType["plusCartItem"] = (
    product,
    updateProductQuantityFunction,
  ) => {
    if (product.quantity < 1) {
      alert("재고가 부족합니다.");
      return;
    }
    updateProductQuantityFunction(product.id, -1);
    const cartProduct = _getProductById(product.id);
    if (cartProduct) {
      cartProduct.price = product.price;
      cartProduct.quantity++;
      setCartItems([...cartItems]);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const minusCartItem: CartContextType["minusCartItem"] = (
    product,
    updateProductQuantityFunction,
  ) => {
    const cartProduct = _getProductById(product.id);
    if (!cartProduct) return;
    updateProductQuantityFunction(product.id, +1);
    cartProduct.price = product.price;
    cartProduct.quantity--;
    if (cartProduct.quantity < 1) {
      setCartItems([...cartItems.filter(({ id }) => id !== product.id)]);
    } else {
      setCartItems([...cartItems]);
    }
  };

  const removeCartItem: CartContextType["removeCartItem"] = (
    product,
    updateProductQuantityFunction,
  ) => {
    const cartProduct = _getProductById(product.id);
    if (!cartProduct) return;
    updateProductQuantityFunction(product.id, cartProduct.quantity);
    setCartItems([...cartItems.filter(({ id }) => id !== product.id)]);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, plusCartItem, minusCartItem, removeCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
}
