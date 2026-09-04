import { useSyncExternalStore } from "react";

export type Lang = "es" | "en";

const KEY = "samguchi_lang_v1";
let current: Lang = "es";
let hydrated = false;
const listeners = new Set<() => void>();

function read(): Lang {
  if (typeof window === "undefined") return "es";
  const v = window.localStorage.getItem(KEY);
  return v === "en" ? "en" : "es";
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  if (!hydrated) {
    hydrated = true;
    current = read();
  }
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = read();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function setLang(lang: Lang) {
  current = lang;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, lang);
  if (typeof document !== "undefined") document.documentElement.lang = lang;
  emit();
}

const dict = {
  es: {
    "nav.inicio": "Inicio",
    "nav.productos": "Productos",
    "nav.nosotros": "Nosotros",
    "nav.contacto": "Contacto",
    "brand.tagline": "El sándwich que te gusta",

    "home.badge": "Jujuy · Sabor argentino",
    "home.title1": "Sándwiches que",
    "home.title2": "se sienten en el alma",
    "home.lead":
      "Milanesas doradas al punto justo, lomitos que no se guardan nada y un choripán que lleva el sello jujeño en cada chispa de chimichurri. Compartí con nosotros el gusto de lo auténtico.",
    "home.cta": "Ver el menú",
    "home.promos": "Promos más vendidas",
    "home.promosSub": "Lo que más piden nuestros clientes.",
    "home.masPedido": "Más pedido",
    "home.pedir": "Pedir",

    "menu.title": "Nuestro menú",
    "menu.sub": "Elegí, sumá al pedido y enviálo por WhatsApp.",
    "menu.open": "Abierto ahora · Pedidos de",
    "menu.closed": "Cerrado · Pedidos de",
    "menu.hs": "hs",
    "menu.all": "Todos",
    "menu.noImage": "Sin imagen",
    "menu.available": "Disponible",
    "menu.unavailable": "No disponible",
    "menu.add": "Agregar",
    "menu.cart": "Carrito",
    "menu.openCart": "Abrir carrito",
    "menu.yourOrder": "Tu pedido",
    "menu.empty": "Tu pedido está vacío.",
    "menu.clear": "Vaciar",
    "menu.close": "Cerrar",
    "menu.each": "c/u",
    "menu.yourName": "Tu nombre",
    "menu.total": "Total",
    "menu.closedNotice": "Estamos cerrados. Tomamos pedidos de",
    "menu.send": "Enviar por WhatsApp",
    "menu.closedBtn": "Cerrado ·",
    "menu.added": "Agregado al pedido",
    "menu.cleared": "Pedido vaciado",
    "menu.errEmpty": "Tu pedido está vacío",
    "menu.errName": "Ingresá tu nombre",
    "menu.errClosed": "Estamos cerrados. Pedidos de",
    "menu.sent": "Pedido registrado:",
    "menu.sentTitle": "¡Pedido enviado!",
    "menu.sentSub": "Si WhatsApp no se abrió automáticamente, tocá el siguiente enlace:",
    "menu.openWa": "Abrir WhatsApp",
    "menu.variantOf": "Variante de",
    "menu.waGreet": "Hola Sam Guchi! Soy",
    "menu.waWant": "Quiero pedir",

    "about.title": "Nosotros",
    "about.lead":
      "Sam Guchi nació en el corazón de Jujuy con una idea simple: un sándwich bien hecho alegra el día.",
    "about.c1t": "Hecho a mano",
    "about.c1d": "Cada milanesa, cada pan y cada salsa se preparan en el día.",
    "about.c2t": "Productos de la tierra",
    "about.c2d": "Trabajamos con proveedores jujeños y carnes de primera calidad.",
    "about.c3t": "Atención cercana",
    "about.c3d": "Pedís por WhatsApp y te respondemos como si estuvieras en el mostrador.",

    "contact.title": "Contacto",
    "contact.sub": "Escribinos y armamos tu pedido al toque.",
    "contact.formTitle": "Dejanos tu mensaje",
    "contact.name": "Nombre",
    "contact.namePh": "Tu nombre",
    "contact.email": "Email",
    "contact.phone": "Teléfono",
    "contact.branch": "Sucursal",
    "contact.message": "Mensaje",
    "contact.messagePh": "Contanos en qué te podemos ayudar",
    "contact.submit": "Enviar consulta",
    "contact.thanks": "¡Gracias! Te contactamos a la brevedad.",

    "footer.contact": "Contacto",
    "footer.hoursSocial": "Horarios & Redes",
    "footer.hours": "Lun a Dom · 20:00 a 00:30",
    "footer.ordersWithin": "Pedidos online dentro de ese horario.",
    "footer.rights": "Todos los derechos reservados.",
    "footer.admin": "Panel de administración",

    "lang.label": "Idioma",
  },
  en: {
    "nav.inicio": "Home",
    "nav.productos": "Products",
    "nav.nosotros": "About us",
    "nav.contacto": "Contact",
    "brand.tagline": "The sandwich you love",

    "home.badge": "Jujuy · Argentine flavor",
    "home.title1": "Sandwiches you",
    "home.title2": "feel in your soul",
    "home.lead":
      "Golden milanesas cooked just right, lomitos that hold nothing back and a choripán carrying the Jujuy stamp in every spark of chimichurri. Share with us the taste of the real thing.",
    "home.cta": "See the menu",
    "home.promos": "Best sellers",
    "home.promosSub": "What our customers order the most.",
    "home.masPedido": "Best seller",
    "home.pedir": "Order",

    "menu.title": "Our menu",
    "menu.sub": "Pick your items, add them to the order and send it via WhatsApp.",
    "menu.open": "Open now · Orders from",
    "menu.closed": "Closed · Orders from",
    "menu.hs": "hs",
    "menu.all": "All",
    "menu.noImage": "No image",
    "menu.available": "Available",
    "menu.unavailable": "Unavailable",
    "menu.add": "Add",
    "menu.cart": "Cart",
    "menu.openCart": "Open cart",
    "menu.yourOrder": "Your order",
    "menu.empty": "Your order is empty.",
    "menu.clear": "Clear",
    "menu.close": "Close",
    "menu.each": "each",
    "menu.yourName": "Your name",
    "menu.total": "Total",
    "menu.closedNotice": "We're closed. We take orders from",
    "menu.send": "Send via WhatsApp",
    "menu.closedBtn": "Closed ·",
    "menu.added": "Added to your order",
    "menu.cleared": "Order cleared",
    "menu.errEmpty": "Your order is empty",
    "menu.errName": "Please enter your name",
    "menu.errClosed": "We're closed. Orders from",
    "menu.sent": "Order registered:",
    "menu.sentTitle": "Order sent!",
    "menu.sentSub": "If WhatsApp didn't open automatically, tap the link below:",
    "menu.openWa": "Open WhatsApp",
    "menu.variantOf": "Variant of",
    "menu.waGreet": "Hi Sam Guchi! I'm",
    "menu.waWant": "I'd like to order",

    "about.title": "About us",
    "about.lead":
      "Sam Guchi was born in the heart of Jujuy with a simple idea: a well-made sandwich brightens the day.",
    "about.c1t": "Handmade",
    "about.c1d": "Every milanesa, every bread and every sauce is prepared fresh each day.",
    "about.c2t": "Local products",
    "about.c2d": "We work with suppliers from Jujuy and top-quality meats.",
    "about.c3t": "Personal service",
    "about.c3d": "You order on WhatsApp and we reply as if you were at the counter.",

    "contact.title": "Contact",
    "contact.sub": "Write to us and we'll set up your order right away.",
    "contact.formTitle": "Leave us a message",
    "contact.name": "Name",
    "contact.namePh": "Your name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.branch": "Branch",
    "contact.message": "Message",
    "contact.messagePh": "Tell us how we can help you",
    "contact.submit": "Send message",
    "contact.thanks": "Thanks! We'll get back to you shortly.",

    "footer.contact": "Contact",
    "footer.hoursSocial": "Hours & Social",
    "footer.hours": "Mon to Sun · 20:00 to 00:30",
    "footer.ordersWithin": "Online orders within those hours.",
    "footer.rights": "All rights reserved.",
    "footer.admin": "Admin panel",

    "lang.label": "Language",
  },
} as const;

export type TKey = keyof (typeof dict)["es"];

export function useLang() {
  const lang = useSyncExternalStore(
    subscribe,
    () => current,
    () => "es" as Lang,
  );
  const t = (key: TKey) => dict[lang][key] ?? dict.es[key];
  return { lang, setLang, t };
}
