import { state } from "../store/state.js";

function ProductSelect() {
  const container = Object.assign(document.createElement("select"), {
    id: "product-select",
    className: "border rounded p-2 mr-2",
  });

  const render = () => {
    const productList = state.get("productList");

    const selectedId = document.querySelector("#product-select")?.value || "";

    container.innerHTML = `${productList
      .map(({ id, quantity, name, price }) => {
        return `<option value="${id}" ${quantity === 0 ? "disabled" : ""} ${
          id === selectedId ? "selected" : ""
        }>${name} - ${price}원</option>`;
      })
      .join("")}
    `;
  };

  render();

  state.subscribe("productList", render);

  return container;
}

export default ProductSelect;
