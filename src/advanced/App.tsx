import React from "react";
import Main from "./pages/Main";
import { ProductsProvider } from "./contexts/ProductsContext";
import { CartProvider } from "./contexts/CartContext";

const App: React.FC = () => (
  <ProductsProvider>
    <CartProvider>
      <Main />
    </CartProvider>
  </ProductsProvider>
);

export default App;
