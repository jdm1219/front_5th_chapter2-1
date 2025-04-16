import CartList from "../components/CartList.js";
import CartTotal from "../components/CartTotal.js";
import ProductSelect from "../components/ProductSelect.js";
import AddButton from "../components/AddButton.js";
import StockInfo from "../components/StockInfo.js";
import {
  setAdditionalDiscountInterval,
  setLightningSaleInterval,
} from "../../utils/sale.js";
function Main() {
  const root = document.getElementById("app");

  const render = () => {
    root.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div id="wrap" class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
      </div>  
      </div>
    `;

    const wrap = root.querySelector("#wrap");

    wrap.appendChild(CartList());
    wrap.appendChild(CartTotal());
    wrap.appendChild(ProductSelect());
    wrap.appendChild(AddButton());
    wrap.appendChild(StockInfo());
  };

  render();

  setLightningSaleInterval();
  setAdditionalDiscountInterval();
}

export default Main;
