import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Bike, ChefHat, HandHelping, Clock, Package } from "lucide-react";
import type { Turno } from "@/lib/staff-store";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function StaffCalendar({ turnos }: { turnos: Turno[] }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [sel, setSel] = useState<string | null>(null);

  const porFecha = useMemo(() => {
    const m = new Map<string, Turno[]>();
    for (const t of turnos) {
      const arr = m.get(t.fecha) ?? [];
      arr.push(t);
      m.set(t.fecha, arr);
    }
    return m;
  }, [turnos]);

  const celdas = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const offset = (first.getDay() + 6) % 7; // lunes primero
    const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = Array.from({ length: offset }, () => null);
    for (let i = 1; i <= total; i++) out.push(new Date(cursor.getFullYear(), cursor.getMonth(), i));
    return out;
  }, [cursor]);

  const mesLabel = cursor.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  const hoy = ymd(new Date());

  const totalMes = useMemo(() => {
    let horas = 0;
    let envios = 0;
    for (const t of turnos) {
      if (t.fecha.startsWith(ymd(cursor).slice(0, 7))) {
        horas += t.horas;
        envios += t.envios;
      }
    }
    return { horas, envios };
  }, [turnos, cursor]);

  const detalle = sel ? (porFecha.get(sel) ?? []) : [];

  return (
    <div className="rounded-2xl bg-card border border-border p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="font-display text-2xl capitalize">{mesLabel}</h2>
        <div className="flex items-center gap-1">
          <button
            aria-label="Mes anterior"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Mes siguiente"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="rounded-lg p-2 hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DIAS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-muted-foreground py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const key = ymd(d);
          const items = porFecha.get(key) ?? [];
          const horas = items.reduce((a, t) => a + t.horas, 0);
          const envios = items.reduce((a, t) => a + t.envios, 0);
          const activo = items.length > 0;
          return (
            <button
              key={key}
              onClick={() => setSel(key)}
              className={`min-h-16 rounded-xl border p-1.5 text-left transition ${
                sel === key ? "border-primary ring-2 ring-primary/30" : "border-border hover:bg-muted/60"
              } ${activo ? "bg-primary/5" : ""}`}
            >
              <span className={`text-xs font-semibold ${key === hoy ? "text-primary" : "text-foreground"}`}>
                {d.getDate()}
              </span>
              {activo && (
                <span className="mt-1 block text-[10px] leading-tight text-muted-foreground">
                  {horas}h{envios > 0 ? ` · ${envios} env.` : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
          <Clock className="h-3.5 w-3.5 text-primary" /> {totalMes.horas} horas en el mes
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1">
          <Package className="h-3.5 w-3.5 text-blue-600" /> {totalMes.envios} envíos en el mes
        </span>
      </div>

      {sel && (
        <div className="mt-4 rounded-xl border border-border p-3">
          <p className="text-sm font-semibold mb-2 capitalize">
            {new Date(`${sel}T00:00:00`).toLocaleDateString("es-AR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </p>
          {detalle.length === 0 && <p className="text-sm text-muted-foreground">Nadie cargado para este día.</p>}
          <ul className="space-y-2">
            {detalle.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="inline-flex items-center gap-1">
                  <Bike className="h-4 w-4 text-blue-600" /> {t.delivery || "—"}
                  <span className="text-muted-foreground">({t.envios} envíos)</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <ChefHat className="h-4 w-4 text-orange-600" /> {t.cocinero || "—"}
                </span>
                <span className="inline-flex items-center gap-1">
                  <HandHelping className="h-4 w-4 text-emerald-600" /> {t.ayudante || "Sin ayudante"}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" /> {t.horas} h
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
