import { state } from "../store/state.js";

function StockInfo() {
  const container = Object.assign(document.createElement("div"), {
    id: "stock-status",
    className: "text-sm text-gray-500 mt-2",
  });

  const render = () => {
    const productList = state.get("productList");

    container.innerHTML = `${productList
      .filter((product) => product.quantity < 5)
      .map(
        (product) =>
          `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : `품절`}`,
      )}`;
  };

  state.subscribe("productList", render);

  render();

  return container;
}

export default StockInfo;
