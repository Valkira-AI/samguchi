import { useSyncExternalStore } from "react";

export type Turno = {
  id: string;
  fecha: string; // YYYY-MM-DD
  delivery: string;
  cocinero: string;
  ayudante: string; // "" = no hubo
  horas: number; // horas trabajadas esa noche
  envios: number; // envíos hechos por el delivery
};

const KEY = "samguchi_turnos_v1";
const listeners = new Set<() => void>();
const EMPTY: Turno[] = [];
let cache: Turno[] | null = null;

const DEMO: Turno[] = [
  { id: "T-1", fecha: hoyMenos(0), delivery: "Dominick", cocinero: "Patricia", ayudante: "Nahuel", horas: 5, envios: 14 },
  { id: "T-2", fecha: hoyMenos(1), delivery: "Dominick", cocinero: "Patricia", ayudante: "", horas: 4.5, envios: 11 },
  { id: "T-3", fecha: hoyMenos(2), delivery: "Lucas", cocinero: "Patricia", ayudante: "Nahuel", horas: 5, envios: 17 },
  { id: "T-4", fecha: hoyMenos(3), delivery: "Lucas", cocinero: "Marcos", ayudante: "", horas: 4, envios: 9 },
];

function hoyMenos(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function normalizar(t: any): Turno {
  return {
    id: String(t?.id ?? `T-${Math.random().toString(36).slice(2)}`),
    fecha: String(t?.fecha ?? hoyMenos(0)),
    delivery: String(t?.delivery ?? ""),
    cocinero: String(t?.cocinero ?? ""),
    ayudante: String(t?.ayudante ?? ""),
    horas: Number(t?.horas) || 0,
    envios: Number(t?.envios) || 0,
  };
}

function read(): Turno[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? (JSON.parse(raw) as any[]).map(normalizar) : DEMO;
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

export type NochesPorPersona = { nombre: string; rol: string; noches: number; horas: number; envios: number };

export function contarNoches(turnos: Turno[]): NochesPorPersona[] {
  const mapa = new Map<string, NochesPorPersona>();
  const sumar = (nombre: string, rol: string, horas: number, envios: number) => {
    const n = nombre.trim();
    if (!n) return;
    const k = `${n}|${rol}`;
    const prev = mapa.get(k);
    if (prev) {
      prev.noches += 1;
      prev.horas += horas;
      prev.envios += envios;
    } else mapa.set(k, { nombre: n, rol, noches: 1, horas, envios });
  };
  for (const t of turnos) {
    sumar(t.delivery, "Delivery", t.horas, t.envios);
    sumar(t.cocinero, "Cocinero", t.horas, 0);
    sumar(t.ayudante, "Ayudante", t.horas, 0);
  }
  return [...mapa.values()].sort((a, b) => b.noches - a.noches);
}
