// Чистая логика заказа без DOM — её проверяет tests/order.test.js
(function (root) {
  const formatPrice = (n, cur = "₽") =>
    String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + cur;

  /** lines: [{name, size, price, qty}], form: {name, phone, mode, address, time, comment} */
  function buildOrderText(cafe, lines, form) {
    const cur = cafe.currency || "₽";
    const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const rows = lines.map(
      (l, i) => `${i + 1}. ${l.name} (${l.size}) × ${l.qty} = ${formatPrice(l.price * l.qty, cur)}`
    );
    const get = form.mode === "delivery" ? `Доставка: ${form.address}` : "Самовывоз";
    return [
      `☕ Заявка — ${cafe.name}`,
      "",
      ...rows,
      "",
      `Итого: ${formatPrice(total, cur)}`,
      "",
      `Имя: ${form.name}`,
      `Телефон: ${form.phone}`,
      `Получение: ${get}${form.time ? ", к " + form.time : ""}`,
      form.comment ? `Комментарий: ${form.comment}` : "",
    ]
      .filter((s, i, a) => !(s === "" && a[i - 1] === ""))
      .join("\n")
      .trim();
  }

  // Номер (цифры, можно с «+», скобками, дефисами) → t.me/+номер, иначе username → t.me/username
  function telegramLink(target, text) {
    const t = String(target).trim().replace(/^@/, "");
    const digits = t.replace(/[\s()+-]/g, "");
    const path = /^\d{10,15}$/.test(digits) ? "+" + digits : t;
    return `https://t.me/${path}?text=${encodeURIComponent(text)}`;
  }

  root.KofeOrder = { formatPrice, buildOrderText, telegramLink };
})(typeof window !== "undefined" ? window : globalThis);
