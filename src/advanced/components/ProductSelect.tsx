// src/components/ProductSelect.tsx
import React, { useState } from "react";
import { useProducts } from "../contexts/ProductsContext";
import { useCart } from "../contexts/CartContext";
import { Product } from "../types";

const ProductSelect: React.FC = () => {
  const { products, updateQuantity, setLastSelectedItemId } = useProducts();
  const { plusCartItem } = useCart();
  const [selectedId, setSelectedId] = useState(
    products.find(({ quantity }) => quantity > 0)?.id ?? products[0].id,
  );

  const handleClickAddCart = () => {
    const product = products.find(({ id }) => id === selectedId);
    if (!product) return;
    plusCartItem(product, updateQuantity);
    setLastSelectedItemId(product.id);
  };
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value as Product["id"]);
  };

  return (
    <>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        value={selectedId}
        onChange={handleChange}
      >
        {products.map(({ id, quantity, name, price }) => (
          <option key={id} value={id} disabled={quantity === 0}>
            {name} - {price}원
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => handleClickAddCart()}
      >
        추가
      </button>
    </>
  );
};

export default ProductSelect;
