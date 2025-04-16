import { state } from "../store/state.js";
import { handleClickAddCart } from "../events/cartEventHandlers.js";

function ProductSelect() {
  const container = document.createElement("div");

  const render = () => {
    const productList = state.get("productList");

    const selectedId = document.querySelector("#product-select")?.value || "";

    container.innerHTML = `
    <select id="product-select" class="border rounded p-2 mr-2">
    ${productList.map(({ id, quantity, name, price }) => {
      return `<option value="${id}" ${quantity === 0 ? "disabled" : ""} ${
        id === selectedId ? "selected" : ""
      }>${name} - ${price}원</option>`;
    })}
    </select>
    <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
    `;

    const addBtn = container.querySelector("#add-to-cart");
    addBtn.addEventListener("click", handleClickAddCart);
  };

  render();

  state.subscribe("productList", render);

  return container;
}
export default ProductSelect;
