import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

import type { Product } from "../types";
import {
  setAdditionalDiscountInterval,
  setLightningSaleInterval,
} from "../utils/sale";

interface ProductsContextType {
  products: Product[];
  updateQuantity: (id: string, delta: number) => void;
  lastSelectedItemId?: string;
  setLastSelectedItemId: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined,
);

export function useProducts(): ProductsContextType {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be inside ProductsProvider");
  return ctx;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => [
    { id: "p1", name: "상품1", price: 10000, quantity: 50 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10 },
  ]);
  const [lastSelectedItemId, setLastSelectedItemId] = useState<string>();

  const updateQuantity = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + delta } : p,
      ),
    );
  };

  useEffect(() => {
    setLightningSaleInterval(products, setProducts);
    setAdditionalDiscountInterval(products, setProducts, lastSelectedItemId);
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        updateQuantity,
        lastSelectedItemId,
        setLastSelectedItemId,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
