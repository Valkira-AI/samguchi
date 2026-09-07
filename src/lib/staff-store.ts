import { useSyncExternalStore } from "react";

export type Turno = {
  id: string;
  fecha: string; // YYYY-MM-DD
  delivery: string;
  cocinero: string;
  ayudante: string; // "" = no hubo
};

const KEY = "samguchi_turnos_v1";
const listeners = new Set<() => void>();
const EMPTY: Turno[] = [];
let cache: Turno[] | null = null;

const DEMO: Turno[] = [
  { id: "T-1", fecha: hoyMenos(0), delivery: "Dominick", cocinero: "Patricia", ayudante: "Nahuel" },
  { id: "T-2", fecha: hoyMenos(1), delivery: "Dominick", cocinero: "Patricia", ayudante: "" },
  { id: "T-3", fecha: hoyMenos(2), delivery: "Lucas", cocinero: "Patricia", ayudante: "Nahuel" },
  { id: "T-4", fecha: hoyMenos(3), delivery: "Lucas", cocinero: "Marcos", ayudante: "" },
];

function hoyMenos(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function read(): Turno[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? JSON.parse(raw) : DEMO;
  } catch {
    cache = DEMO;
  }
  return cache!;
}

function write(t: Turno[]) {
  cache = t;
  localStorage.setItem(KEY, JSON.stringify(t));
  listeners.forEach((l) => l());
}

export function useTurnos(): Turno[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => EMPTY,
  );
}

export function addTurno(t: Omit<Turno, "id">) {
  write([{ ...t, id: `T-${Date.now().toString(36).toUpperCase()}` }, ...read()]);
}

export function deleteTurno(id: string) {
  write(read().filter((t) => t.id !== id));
}

export type NochesPorPersona = { nombre: string; rol: string; noches: number };

export function contarNoches(turnos: Turno[]): NochesPorPersona[] {
  const mapa = new Map<string, NochesPorPersona>();
  const sumar = (nombre: string, rol: string) => {
    const n = nombre.trim();
    if (!n) return;
    const k = `${n}|${rol}`;
    const prev = mapa.get(k);
    if (prev) prev.noches += 1;
    else mapa.set(k, { nombre: n, rol, noches: 1 });
  };
  for (const t of turnos) {
    sumar(t.delivery, "Delivery");
    sumar(t.cocinero, "Cocinero");
    sumar(t.ayudante, "Ayudante");
  }
  return [...mapa.values()].sort((a, b) => b.noches - a.noches);
}
