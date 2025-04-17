import React from "react";
import { useProducts } from "../contexts/ProductsContext";

const CartTotal: React.FC = () => {
  // TODO carts
  const { products } = useProducts();

  const totalPrice = 0;
  const discountRate = 0;
  const bonusPoint = 0;

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
