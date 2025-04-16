import { state } from "../store/state.js";
import calcCart from "../utils/calcCart.js";

const _increaseCartItem = (productId) => {
  const productList = state.get("productList");
  const cartList = state.get("cartList");

  const product = productList.find(({ id }) => id === productId);
  const cartProduct = cartList.find(({ id }) => id === productId);

  if (!product || product.quantity < 1) {
    alert("재고가 부족합니다.");
    return;
  }

  product.quantity--;

  if (cartProduct) {
    cartProduct.price = product.price;
    cartProduct.quantity++;
  } else {
    cartList.push({ ...product, quantity: 1 });
  }

  state.set("productList", [...productList]);
  state.set("cartList", [...cartList]);

  calcCart();
};

export const handleClickAddCart = () => {
  const productId = document.getElementById("product-select").value;
  _increaseCartItem(productId);
};

export const handleClickIncreaseButton = (event) => {
  const productId = event.target.dataset.productId;
  _increaseCartItem(productId);
};

export const handleClickDecreaseButton = (event) => {
  const productList = state.get("productList");
  const cartList = state.get("cartList");

  const productId = event.target.dataset.productId;
  const product = productList.find((product) => product.id === productId);
  const cartProduct = cartList.find((product) => product.id === productId);

  cartProduct.quantity--;
  product.quantity++;

  if (cartProduct.quantity === 0) {
    const filteredCartList = cartList.filter(
      (product) => product.id !== productId,
    );
    state.set("cartList", filteredCartList);
  } else {
    state.set("cartList", [...cartList]);
  }
  state.set("productList", [...productList]);

  calcCart();
};

export const handleClickRemoveButton = (event) => {
  const productList = state.get("productList");
  const cartList = state.get("cartList");

  const productId = event.target.dataset.productId;
  const product = productList.find((product) => product.id === productId);
  const cartProduct = cartList.find((product) => product.id === productId);

  product.quantity += cartProduct.quantity;
  const filteredCartList = cartList.filter(
    (product) => product.id !== productId,
  );

  state.set("cartList", filteredCartList);
  state.set("productList", [...productList]);

  calcCart();
};
