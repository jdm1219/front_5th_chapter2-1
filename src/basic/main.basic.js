import { wait } from "../utils/wait.js";

var sel, addBtn, sum, stockInfo;
const cartDisp = document.createElement("div");
var lastSel,
  totalAmt = 0,
  itemCnt = 0;

const prodList = [
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

main();

const calcDiscountPrice = (price, discountRate) => {
  return Math.round(price * discountRate);
};

const getDiscountPercent = (discountRate) => {
  return `${100 * discountRate}%`;
};

const setLightningSaleInterval = async () => {
  await wait(10 * TIME_UNITS.SECOND * Math.random());
  setInterval(() => {
    const isTriggered = Math.random() < 0.3;
    if (!isTriggered) {
      return;
    }

    const randomProdIndex = Math.floor(prodList.length * Math.random());
    const randomItem = prodList[randomProdIndex];
    if (randomItem.quantity <= 0) {
      return;
    }

    randomItem.price = calcDiscountPrice(
      randomItem.price,
      LIGHTNING_DISCOUNT_RATE,
    );
    alert(
      `번개세일! ${randomItem.name}이(가) ${getDiscountPercent(LIGHTNING_DISCOUNT_RATE)} 할인 중입니다!`,
    );
    updateSelOpts();
  }, 30 * TIME_UNITS.SECOND);
};
const setAdditionalDiscountInterval = async () => {
  await wait(20 * TIME_UNITS.SECOND * Math.random());
  setInterval(() => {
    if (!lastSel) {
      return;
    }

    const suggestItem = prodList.find(
      (item) => item.id !== lastSel && item.quantity > 0,
    );
    if (!suggestItem) {
      return;
    }

    suggestItem.price = calcDiscountPrice(
      suggestItem.price,
      ADDITIONAL_DISCOUNT_RATE,
    );
    alert(
      `${suggestItem.name}은(는) 어떠세요? 지금 구매하시면 ${getDiscountPercent(ADDITIONAL_DISCOUNT_RATE)} 추가 할인!`,
    );
    updateSelOpts();
  }, 60000);
};

function updateSelOpts() {
  sel.innerHTML = "";
  prodList.forEach(function (item) {
    var opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.name + " - " + item.price + "원";
    if (item.quantity === 0) opt.disabled = true;
    sel.appendChild(opt);
  });
}
const renderBonusPts = () => {
  const bonusPts = Math.floor(totalAmt / 1000);
  let ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) {
    ptsTag = document.createElement("span");
    ptsTag.id = "loyalty-points";
    ptsTag.className = "text-blue-500 ml-2";
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent = "(포인트: " + bonusPts + ")";
};

const calcCart = () => {
  totalAmt = 0;
  itemCnt = 0;
  var cartItems = cartDisp.children;
  var subTot = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var curItem;
      for (var j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      var q = parseInt(
        cartItems[i].querySelector("span").textContent.split("x ")[1],
      );
      var itemTot = curItem.price * q;
      var disc = 0;
      itemCnt += q;
      subTot += itemTot;
      if (q >= 10) {
        if (curItem.id === "p1") disc = 0.1;
        else if (curItem.id === "p2") disc = 0.15;
        else if (curItem.id === "p3") disc = 0.2;
        else if (curItem.id === "p4") disc = 0.05;
        else if (curItem.id === "p5") disc = 0.25;
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }
  let discRate = 0;
  if (itemCnt >= 30) {
    var bulkDisc = totalAmt * 0.25;
    var itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }
  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  sum.textContent = "총액: " + Math.round(totalAmt) + "원";
  if (discRate > 0) {
    var span = document.createElement("span");
    span.className = "text-green-500 ml-2";
    span.textContent = "(" + (discRate * 100).toFixed(1) + "% 할인 적용)";
    sum.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
};

function updateStockInfo() {
  var infoMsg = "";
  prodList.forEach(function (item) {
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
}

addBtn.addEventListener("click", function () {
  var selItem = sel.value;
  var itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    var item = document.getElementById(itemToAdd.id);
    if (item) {
      var newQty =
        parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.price + "원 x " + newQty;
        itemToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      var newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.price +
        "원 x 1</span><div>" +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cartDisp.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calcCart();
    lastSel = selItem;
  }
});
cartDisp.addEventListener("click", function (event) {
  const { target } = event;
  if (
    target.classList.contains("quantity-change") ||
    target.classList.contains("remove-item")
  ) {
    var prodId = target.dataset.productId;
    var itemElem = document.getElementById(prodId);
    var prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (target.classList.contains("quantity-change")) {
      var qtyChange = parseInt(target.dataset.change);
      var newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) +
        qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.quantity +
            parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] +
          "x " +
          newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.quantity -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      var remQty = parseInt(
        itemElem.querySelector("span").textContent.split("x ")[1],
      );
      prod.quantity += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});

function main() {
  const root = document.getElementById("app");
  const cont = document.createElement("div");
  const wrap = document.createElement("div");
  const hTxt = document.createElement("h1");
  sum = document.createElement("div");
  sel = document.createElement("select");
  addBtn = document.createElement("button");
  stockInfo = document.createElement("div");
  cartDisp.id = "cart-items";
  sum.id = "cart-total";
  sel.id = "product-select";
  addBtn.id = "add-to-cart";
  stockInfo.id = "stock-status";
  cont.className = "bg-gray-100 p-8";
  wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  hTxt.className = "text-2xl font-bold mb-4";
  sum.className = "text-xl font-bold my-4";
  sel.className = "border rounded p-2 mr-2";
  addBtn.className = "bg-blue-500 text-white px-4 py-2 rounded";
  stockInfo.className = "text-sm text-gray-500 mt-2";
  hTxt.textContent = "장바구니";
  addBtn.textContent = "추가";
  updateSelOpts();
  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisp);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);
  calcCart();
  setLightningSaleInterval();
  setAdditionalDiscountInterval();
}
