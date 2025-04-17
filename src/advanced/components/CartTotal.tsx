import React from "react";
import { useProducts } from "../contexts/ProductsContext";
import { useCart } from "../contexts/CartContext";
import calcCart from "../utils/calcCart";

const CartTotal: React.FC = () => {
  const { products } = useProducts();
  const { cartItems } = useCart();
  const { totalPrice, discountRate } = calcCart(cartItems, products);

  const bonusPoint = Math.floor(totalPrice / 1000);

  return (
    <div id="cart-total" className="text-xl font-bold my-4">
      총액: {Math.round(totalPrice)}원
      {discountRate > 0 && (
        <span className="text-green-500 ml-2">
          ({(discountRate * 100).toFixed(1)}% 할인 적용)
        </span>
      )}
      <span id="loyalty-points" className="text-blue-500 ml-2">
        (포인트: {bonusPoint})
      </span>
    </div>
  );
};

export default CartTotal;
