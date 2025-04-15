export default function ProductSelect() {
  const prodSelect = document.createElement("select");
  prodSelect.id = "product-select";
  prodSelect.className = "border rounded p-2 mr-2";

  return prodSelect;
}
