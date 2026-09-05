import type { Lang } from "./i18n";
import type { Product } from "./products";

/** English copy for product cards. Food names stay in Spanish; drink names are translated. */
const EN_DESCRIPTIONS: Record<string, string> = {
  p1: "Breaded beef cutlet, lettuce, tomato and homemade mayo in crusty bread.",
  p2: "Steak, ham, cheese, egg, lettuce and tomato in artisan bread.",
  p3: "Grilled sausage, fresh chimichurri and crunchy bread.",
  p4: "Double patty, cheddar, bacon, egg and spring onion.",
  p5: "Cured bondiola, fresh arugula and spread cheese in artisan bread.",
  p6: "Ice-cold blonde beer, Argentine lager style.",
  p7: "Well-chilled 500ml bottle.",
  p8: "Assorted cold cuts + drink. Perfect for sharing.",
};

/** Only drinks get an English name; food names stay as they are. */
const EN_NAMES: Record<string, string> = {
  p6: "Craft Beer",
  p7: "Soda",
};

const EN_CATEGORIES: Record<string, string> = {
  "Sándwiches": "Sandwiches",
  Bebidas: "Drinks",
  Promos: "Deals",
};

export function productName(p: Product, lang: Lang) {
  return lang === "en" ? EN_NAMES[p.id] ?? p.nombre : p.nombre;
}

export function productDescription(p: Product, lang: Lang) {
  return lang === "en" ? EN_DESCRIPTIONS[p.id] ?? p.descripcion : p.descripcion;
}

export function categoryLabel(cat: string, lang: Lang) {
  return lang === "en" ? EN_CATEGORIES[cat] ?? cat : cat;
}
