import React from "react";
import { useProducts } from "../contexts/ProductsContext";
import { useCart } from "../contexts/CartContext";

const CartList: React.FC = () => {
  const { products, updateQuantity } = useProducts();
  const { cartItems, plusCartItem, minusCartItem, removeCartItem } = useCart();

  const handleClickPlusButton = (itemId: string) => {
    const product = products.find(({ id }) => id === itemId);
    if (!product) return;
    plusCartItem(product, updateQuantity);
  };

  const handleClickMinusButton = (itemId: string) => {
    const product = products.find(({ id }) => id === itemId);
    if (!product) return;
    minusCartItem(product, updateQuantity);
  };

  const handleClickRemoveButton = (itemId: string) => {
    const product = products.find(({ id }) => id === itemId);
    if (!product) return;
    removeCartItem(product, updateQuantity);
  };

  return (
    <div id="cart-items" className="my-4">
      {cartItems.map(({ id, name, price, quantity }) => (
        <div
          id={id}
          key={id}
          className="flex justify-between items-center mb-2"
        >
          <span>
            {name} - {price}원 x {quantity}
          </span>
          <div>
            <button
              onClick={() => handleClickMinusButton(id)}
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              data-product-id={id}
              data-change="-1"
            >
              -
            </button>
            <button
              onClick={() => handleClickPlusButton(id)}
              className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
              data-product-id={id}
              data-change="1"
            >
              +
            </button>
            <button
              onClick={() => handleClickRemoveButton(id)}
              className="remove-item bg-red-500 text-white px-2 py-1 rounded"
              data-product-id={id}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartList;
