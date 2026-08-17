import milanesaAsset from "@/assets/milanesa-real.png.asset.json";
import lomitoAsset from "@/assets/lomito-completo.png.asset.json";
import choripanAsset from "@/assets/choripan-real.png.asset.json";
import hamburguesaAsset from "@/assets/hamburguesa-completa.png.asset.json";
import pebete from "@/assets/pebete.jpg";
import cerveza from "@/assets/cerveza.jpg";
import gaseosaAsset from "@/assets/gaseosa-cola.png.asset.json";
import promoAsset from "@/assets/picada-jujena.png.asset.json";

const lomito = lomitoAsset.url;
const hamburguesa = hamburguesaAsset.url;
const gaseosa = gaseosaAsset.url;
const promo = promoAsset.url;

export type Category = "Sándwiches" | "Bebidas" | "Promos";

export type Product = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Category;
  imagen: string;
  disponible: boolean;
};

export const PRODUCTS: Product[] = [
  { id: "p1", nombre: "Sándwich de Milanesa", descripcion: "Milanesa de ternera, lechuga, tomate y mayo casera en pan crujiente.", precio: 5200, categoria: "Sándwiches", imagen: milanesaAsset.url, disponible: true },
  { id: "p2", nombre: "Lomito Completo", descripcion: "Lomo, jamón, queso, huevo, lechuga y tomate en pan artesanal.", precio: 7200, categoria: "Sándwiches", imagen: lomito, disponible: true },
  { id: "p3", nombre: "Choripán con Chimichurri", descripcion: "Chorizo parrillero, chimichurri fresco y pan crocante.", precio: 4400, categoria: "Sándwiches", imagen: choripanAsset.url, disponible: true },
  { id: "p4", nombre: "Hamburguesa Completa", descripcion: "Doble medallón, cheddar, panceta, huevo y verdeo.", precio: 6400, categoria: "Sándwiches", imagen: hamburguesa, disponible: true },
  { id: "p5", nombre: "Pebete Jamón y Queso", descripcion: "Clásico pebete tierno con jamón cocido y queso derretido.", precio: 3700, categoria: "Sándwiches", imagen: pebete, disponible: true },
  { id: "p6", nombre: "Cerveza Artesanal", descripcion: "Rubia bien fría, estilo lager argentina.", precio: 2900, categoria: "Bebidas", imagen: cerveza, disponible: true },
  { id: "p7", nombre: "Gaseosa Línea Cola", descripcion: "Botella 500ml bien helada.", precio: 2100, categoria: "Bebidas", imagen: gaseosa, disponible: true },
  { id: "p8", nombre: "Combo Picada Jujeña", descripcion: "Variedad de fiambres + Bebida. Ideal para compartir.", precio: 10300, categoria: "Promos", imagen: promo, disponible: true },
];

export const CATEGORIES: Category[] = ["Sándwiches", "Bebidas", "Promos"];

export const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
