import { state } from "../store/state.js";
import {
  handleClickDecreaseButton,
  handleClickIncreaseButton,
  handleClickRemoveButton,
} from "../events/cartEventHandlers.js";

function CartList() {
  const container = Object.assign(document.createElement("div"), {
    id: "cart-items",
    className: "my-4",
  });

  const render = () => {
    const cartList = state.get("cartList");

    container.innerHTML = `${cartList
      .map(
        ({
          id,
          name,
          price,
          quantity,
        }) => `<div id="${id}" class="flex justify-between items-center mb-2">
              <span>${name} - ${price}원 x ${quantity}</span>
              <div>
                <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="-1">-</button>
                <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="1">+</button>
                <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${id}">삭제</button>
              </div>
            </div>
          `,
      )
      .join("")}
  `;

    const increaseButton = container.querySelectorAll(
      'button[data-change="1"]',
    );
    const decreaseButton = container.querySelectorAll(
      'button[data-change="-1"]',
    );
    const removeButton = container.querySelectorAll(".remove-item");

    increaseButton.forEach((button) => {
      button.addEventListener("click", handleClickIncreaseButton);
    });

    decreaseButton.forEach((button) => {
      button.addEventListener("click", handleClickDecreaseButton);
    });

    removeButton.forEach((button) => {
      button.addEventListener("click", handleClickRemoveButton);
    });
  };

  state.subscribe("cartList", render);
  render();

  return container;
}

export default CartList;
