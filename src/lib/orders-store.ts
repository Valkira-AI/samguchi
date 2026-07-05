import { useSyncExternalStore } from "react";

export type OrderItem = {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
};

export type Order = {
  id: string;
  fecha: string; // ISO
  cliente: string;
  items: OrderItem[];
  total: number;
  estado: "Nuevo" | "En Preparación" | "Despachado" | "Finalizado";
};

const KEY = "samguchi_orders_v1";

const listeners = new Set<() => void>();

const EMPTY: Order[] = [];
let cache: Order[] | null = null;

function read(): Order[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    cache = [];
  }
  return cache!;
}

function write(orders: Order[]) {
  cache = orders;
  localStorage.setItem(KEY, JSON.stringify(orders));
  listeners.forEach((l) => l());
}

export function useOrders(): Order[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
}

export function addOrder(order: Omit<Order, "id" | "fecha" | "estado">): Order {
  const full: Order = {
    ...order,
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    fecha: new Date().toISOString(),
    estado: "Nuevo",
  };
  write([full, ...read()]);
  return full;
}

export function updateOrderState(id: string, estado: Order["estado"]) {
  write(read().map((o) => (o.id === id ? { ...o, estado } : o)));
}

export function deleteOrder(id: string) {
  write(read().filter((o) => o.id !== id));
}
