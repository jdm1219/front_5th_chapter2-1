import { wait } from "../utils/wait.js";
import AddButton from "./components/AddButton.js";
import ProductSelect from "./components/ProductSelect.js";
import Container from "./components/Container.js";
import Wrapper from "./components/Wrapper.js";
import TitleHeader from "./components/TitleHeader.js";
import CartDisplay from "./components/CartDisplay.js";
import StockInfo from "./components/StockInfo.js";
import Sum from "./components/Sum.js";

const productList = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
];

const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 1000 * 1000,
};

const LIGHTNING_DISCOUNT_RATE = 0.2;
const ADDITIONAL_DISCOUNT_RATE = 0.05;

const calcDiscountPrice = (price, discountRate) => {
  return Math.round(price * discountRate);
};

const getDiscountPercentString = (discountRate) => {
  return `${100 * discountRate}%`;
};

main();

function main() {
  const root = document.getElementById("app");
  const wrapper = new Wrapper();
  const container = new Container();
  const titleHeader = new TitleHeader("장바구니");
  const cartDisplay = new CartDisplay();
  const productSelect = new ProductSelect();
  const addButton = new AddButton();
  const stockInfo = new StockInfo();
  const sum = new Sum();

  let totalAmt = 0;
  let itemCnt = 0;
  let lastSelectedItem = null;

  const render = () => {
    wrapper.appendChild(titleHeader);
    wrapper.appendChild(cartDisplay);
    wrapper.appendChild(sum);
    wrapper.appendChild(productSelect);
    wrapper.appendChild(addButton);
    wrapper.appendChild(stockInfo);
    container.appendChild(wrapper);
    root.appendChild(container);
  };

  const updateStockInfo = () => {
    var infoMsg = "";
    productList.forEach(function (item) {
      if (item.quantity < 5) {
        infoMsg +=
          item.name +
          ": " +
          (item.quantity > 0
            ? "재고 부족 (" + item.quantity + "개 남음)"
            : "품절") +
          "\n";
      }
    });
    stockInfo.textContent = infoMsg;
  };

  const getCartDiscountByItemId = (itemId) => {
    switch (itemId) {
      case "p1":
        return 0.1;
      case "p2":
        return 0.15;
      case "p3":
        return 0.2;
      case "p4":
        return 0.05;
      case "p5":
        return 0.25;
      default:
        return 0;
    }
  };

  const calcCart = () => {
    totalAmt = 0;
    itemCnt = 0;

    const cartItems = cartDisplay.children;
    let subTotal = 0;

    [...cartItems].forEach((cartItem) => {
      const currentItem = productList.find(
        (prodItem) => prodItem.id === cartItem.id,
      );

      const quantity = parseInt(
        cartItem.querySelector("span").textContent.split("x ")[1],
      );
      const itemTotal = currentItem.price * quantity;
      itemCnt += quantity;
      subTotal += itemTotal;

      const discount =
        quantity >= 10 ? getCartDiscountByItemId(currentItem.id) : 0;
      totalAmt += itemTotal * (1 - discount);
    });

    let discountRate = (subTotal - totalAmt) / subTotal;
    if (itemCnt >= 30) {
      const bulkDiscount = totalAmt * 0.25;
      const itemDiscount = subTotal - totalAmt;
      if (bulkDiscount > itemDiscount) {
        totalAmt = subTotal * (1 - 0.25);
        discountRate = 0.25;
      }
    }

    if (new Date().getDay() === 2) {
      totalAmt *= 1 - 0.1;
      discountRate = Math.max(discountRate, 0.1);
    }

    sum.textContent = "총액: " + Math.round(totalAmt) + "원";
    if (discountRate > 0) {
      var span = document.createElement("span");
      span.className = "text-green-500 ml-2";
      span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
      sum.appendChild(span);
    }
    updateStockInfo();
    renderBonusPoints();
  };

  const renderBonusPoints = () => {
    const bonusPoints = Math.floor(totalAmt / 1000);
    let pointsTag = document.getElementById("loyalty-points");
    if (!pointsTag) {
      pointsTag = document.createElement("span");
      pointsTag.id = "loyalty-points";
      pointsTag.className = "text-blue-500 ml-2";
      sum.appendChild(pointsTag);
    }
    pointsTag.textContent = "(포인트: " + bonusPoints + ")";
  };

  const createSelOpt = (item) => {
    const { id, name, price, quantity } = item;
    const optionElement = document.createElement("option");
    optionElement.value = id;
    optionElement.textContent = `${name} - ${price}원`;
    optionElement.disabled = quantity === 0;
    productSelect.appendChild(optionElement);
  };

  const updateSelOpts = () => {
    productSelect.innerHTML = "";
    productList.forEach(createSelOpt);
  };

  const setLightningSaleInterval = async () => {
    await wait(10 * TIME_UNITS.SECOND * Math.random());
    setInterval(() => {
      const isTriggered = Math.random() < 0.3;
      if (!isTriggered) {
        return;
      }

      const randomProdIndex = Math.floor(productList.length * Math.random());
      const randomItem = productList[randomProdIndex];
      if (randomItem.quantity <= 0) {
        return;
      }

      randomItem.price = calcDiscountPrice(
        randomItem.price,
        LIGHTNING_DISCOUNT_RATE,
      );
      alert(
        `번개세일! ${randomItem.name}이(가) ${getDiscountPercentString(LIGHTNING_DISCOUNT_RATE)} 할인 중입니다!`,
      );
      updateSelOpts();
    }, 30 * TIME_UNITS.SECOND);
  };

  const setAdditionalDiscountInterval = async () => {
    await wait(20 * TIME_UNITS.SECOND * Math.random());
    setInterval(() => {
      if (!lastSelectedItem) {
        return;
      }

      const suggestItem = productList.find(
        (item) => item.id !== lastSelectedItem && item.quantity > 0,
      );
      if (!suggestItem) {
        return;
      }

      suggestItem.price = calcDiscountPrice(
        suggestItem.price,
        ADDITIONAL_DISCOUNT_RATE,
      );
      alert(
        `${suggestItem.name}은(는) 어떠세요? 지금 구매하시면 ${getDiscountPercentString(ADDITIONAL_DISCOUNT_RATE)} 추가 할인!`,
      );
      updateSelOpts();
    }, TIME_UNITS.MINUTE);
  };

  addButton.addEventListener("click", () => {
    const selectedItem = productSelect.value;
    const currentProduct = productList.find((prod) => prod.id === selectedItem);
    if (!currentProduct) {
      return;
    }

    if (currentProduct.quantity <= 0) {
      alert("재고가 부족합니다.");
      return;
    }
    const item = document.getElementById(currentProduct.id);
    if (item) {
      const newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= currentProduct.quantity) {
        item.querySelector("span").textContent =
          `${currentProduct.name} - ${currentProduct.price}원 x ${newQty}`;
        currentProduct.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = document.createElement("div");
      newItem.id = currentProduct.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML = `<span>${currentProduct.name} - ${currentProduct.price}원 x 1</span><div><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${currentProduct.id}" data-change="-1">-</button><button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${currentProduct.id}" data-change="1">+</button><button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${currentProduct.id}">삭제</button></div>`;
      cartDisplay.appendChild(newItem);
      currentProduct.quantity--;
    }
    lastSelectedItem = selectedItem;
    calcCart();
  });

  cartDisplay.addEventListener("click", (event) => {
    const { target } = event;
    if (
      target.classList.contains("quantity-change") ||
      target.classList.contains("remove-item")
    ) {
      const productId = target.dataset.productId;
      const itemElement = document.getElementById(productId);
      const currentProduct = productList.find(({ id }) => id === productId);
      const [itemName, quantityText] = itemElement
        .querySelector("span")
        .textContent.split("x ");
      const currentQuantity = parseInt(quantityText, 10);

      if (target.classList.contains("quantity-change")) {
        const quantityChange = parseInt(target.dataset.change);
        const newQuantity = currentQuantity + quantityChange;
        const maxQuantity = currentProduct.quantity + currentQuantity;

        if (newQuantity <= 0) {
          itemElement.remove();
          currentProduct.quantity -= quantityChange;
        } else if (newQuantity > maxQuantity) {
          alert("재고가 부족합니다.");
        } else {
          itemElement.querySelector("span").textContent =
            `${itemName}x ${newQuantity}`;
          currentProduct.quantity -= quantityChange;
        }
      } else if (target.classList.contains("remove-item")) {
        currentProduct.quantity += currentQuantity;
        itemElement.remove();
      }
      calcCart();
    }
  });

  const init = () => {
    render();
    updateSelOpts();
    calcCart();
    // setLightningSaleInterval();
    // setAdditionalDiscountInterval();
  };

  init();
}
