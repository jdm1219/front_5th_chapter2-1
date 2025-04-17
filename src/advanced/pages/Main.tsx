// src/pages/Main.tsx
import React, { useEffect } from "react";
import CartList from "../components/CartList";
import CartTotal from "../components/CartTotal";
import ProductSelect from "../components/ProductSelect";
import StockInfo from "../components/StockInfo";

const Main: React.FC = () => (
  <div className="bg-gray-100 p-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartList />
      <CartTotal />
      <ProductSelect />
      <StockInfo />
    </div>
  </div>
);

export default Main;
