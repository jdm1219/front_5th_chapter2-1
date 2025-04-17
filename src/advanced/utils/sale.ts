import { wait } from "./wait";
import {
  ADDITIONAL_DISCOUNT_RATE,
  LIGHTNING_DISCOUNT_RATE,
  TIME_UNITS,
} from "../constants";
import { Product } from "../types";

const calcDiscountPrice = (price: number, discountRate: number) => {
  return Math.round(price * discountRate);
};

const getDiscountPercentString = (discountRate: number) => {
  return `${100 * discountRate}%`;
};

export const setLightningSaleInterval = async (
  products: Product[],
  setProducts: (products: Product[]) => void,
) => {
  await wait(10 * TIME_UNITS.SECOND * Math.random());
  setInterval(() => {
    const isTriggered = Math.random() < 0.3;
    if (!isTriggered) {
      return;
    }

    const randomProdIndex = Math.floor(products.length * Math.random());
    const randomItem = products[randomProdIndex];
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
    setProducts([...products]);
  }, 30 * TIME_UNITS.SECOND);
};

export const setAdditionalDiscountInterval = async (
  products: Product[],
  setProducts: (products: Product[]) => void,
  lastSelectedItemId?: string,
) => {
  await wait(20 * TIME_UNITS.SECOND * Math.random());
  setInterval(() => {
    if (!lastSelectedItemId) {
      return;
    }

    const suggestItem = products.find(
      (item) => item.id !== lastSelectedItemId && item.quantity > 0,
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
    setProducts([...products]);
  }, TIME_UNITS.MINUTE);
};
