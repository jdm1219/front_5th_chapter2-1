import { DISCOUNT_RATES } from "../constants";
import { CartItem, Product } from "../types";

const BULK_AMOUNT = 30;
const BULK_DISCOUNT_RATE = 0.25;
const SPECIAL_DAY = 2;
const SPECIAL_DAY_DISCOUNT_RATE = 0.1;

const getDiscountRate = (
  productId: keyof typeof DISCOUNT_RATES,
  quantity: number,
) => {
  if (quantity >= 10 && DISCOUNT_RATES[productId]) {
    return DISCOUNT_RATES[productId];
  }
  return 0;
};

const calcCart = (cartItems: CartItem[], products: Product[]) => {
  let totalPrice = 0;
  let itemCount = 0;

  let totalPriceBeforeDisc = 0;
  let discountRate = 0;

  cartItems.forEach((cartItem) => {
    const currentItem = products.find(({ id }) => id === cartItem.id);
    if (!currentItem) return;

    const quantity = cartItem.quantity;
    const itemTotal = currentItem.price * quantity;
    const discountRate = getDiscountRate(currentItem.id, quantity);

    totalPrice += itemTotal * (1 - discountRate);
    itemCount += quantity;
    totalPriceBeforeDisc += itemTotal;
  });

  ({ totalPrice, discountRate } = applyBulkDiscount(
    totalPrice,
    itemCount,
    totalPriceBeforeDisc,
    discountRate,
  ));
  ({ totalPrice, discountRate } = applySpecialdayDiscount(
    totalPrice,
    discountRate,
  ));
  return { totalPrice, discountRate };
};

const applyBulkDiscount = (
  totalPrice: number,
  itemCount: number,
  totalPriceBeforeDisc: number,
  discountRate: number,
) => {
  if (totalPriceBeforeDisc === 0) return { totalPrice, discountRate };

  const calDefaultDiscountRate = () =>
    (totalPriceBeforeDisc - totalPrice) / totalPriceBeforeDisc;

  discountRate = calDefaultDiscountRate();
  if (itemCount >= BULK_AMOUNT) {
    const bulkDiscountAmount = totalPriceBeforeDisc * BULK_DISCOUNT_RATE;
    const currentDiscountAmount = totalPriceBeforeDisc - totalPrice;

    if (bulkDiscountAmount > currentDiscountAmount) {
      totalPrice = totalPriceBeforeDisc * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    }
  }

  return { totalPrice, discountRate };
};

const applySpecialdayDiscount = (totalPrice: number, discountRate: number) => {
  const today = new Date().getDay();

  if (today === SPECIAL_DAY) {
    totalPrice *= 1 - SPECIAL_DAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, SPECIAL_DAY_DISCOUNT_RATE);
  }

  return { totalPrice, discountRate };
};

export default calcCart;
