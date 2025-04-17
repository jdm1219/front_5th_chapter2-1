import { DISCOUNT_RATES } from "../constants";

export interface Product {
  id: keyof typeof DISCOUNT_RATES;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
