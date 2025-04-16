import { handleClickAddCart } from "../events/cartEventHandlers.js";

function AddButton() {
  const container = Object.assign(document.createElement("button"), {
    id: "add-to-cart",
    className: "bg-blue-500 text-white px-4 py-2 rounded",
  });

  const render = () => {
    container.innerHTML = `추가`;
    container.addEventListener("click", handleClickAddCart);
  };

  render();

  return container;
}

export default AddButton;
