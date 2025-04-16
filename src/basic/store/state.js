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

export const state = (() => {
  const data = {
    productList: [
      { id: "p1", name: "상품1", price: 10000, quantity: 50 },
      { id: "p2", name: "상품2", price: 20000, quantity: 30 },
      { id: "p3", name: "상품3", price: 30000, quantity: 20 },
      { id: "p4", name: "상품4", price: 15000, quantity: 0 },
      { id: "p5", name: "상품5", price: 25000, quantity: 10 },
    ],
    cartList: [],
    get itemTotal() {
      return this.cartList.reduce((acc, cartItem) => {
        const product = this.productList.find(({ id }) => id === cartItem.id);
        const discountRate = getDiscountRate(product.id, cartItem.quantity);
        const itemTotal =
          product.price * cartItem.quantity * (1 - discountRate);
        return acc + itemTotal;
      }, 0);
    },
    totalPrice: 0,
    itemCount: 0,
    discountRate: 0,
    get bonusPoint() {
      return Math.floor(this.totalPrice / 1000);
    },
    lastSelectedItem: null,
  };

  const listeners = new Map();

  return {
    get(key) {
      return data[key];
    },
    set(key, value) {
      data[key] = value;

      if (listeners.has(key)) {
        listeners.get(key).forEach((callback) => callback(value));
      }
    },
    subscribe(key, callback) {
      if (!listeners.has(key)) {
        listeners.set(key, []);
      }
      listeners.get(key).push(callback);
    },
  };
})();
