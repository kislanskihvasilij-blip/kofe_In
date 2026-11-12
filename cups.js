// Миниатюры для карточек каталога (SVG): горячий/холодный стакан, эспрессо, коробка десерта, пачка зерна.
// Градиент #kShade объявлен один раз в index.html.
(function (root) {
  const shadow = (rx = 36) => `<ellipse cx="60" cy="151" rx="${rx}" ry="5" fill="#2B211C" opacity=".22"/>`;
  const logo = (y, fill, size = 22) =>
    `<text x="60" y="${y}" text-anchor="middle" font-family="Cormorant Garamond,Georgia,serif" font-style="italic" font-size="${size}" fill="${fill}">In</text>`;
  const BODY = "M22 38H98L88 148Q60 152 32 148Z";

  const hot = (color, sleeve = true) => `
    ${shadow()}
    <path d="${BODY}" fill="#F6EFE5"/>
    ${sleeve ? `<path d="M25.1 72H94.9L90.9 116H29.1Z" fill="${color}"/>${logo(101, "#FBF5EC")}` : logo(104, color, 26)}
    <path d="${BODY}" fill="url(#kShade)"/>
    <rect x="17" y="29" width="86" height="11" rx="5" fill="#FFFDF9"/>
    <path d="M25 30Q27 17 42 15H78Q93 17 95 30Z" fill="#EFE7DC"/>
    <ellipse cx="74" cy="21" rx="6" ry="2" fill="#2B211C" opacity=".5"/>`;

  const cold = (color, top = "#3B2416") => `
    ${shadow(32)}
    <path d="M27.2 60H92.8L86 148Q60 151 34 148Z" fill="${color}"/>
    <path d="M27.2 60H92.8L91.6 78H28.4Z" fill="${top}" opacity=".9"/>
    <rect x="38" y="84" width="16" height="14" rx="4" fill="#fff" opacity=".45" transform="rotate(-12 46 91)"/>
    <rect x="62" y="96" width="15" height="13" rx="4" fill="#fff" opacity=".4" transform="rotate(14 69 102)"/>
    <rect x="46" y="112" width="14" height="12" rx="4" fill="#fff" opacity=".35"/>
    <path d="M26 44H94L86 148Q60 151 34 148Z" fill="#fff" fill-opacity=".14" stroke="#fff" stroke-opacity=".85" stroke-width="1.6"/>
    <path d="M33 52L40 140" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>
    <rect x="66" y="6" width="7" height="64" rx="3" fill="#2B211C" transform="rotate(14 69 38)"/>
    <path d="M25 44Q25 20 60 18Q95 20 95 44Z" fill="#fff" fill-opacity=".22" stroke="#fff" stroke-opacity=".9" stroke-width="1.6"/>
    <rect x="22" y="41" width="76" height="6" rx="3" fill="#fff" opacity=".75"/>`;

  const box = (color) => `
    ${shadow(46)}
    <rect x="18" y="78" width="84" height="70" rx="3" fill="#C99C6C"/>
    <rect x="32" y="92" width="56" height="38" rx="12" fill="#F6EFE5"/>
    <path d="M38 126Q38 104 60 102Q82 104 82 126Z" fill="${color}"/>
    <path d="M42 108Q60 98 78 108" stroke="#FBF5EC" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"/>
    <rect x="32" y="92" width="56" height="38" rx="12" fill="none" stroke="#8E6A47" stroke-width="1.5"/>
    <rect x="18" y="78" width="84" height="70" rx="3" fill="url(#kShade)"/>
    <path d="M14 78L26 58H94L106 78Z" fill="#DDB585"/>
    <circle cx="60" cy="70" r="9" fill="#2B211C"/>${logo(74.5, "#FBF5EC", 13)}`;

  const bag = (color) => `
    ${shadow(40)}
    <path d="M30 34H90L97 148Q60 152 23 148Z" fill="#B98B5E"/>
    <path d="M28 22H92V36H28Z" fill="#A97C52"/>
    <path d="M28 22l4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5Z" fill="#A97C52"/>
    <circle cx="60" cy="54" r="4" fill="#8E6A47"/>
    <rect x="36" y="72" width="48" height="56" rx="4" fill="${color}"/>
    ${logo(100, "#FBF5EC", 24)}
    <rect x="46" y="110" width="28" height="3" rx="1.5" fill="#FBF5EC" opacity=".6"/>
    <path d="M30 34H90L97 148Q60 152 23 148Z" fill="url(#kShade)"/>`;

  const DEFAULT = { coffee: "hot", signature: "hot", desserts: "box", beans: "bag" };

  /** item: {cat, art?, color?, color2?} → строка <svg> */
  function itemArt(item) {
    const color = item.color || "#A9744A";
    const kind = item.art || DEFAULT[item.cat] || "hot";
    const inner =
      kind === "cold" ? cold(color, item.color2) :
      kind === "espresso" ? hot(color, false) :
      kind === "box" ? box(color) :
      kind === "bag" ? bag(color) : hot(color);
    return `<svg class="card__art${kind === "espresso" ? " card__art--small" : ""}" viewBox="0 0 120 160" aria-hidden="true">${inner}</svg>`;
  }

  root.KofeArt = { itemArt };
})(window);
