import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";

import type { Product } from "../types";

interface ProductsContextType {
  products: Product[];
  updateQuantity: (id: string, delta: number) => void;
  lastSelectedRef: React.RefObject<string | null>;
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
  const lastSelectedRef = useRef<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: p.quantity + delta } : p,
      ),
    );
  };

  // useEffect(() => {
  //   const cleanupFlash = scheduleFlashSale(() => setProducts((p) => [...p]));
  //   const cleanupRecommend = scheduleRecommendationSale(
  //     () => lastSelectedRef.current,
  //     () => setProducts((p) => [...p]),
  //   );
  //   return () => {
  //     cleanupFlash();
  //     cleanupRecommend();
  //   };
  // }, []);

  return (
    <ProductsContext.Provider
      value={{ products, updateQuantity, lastSelectedRef }}
    >
      {children}
    </ProductsContext.Provider>
  );
}
