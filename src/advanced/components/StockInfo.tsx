import React from "react";
import { useProducts } from "../contexts/ProductsContext";

const StockInfo: React.FC = () => {
  const { products } = useProducts();

  const lowStockProducts = products.filter((product) => product.quantity < 5);

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {lowStockProducts.map((product) => (
        <span key={product.id}>
          {product.name}:{" "}
          {product.quantity > 0
            ? `재고 부족 (${product.quantity}개 남음) `
            : "품절 "}
        </span>
      ))}
    </div>
  );
};

export default StockInfo;
