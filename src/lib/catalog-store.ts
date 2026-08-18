import { useSyncExternalStore } from "react";
import { PRODUCTS, type Product } from "./products";

const KEY = "samguchi_catalog_v1";
const listeners = new Set<() => void>();

type Patch = Partial<Omit<Product, "id">>;
type State = {
  patches: Record<string, Patch>;
  custom: Product[];
  deleted: string[];
};

const EMPTY_STATE: State = { patches: {}, custom: [], deleted: [] };

let state: State | null = null;
let snapshot: Product[] | null = null;
const serverSnapshot: Product[] = PRODUCTS;

function readState(): State {
  if (state) return state;
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    state = raw
      ? { patches: raw.patches ?? {}, custom: raw.custom ?? [], deleted: raw.deleted ?? [] }
      : { patches: {}, custom: [], deleted: [] };
  } catch {
    state = { patches: {}, custom: [], deleted: [] };
  }
  return state;
}

function compute(s: State): Product[] {
  const base = PRODUCTS.filter((p) => !s.deleted.includes(p.id)).map((p) => ({ ...p, ...s.patches[p.id] }));
  const custom = s.custom
    .filter((p) => !s.deleted.includes(p.id))
    .map((p) => ({ ...p, ...s.patches[p.id] }));
  return [...base, ...custom];
}

function getSnapshot(): Product[] {
  if (typeof window === "undefined") return serverSnapshot;
  if (!snapshot) snapshot = compute(readState());
  return snapshot;
}

function commit(next: State) {
  state = next;
  snapshot = null;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = null;
      snapshot = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useCatalog(): Product[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export function updateProduct(id: string, patch: Patch) {
  const s = readState();
  commit({ ...s, patches: { ...s.patches, [id]: { ...s.patches[id], ...patch } } });
}

export function setProductAvailability(id: string, disponible: boolean) {
  updateProduct(id, { disponible });
}

export function createProduct(p: Omit<Product, "id">): Product {
  const s = readState();
  const product: Product = { ...p, id: `c${Date.now().toString(36)}` };
  commit({ ...s, custom: [...s.custom, product] });
  return product;
}

export function deleteProduct(id: string) {
  const s = readState();
  if (s.deleted.includes(id)) return;
  commit({ ...s, deleted: [...s.deleted, id] });
}

export function resetCatalog() {
  commit({ patches: {}, custom: [], deleted: [] });
}
