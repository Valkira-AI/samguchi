import { useSyncExternalStore } from "react";
import { PRODUCTS } from "./products";

const KEY = "samguchi_availability_v1";
const listeners = new Set<() => void>();

type Map = Record<string, boolean>;
const EMPTY: Map = {};
let cache: Map | null = null;

function read(): Map {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    cache = {};
  }
  return cache!;
}

function write(m: Map) {
  cache = m;
  localStorage.setItem(KEY, JSON.stringify(m));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAvailability(): Map {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function isAvailable(id: string, overrides: Map): boolean {
  if (id in overrides) return overrides[id];
  const p = PRODUCTS.find((x) => x.id === id);
  return p ? p.disponible : true;
}

export function setAvailability(id: string, disponible: boolean) {
  write({ ...read(), [id]: disponible });
}
