// Запуск: node --test tests/order.test.js
const { test } = require("node:test");
const assert = require("node:assert/strict");
require("../order.js");
const { formatPrice, buildOrderText, telegramLink } = globalThis.KofeOrder;

test("formatPrice разделяет тысячи", () => {
  assert.equal(formatPrice(2290), "2 290 ₽");
  assert.equal(formatPrice(140), "140 ₽");
});

test("buildOrderText считает итог и пишет самовывоз", () => {
  const text = buildOrderText(
    { name: "Кофе In" },
    [
      { name: "Капучино", size: "350 мл", price: 270, qty: 2 },
      { name: "Круассан", size: "шт", price: 160, qty: 1 },
    ],
    { name: "Аня", phone: "+7 999 000-00-00", mode: "pickup", time: "09:30", comment: "" }
  );
  assert.match(text, /1\. Капучино \(350 мл\) × 2 = 540/);
  assert.match(text, /Итого: 700/);
  assert.match(text, /Получение: Самовывоз, к 09:30/);
  assert.doesNotMatch(text, /Комментарий/);
  assert.doesNotMatch(text, /\n\n\n/);
});

test("buildOrderText пишет адрес доставки и комментарий", () => {
  const text = buildOrderText({ name: "X" }, [{ name: "A", size: "s", price: 1, qty: 1 }],
    { name: "a", phone: "1", mode: "delivery", address: "Ленина 5", time: "", comment: "без сахара" });
  assert.match(text, /Получение: Доставка: Ленина 5$/m);
  assert.match(text, /Комментарий: без сахара/);
});

test("telegramLink различает номер и username", () => {
  assert.equal(telegramLink("+7 (918) 695-60-63", "a b"), "https://t.me/+79186956063?text=a%20b");
  assert.equal(telegramLink("@kofe_in", "x"), "https://t.me/kofe_in?text=x");
});
