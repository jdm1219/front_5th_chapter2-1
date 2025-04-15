export default function TitleHeader(text) {
  const title = document.createElement("h1");
  title.className = "text-2xl font-bold mb-4";
  title.textContent = text;

  return title;
}
