import { wait } from "./wait.js";
import { state } from "../basic/store/state.js";

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

export const setLightningSaleInterval = async () => {
  await wait(10 * TIME_UNITS.SECOND * Math.random());
  setInterval(() => {
    const productList = state.get("productList");
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
    state.set("productList", [...productList]);
  }, 30 * TIME_UNITS.SECOND);
};

export const setAdditionalDiscountInterval = async () => {
  await wait(20 * TIME_UNITS.SECOND * Math.random());
  setInterval(() => {
    const productList = state.get("productList");
    const lastSelectedItem = state.get("lastSelectedItem");

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
    state.set("productList", [...productList]);
  }, TIME_UNITS.MINUTE);
};
