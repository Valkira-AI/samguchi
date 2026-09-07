import { useMemo, useState } from "react";
import { Users, Bike, ChefHat, HandHelping, Trash2, Plus } from "lucide-react";
import { addTurno, contarNoches, deleteTurno, useTurnos } from "@/lib/staff-store";

function fmtFecha(f: string) {
  const d = new Date(`${f}T00:00:00`);
  return d.toLocaleDateString("es-AR", { weekday: "short", day: "2-digit", month: "short" });
}

export default function StaffPanel() {
  const turnos = useTurnos();
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [delivery, setDelivery] = useState("");
  const [cocinero, setCocinero] = useState("");
  const [ayudante, setAyudante] = useState("");

  const ranking = useMemo(() => contarNoches(turnos), [turnos]);

  const guardar = () => {
    if (!delivery.trim() && !cocinero.trim()) return;
    addTurno({ fecha, delivery: delivery.trim(), cocinero: cocinero.trim(), ayudante: ayudante.trim() });
    setDelivery("");
    setCocinero("");
    setAyudante("");
  };

  const input =
    "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-6">
      {/* Turnos */}
      <div className="lg:col-span-3 rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl">PERSONAL POR NOCHE</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2 mb-4">
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className={input} />
          <input placeholder="Delivery" value={delivery} onChange={(e) => setDelivery(e.target.value)} className={input} />
          <input placeholder="Cocinero" value={cocinero} onChange={(e) => setCocinero(e.target.value)} className={input} />
          <input placeholder="Ayudante (opcional)" value={ayudante} onChange={(e) => setAyudante(e.target.value)} className={input} />
          <button
            onClick={guardar}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>

        <ul className="space-y-2">
          {turnos.length === 0 && <li className="text-sm text-muted-foreground">Sin turnos cargados.</li>}
          {turnos.map((t) => (
            <li key={t.id} className="rounded-xl border border-border p-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-sm font-semibold capitalize min-w-24">{fmtFecha(t.fecha)}</span>
              <span className="inline-flex items-center gap-1 text-sm">
                <Bike className="h-4 w-4 text-blue-600" /> {t.delivery || "—"}
              </span>
              <span className="inline-flex items-center gap-1 text-sm">
                <ChefHat className="h-4 w-4 text-orange-600" /> {t.cocinero || "—"}
              </span>
              <span className="inline-flex items-center gap-1 text-sm">
                <HandHelping className="h-4 w-4 text-emerald-600" />
                {t.ayudante ? t.ayudante : <span className="text-muted-foreground">Sin ayudante</span>}
              </span>
              <button
                onClick={() => deleteTurno(t.id)}
                aria-label="Eliminar turno"
                className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Ranking noches */}
      <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
        <h2 className="font-display text-2xl mb-4">NOCHES TRABAJADAS</h2>
        <ul className="space-y-3">
          {ranking.length === 0 && <li className="text-sm text-muted-foreground">Sin datos.</li>}
          {ranking.map((p) => (
            <li key={`${p.nombre}-${p.rol}`} className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{p.nombre}</p>
                <p className="text-xs text-muted-foreground">{p.rol}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">
                {p.noches} {p.noches === 1 ? "noche" : "noches"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
