import { state } from "../store/state.js";

const BULK_AMOUNT = 30;
const BULK_DISCOUNT_RATE = 0.25;
const SPECIAL_DAY = 2;
const SPECIAL_DAY_DISCOUNT_RATE = 0.1;

const getDiscountRate = (productId, quantity) => {
  const DISCOUNT_RATES = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  };

  if (quantity >= 10 && DISCOUNT_RATES[productId]) {
    return DISCOUNT_RATES[productId];
  }
  return 0;
};

const calcCart = () => {
  let totalPrice = 0;
  let itemCount = 0;

  const cartList = state.get("cartList");
  console.log(cartList);
  let totalPriceBeforeDisc = 0;
  let discRate = 0;

  cartList.forEach((cartItem) => {
    const currentItem = findProductById(cartItem.id);
    if (!currentItem) return;

    const quantity = cartItem.quantity;
    const itemTotal = currentItem.price * quantity;
    const discountRate = getDiscountRate(currentItem.id, quantity);

    totalPrice += itemTotal * (1 - discountRate);
    itemCount += quantity;
    totalPriceBeforeDisc += itemTotal;
  });

  ({ totalPrice, discRate } = applyBulkDiscount(
    totalPrice,
    itemCount,
    totalPriceBeforeDisc,
    discRate,
  ));
  ({ totalPrice, discRate } = applySpecialdayDiscount(totalPrice, discRate));

  state.set("totalPrice", totalPrice);
  state.set("itemCount", itemCount);
  state.set("discountRate", discRate);
};

const findProductById = (productId) => {
  const productList = state.get("productList");
  return productList.find((product) => product.id === productId);
};

const applyBulkDiscount = (
  totalPrice,
  itemCount,
  totalPriceBeforeDisc,
  discRate,
) => {
  if (totalPriceBeforeDisc === 0) return { totalPrice, discRate };

  const calDefaultDiscRate = () =>
    (totalPriceBeforeDisc - totalPrice) / totalPriceBeforeDisc;

  discRate = calDefaultDiscRate();
  if (itemCount >= BULK_AMOUNT) {
    const bulkDiscountAmount = totalPriceBeforeDisc * BULK_DISCOUNT_RATE;
    const currentDiscountAmount = totalPriceBeforeDisc - totalPrice;

    if (bulkDiscountAmount > currentDiscountAmount) {
      totalPrice = totalPriceBeforeDisc * (1 - BULK_DISCOUNT_RATE);
      discRate = BULK_DISCOUNT_RATE;
    }
  }

  return { totalPrice, discRate };
};

const applySpecialdayDiscount = (totalPrice, discRate) => {
  const today = new Date().getDay();

  if (today === SPECIAL_DAY) {
    totalPrice *= 1 - SPECIAL_DAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, SPECIAL_DAY_DISCOUNT_RATE);
  }

  return { totalPrice, discRate };
};

export default calcCart;
