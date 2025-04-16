import { state } from "../store/state.js";

function StockInfo() {
  const container = document.createElement("div");

  const render = () => {
    const productList = state.get("productList");

    container.innerHTML = `
    <div id="stock-status" class="text-sm text-gray-500 mt-2">
      ${productList
        .filter((product) => product.quantity < 5)
        .map(
          (product) =>
            `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : `품절`}`,
        )}
    </div>
    `;
  };

  state.subscribe("productList", render);

  render();

  return container;
}

export default StockInfo;
