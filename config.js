// ======= Настройки кофейни — правьте только этот файл =======
window.KOFE_CONFIG = {
  name: "Кофе In",
  city: "Краснодар",
  address: "ул. имени М.Е. Соколова, 19",
  hours: "Ежедневно 08:00–21:00",
  phone: "+7 (918) 695-60-63",
  rating: "4,9",
  mapUrl: "https://yandex.ru/maps/org/140615141411/",

  // Куда приходят заявки.
  // Telegram: номер в международном формате без «+» и пробелов (79991234567)
  //   ИЛИ username без «@» (kofe_in). Номер работает, только если в настройках
  //   приватности Telegram разрешено находить вас по номеру.
  telegram: "79186956063",
  // MAX: ссылка на ваш профиль/чат из приложения MAX (Профиль → Поделиться).
  max: "https://max.ru/",

  currency: "₽",

  // Фото справа в первом экране — сменяются при прокрутке. Сейчас — бесплатные фото с Unsplash
  // (лицензия Unsplash, можно использовать без оплаты). Замените на свои: src: "img/1.jpg".
  gallery: [
    { src: "https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?w=1000&q=75&auto=format&fit=crop", caption: "Утро начинается с чашки" },
    { src: "https://images.unsplash.com/photo-1577590835286-1cdd24c08fd7?w=1000&q=75&auto=format&fit=crop", caption: "Латте-арт — руками бариста" },
    { src: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=1000&q=75&auto=format&fit=crop", caption: "Зерно свежей обжарки" },
    { src: "https://images.unsplash.com/photo-1578314674306-5f52904e35bd?w=1000&q=75&auto=format&fit=crop", caption: "Холодный кофе с собой" },
    { src: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=1000&q=75&auto=format&fit=crop", caption: "Пять минут тишины" },
  ],

  // Каталог. У каждой позиции рисуется миниатюра:
  //   art: "hot" (стакан с манжетой), "cold" (прозрачный со льдом), "espresso" (маленький),
  //        "box" (коробка десерта), "bag" (пачка зерна); по умолчанию — по категории.
  //   color — цвет манжеты/напитка/этикетки, color2 — верхний слой холодного напитка.
  //   img — ссылка на настоящее фото (например "img/raf.jpg"), заменяет миниатюру.
  categories: [
    { id: "coffee", title: "Кофе", note: "Зерно свежей обжарки, молоко на выбор" },
    { id: "signature", title: "Авторские напитки", note: "То, ради чего возвращаются" },
    { id: "desserts", title: "Десерты", note: "Печём каждое утро" },
    { id: "beans", title: "Зерно домой", note: "Обжарка под эспрессо и фильтр" },
  ],
  items: [
    { id: "espresso", cat: "coffee", name: "Эспрессо", desc: "Плотный, с нотами шоколада", sizes: [["30 мл", 140]], art: "espresso", color: "#6B4630" },
    { id: "americano", cat: "coffee", name: "Американо", desc: "Эспрессо и горячая вода", sizes: [["250 мл", 180], ["350 мл", 220]], color: "#2B211C" },
    { id: "cappuccino", cat: "coffee", name: "Капучино", desc: "Шелковистая молочная пена", sizes: [["250 мл", 220], ["350 мл", 270], ["450 мл", 310]], color: "#A9744A" },
    { id: "latte", cat: "coffee", name: "Латте", desc: "Больше молока, мягкий вкус", sizes: [["350 мл", 260], ["450 мл", 300]], color: "#B88760" },
    { id: "flat", cat: "coffee", name: "Флэт уайт", desc: "Двойной эспрессо, тонкий слой молока", sizes: [["200 мл", 250]], color: "#7A4E33" },
    { id: "raf", cat: "signature", name: "Раф «Ин»", desc: "Сливки, ваниль, щепоть морской соли", sizes: [["300 мл", 290], ["400 мл", 340]], tag: "Хит", color: "#C08A5B" },
    { id: "halva", cat: "signature", name: "Латте халва", desc: "Тахини, мёд, кунжутная халва", sizes: [["350 мл", 320]], color: "#8C6A4A" },
    { id: "orange", cat: "signature", name: "Эспрессо-тоник апельсин", desc: "Холодный, яркий, освежающий", sizes: [["300 мл", 300]], art: "cold", color: "#E8892F", color2: "#3B2416" },
    { id: "matcha", cat: "signature", name: "Матча латте", desc: "Японская матча на молоке", sizes: [["350 мл", 310]], color: "#7C9A5B" },
    { id: "croissant", cat: "desserts", name: "Круассан", desc: "Сливочное масло 82%", sizes: [["шт", 160]], color: "#D9A55E" },
    { id: "cheesecake", cat: "desserts", name: "Чизкейк Сан-Себастьян", desc: "Жжёная корочка, кремовый центр", sizes: [["кусок", 290]], tag: "Хит", color: "#9A5A2E" },
    { id: "carrot", cat: "desserts", name: "Морковный торт", desc: "Грецкий орех, крем-чиз", sizes: [["кусок", 270]], color: "#D07A3A" },
    { id: "cookie", cat: "desserts", name: "Печенье с шоколадом", desc: "Тёмный бельгийский шоколад", sizes: [["шт", 120]], color: "#6B4630" },
    { id: "brazil", cat: "beans", name: "Бразилия Сантос", desc: "Орех, карамель, какао", sizes: [["250 г", 690], ["1 кг", 2290]], color: "#2B211C" },
    { id: "ethiopia", cat: "beans", name: "Эфиопия Иргачефф", desc: "Бергамот, жасмин, цитрус", sizes: [["250 г", 890]], color: "#8E5A3B" },
  ],
};
