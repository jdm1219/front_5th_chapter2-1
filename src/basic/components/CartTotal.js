import { state } from "../store/state.js";

function CartTotal() {
  const container = Object.assign(document.createElement("div"), {
    id: "cart-total",
    className: "text-xl font-bold my-4",
  });

  const render = () => {
    const totalPrice = state.get("totalPrice");
    const discountRate = state.get("discountRate");
    const bonusPoint = Math.floor(totalPrice / 1000);

    container.innerHTML = `총액: ${Math.round(totalPrice)}원${
      discountRate > 0
        ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`
        : ""
    }<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoint})</span></div>
    `;
  };

  state.subscribe("totalPrice", render);
  state.subscribe("discountRate", render);

  render();

  return container;
}

export default CartTotal;
