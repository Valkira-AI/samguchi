import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Download, LayoutGrid, Package, BarChart3, LogOut, Pencil, User, ChevronRight, DollarSign, ArrowLeft, Lock, Plus, Trash2 } from "lucide-react";
import { updateOrderState, useOrders, type Order } from "@/lib/orders-store";
import { formatARS, CATEGORIES, type Product, type Category } from "@/lib/products";
import { useCatalog, updateProduct, setProductAvailability, createProduct, deleteProduct } from "@/lib/catalog-store";
import { checkAdminSession, unlockAdmin, lockAdmin } from "@/lib/admin-gate.functions";
import { HOURS_LABEL, isOrderInServiceHours } from "@/lib/hours";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel · Sam Guchi" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Section = "pedidos" | "catalogo" | "reportes";


/* ---------- demo prototype data ---------- */
type DemoOrder = {
  id: string;
  estado: Order["estado"];
  cliente: string;
  hora: string;
  items: { cant: number; nombre: string }[];
  total: number;
};
const DEMO_ORDERS: DemoOrder[] = [
  { id: "#1001", estado: "Nuevo", cliente: "Marcos R.", hora: "20:32 hs", items: [{ cant: 2, nombre: "Milanesa Simple" }, { cant: 2, nombre: "Coca-Cola 500ml" }], total: 8800 },
  { id: "#1002", estado: "En Preparación", cliente: "Laura G.", hora: "20:55 hs", items: [{ cant: 1, nombre: "Lomito Simple" }, { cant: 1, nombre: "Agua Mineral 500ml" }], total: 6600 },
  { id: "#1003", estado: "Despachado", cliente: "Diego M.", hora: "21:40 hs", items: [{ cant: 1, nombre: "Hamburguesa Clásica" }, { cant: 1, nombre: "Jugo Natural" }], total: 5700 },
  { id: "#1004", estado: "Finalizado", cliente: "Sofía P.", hora: "22:30 hs", items: [{ cant: 2, nombre: "Milanesa Completa" }], total: 9000 },
  { id: "#1005", estado: "Finalizado", cliente: "Julián A.", hora: "23:15 hs", items: [{ cant: 1, nombre: "Lomito Completo" }, { cant: 2, nombre: "Coca-Cola 500ml" }], total: 8800 },
];

const NEXT_STATE: Record<Order["estado"], Order["estado"] | null> = {
  Nuevo: "En Preparación",
  "En Preparación": "Despachado",
  Despachado: "Finalizado",
  Finalizado: null,
};

const ESTADO_STYLES: Record<Order["estado"], string> = {
  Nuevo: "bg-yellow-100 text-yellow-800 border-yellow-300",
  "En Preparación": "bg-blue-100 text-blue-800 border-blue-300",
  Despachado: "bg-orange-100 text-orange-800 border-orange-300",
  Finalizado: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

function Admin() {
  const check = useServerFn(checkAdminSession);
  const unlock = useServerFn(unlockAdmin);
  const lock = useServerFn(lockAdmin);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [section, setSection] = useState<Section>("pedidos");

  useEffect(() => {
    check().then((r) => setAuthed(r.unlocked)).catch(() => setAuthed(false));
  }, [check]);

  const handleLogout = async () => {
    try { await lock(); } catch { /* ignore */ }
    setAuthed(false);
    setPwd("");
  };

  if (authed === null) {
    return <div className="min-h-screen grid place-items-center bg-background text-sm text-muted-foreground">Cargando…</div>;
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (submitting) return;
            setSubmitting(true);
            try {
              const res = await unlock({ data: { password: pwd } });
              if (res.ok) { setAuthed(true); setError(false); setPwd(""); }
              else setError(true);
            } catch {
              setError(true);
            } finally {
              setSubmitting(false);
            }
          }}
          className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-warm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-primary leading-none">SAM GUCHI</h1>
              <p className="text-xs text-muted-foreground">Panel Admin</p>
            </div>
          </div>
          <label className="text-sm font-medium">Contraseña</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => { setPwd(e.target.value); setError(false); }}
            autoFocus
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="••••••••"
          />
          {error && <p className="mt-2 text-xs text-destructive">Contraseña incorrecta</p>}
          <button disabled={submitting} className="mt-4 w-full rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
            {submitting ? "Verificando…" : "Ingresar"}
          </button>
          <Link to="/" className="mt-4 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Volver al inicio
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:flex bg-[oklch(0.96_0.02_75)]">
      {/* Mobile top bar */}
      <div className="md:hidden bg-[#1a1a1a] text-white sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <h1 className="font-display text-xl text-[oklch(0.78_0.17_75)] leading-none">SAM GUCHI</h1>
            <p className="text-[10px] text-white/60 mt-0.5">Panel Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
        <nav className="flex px-2 py-2 gap-1 overflow-x-auto">
          <MobileNavBtn icon={LayoutGrid} label="Pedidos" active={section === "pedidos"} onClick={() => setSection("pedidos")} />
          <MobileNavBtn icon={Package} label="Catálogo" active={section === "catalogo"} onClick={() => setSection("catalogo")} />
          <MobileNavBtn icon={BarChart3} label="Reportes" active={section === "reportes"} onClick={() => setSection("reportes")} />
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 bg-[#1a1a1a] text-white flex-col fixed inset-y-0 left-0 z-40 overflow-y-auto">
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="font-display text-2xl text-[oklch(0.78_0.17_75)] leading-none">SAM GUCHI</h1>
          <p className="text-xs text-white/60 mt-1">Panel Admin</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavBtn icon={LayoutGrid} label="Pedidos" active={section === "pedidos"} onClick={() => setSection("pedidos")} />
          <NavBtn icon={Package} label="Catálogo" active={section === "catalogo"} onClick={() => setSection("catalogo")} />
          <NavBtn icon={BarChart3} label="Reportes" active={section === "reportes"} onClick={() => setSection("reportes")} />
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-4 py-6 md:px-10 md:py-8 md:ml-60">
        {section === "pedidos" && <PedidosView />}
        {section === "catalogo" && <CatalogoView />}
        {section === "reportes" && <ReportesView />}
      </main>
    </div>
  );
}

function MobileNavBtn({ icon: Icon, label, active, onClick }: { icon: typeof LayoutGrid; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
        active ? "bg-primary text-primary-foreground" : "text-white/70 hover:bg-white/5"
      }`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}




function NavBtn({ icon: Icon, label, active, onClick }: { icon: typeof LayoutGrid; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
        active ? "bg-primary text-primary-foreground" : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

/* ---------- Pedidos ---------- */
function PedidosView() {
  const allOrders = useOrders();
  const realOrders = useMemo(
    () => allOrders.filter((o) => isOrderInServiceHours(o.fecha)),
    [allOrders],
  );
  const [demoStates, setDemoStates] = useState<Record<string, Order["estado"]>>(
    () => Object.fromEntries(DEMO_ORDERS.map((o) => [o.id, o.estado])),
  );

  const demoList = DEMO_ORDERS.map((o) => ({ ...o, estado: demoStates[o.id] }));
  const counts = useMemo(() => {
    const all = [
      ...demoList.map((d) => d.estado),
      ...realOrders.map((r) => r.estado),
    ];
    return {
      Nuevo: all.filter((e) => e === "Nuevo").length,
      "En Preparación": all.filter((e) => e === "En Preparación").length,
      Despachado: all.filter((e) => e === "Despachado").length,
      Finalizado: all.filter((e) => e === "Finalizado").length,
    };
  }, [demoList, realOrders]);

  const advanceDemo = (id: string) => {
    setDemoStates((s) => {
      const next = NEXT_STATE[s[id]];
      if (!next) return s;
      return { ...s, [id]: next };
    });
    toast.success("Estado actualizado");
  };

  return (
    <div>
      <h1 className="font-display text-2xl md:text-4xl mb-2 text-foreground">DASHBOARD DE PEDIDOS</h1>
      <p className="mb-6 inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
        Horario de pedidos: {HOURS_LABEL} hs
      </p>

      {/* Línea de producción */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-[640px] items-stretch gap-2">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const active = counts[s.id] > 0;
            return (
              <div key={s.id} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex-1 rounded-2xl border p-4 transition ${
                    active ? `${ESTADO_STYLES[s.id]} shadow-sm` : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`h-5 w-5 ${active ? "" : "opacity-50"}`} />
                    <span className="font-display text-2xl leading-none">{counts[s.id]}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide">{s.label}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className="h-full rounded-full bg-current transition-all"
                      style={{ width: `${totalPipeline ? (counts[s.id] / totalPipeline) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <ChevronRight className={`h-5 w-5 shrink-0 ${active ? "text-primary" : "text-muted-foreground/40"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablero de trayectoria */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STAGES.map((s) => {
          const Icon = s.icon;
          const col = demoList.filter((o) => o.estado === s.id);
          return (
            <div key={s.id} className="rounded-2xl border border-border bg-muted/40 p-3">
              <div className="mb-3 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${ESTADO_STYLES[s.id]}`}>
                  <Icon className="h-3.5 w-3.5" /> {s.label}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">{col.length}</span>
              </div>
              <div className="space-y-3">
                {col.length === 0 && (
                  <p className="rounded-xl border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                    Sin pedidos
                  </p>
                )}
                {col.map((o) => {
                  const next = NEXT_STATE[o.estado];
                  const step = STAGES.findIndex((x) => x.id === o.estado) + 1;
                  return (
                    <div key={o.id} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-display text-xl">{o.id}</span>
                        <span className="text-xs text-muted-foreground">{o.hora}</span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        {o.cliente}
                      </p>
                      <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                        {o.items.map((i, idx) => (
                          <li key={idx}>
                            {i.cant}× {i.nombre}
                          </li>
                        ))}
                      </ul>
                      {/* mini trayectoria */}
                      <div className="mt-3 flex items-center gap-1">
                        {STAGES.map((st, idx) => (
                          <div key={st.id} className="flex flex-1 items-center gap-1">
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${idx < step ? "bg-primary" : "bg-border"}`}
                            />
                            {idx < STAGES.length - 1 && (
                              <span className={`h-0.5 flex-1 rounded-full ${idx < step - 1 ? "bg-primary" : "bg-border"}`} />
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">Etapa {step} de {STAGES.length}</p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="font-display text-lg text-primary">{formatARS(o.total)}</span>
                        {next && (
                          <button
                            onClick={() => advanceDemo(o.id)}
                            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                          >
                            {next} <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">


        {realOrders.length > 0 && (
          <>
            <h2 className="font-display text-2xl mt-8 mb-2">Historial de pedidos · {HOURS_LABEL} hs</h2>
            {realOrders.map((o) => (
              <div key={o.id} className="rounded-2xl bg-card border border-border p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="font-mono text-sm">{o.id}</span>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ESTADO_STYLES[o.estado]}`}>{o.estado}</span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground"><User className="h-3.5 w-3.5" />{o.cliente}</span>
                    </div>
                    <ul className="text-sm text-muted-foreground">
                      {o.items.map((i) => <li key={i.id}>{i.cantidad}× {i.nombre}</li>)}
                    </ul>
                    <p className="mt-3 font-display text-2xl text-primary">{formatARS(o.total)}</p>
                  </div>
                  <select
                    value={o.estado}
                    onChange={(e) => updateOrderState(o.id, e.target.value as Order["estado"])}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {(["Nuevo", "En Preparación", "Despachado", "Finalizado"] as const).map((s) =>
                      <option key={s} value={s}>{s}</option>
                    )}
                  </select>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Catálogo ---------- */
type Draft = Omit<Product, "id"> & { id?: string };

const EMPTY_DRAFT: Draft = {
  nombre: "",
  descripcion: "",
  precio: 0,
  categoria: "Sándwiches",
  imagen: "",
  disponible: true,
};

function CatalogoView() {
  const items = useCatalog();
  const [editing, setEditing] = useState<Draft | null>(null);

  const toggle = (p: Product) => {
    setProductAvailability(p.id, !p.disponible);
    toast.success(!p.disponible ? "Producto marcado disponible" : "Producto marcado no disponible");
  };

  const save = (d: Draft) => {
    if (!d.nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }
    if (!Number.isFinite(d.precio) || d.precio < 0) {
      toast.error("Precio inválido");
      return;
    }
    if (d.id) {
      const { id, ...patch } = d;
      updateProduct(id, patch);
      toast.success("Producto actualizado");
    } else {
      const { id: _omit, ...rest } = d;
      createProduct(rest);
      toast.success("Producto creado");
    }
    setEditing(null);
  };

  const remove = (p: Product) => {
    if (!window.confirm(`¿Eliminar "${p.nombre}" del catálogo?`)) return;
    deleteProduct(p.id);
    toast.success("Producto eliminado");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl md:text-4xl text-foreground">GESTIÓN DE CATÁLOGO</h1>
        <button
          onClick={() => setEditing({ ...EMPTY_DRAFT })}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nuevo producto
        </button>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_100px] px-6 py-4 border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div>Producto</div><div>Categoría</div><div>Precio</div><div>Disponible</div><div />
        </div>
        {items.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">No hay productos en el catálogo.</div>
        )}
        {items.map((it) => (
          <div
            key={it.id}
            className={`flex flex-col gap-3 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_100px] md:items-center px-4 md:px-6 py-3 border-b border-border/60 last:border-0 ${!it.disponible ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {it.imagen
                ? <img src={it.imagen} alt={it.nombre} className="h-11 w-11 shrink-0 rounded-full object-cover" />
                : <div className="h-11 w-11 shrink-0 rounded-full bg-muted" />}
              <span className="font-medium truncate">{it.nombre}</span>
            </div>
            <div className="text-sm text-muted-foreground md:block">
              <span className="md:hidden text-xs uppercase tracking-wide mr-2">Categoría:</span>{it.categoria}
            </div>
            <div className="font-display text-xl text-primary">{formatARS(it.precio)}</div>
            <div className="flex items-center justify-between md:block">
              <span className="md:hidden text-xs uppercase tracking-wide text-muted-foreground">Disponible</span>
              <button
                onClick={() => toggle(it)}
                className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-bold uppercase transition ${
                  it.disponible
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-red-300 bg-red-50 text-red-700"
                }`}
              >
                {it.disponible ? "Sí" : "No"}
              </button>
            </div>
            <div className="flex gap-1 self-end md:self-auto md:justify-self-end">
              <button
                onClick={() => setEditing({ ...it })}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
                aria-label={`Editar ${it.nombre}`}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(it)}
                className="grid h-9 w-9 place-items-center rounded-full text-red-600 hover:bg-red-50"
                aria-label={`Eliminar ${it.nombre}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 overflow-y-auto" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6 border border-border" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-4">{editing.id ? "Editar producto" : "Nuevo producto"}</h2>
            <label className="text-sm font-medium">Nombre</label>
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editing.nombre}
              onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
            />
            <label className="mt-3 block text-sm font-medium">Descripción</label>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editing.descripcion}
              onChange={(e) => setEditing({ ...editing, descripcion: e.target.value })}
            />
            <label className="mt-3 block text-sm font-medium">Categoría</label>
            <select
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editing.categoria}
              onChange={(e) => setEditing({ ...editing, categoria: e.target.value as Category })}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <label className="mt-3 block text-sm font-medium">Precio</label>
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editing.precio}
              onChange={(e) => setEditing({ ...editing, precio: Number(e.target.value) })}
            />
            <label className="mt-3 block text-sm font-medium">Imagen (URL)</label>
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editing.imagen}
              onChange={(e) => setEditing({ ...editing, imagen: e.target.value })}
            />
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.disponible}
                onChange={(e) => setEditing({ ...editing, disponible: e.target.checked })}
              />
              Disponible
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted">Cancelar</button>
              <button onClick={() => save(editing)} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Reportes ---------- */
type Periodo = "semanal" | "mensual" | "anual";

const REPORTES: Record<
  Periodo,
  {
    etiqueta: string;
    rango: string;
    ingresos: number;
    pedidos: number;
    ticket: number;
    productosActivos: number;
    crecimiento: string;
    mejorMomento: string;
    categoriaTop: string;
    serieLabel: string;
    serie: { label: string; valor: number }[];
    topProducts: { nombre: string; uds: number; total: number }[];
  }
> = {
  semanal: {
    etiqueta: "Semanal",
    rango: "Lun 17 – Dom 23 de agosto",
    ingresos: 486300,
    pedidos: 108,
    ticket: 4503,
    productosActivos: 12,
    crecimiento: "+8,4% vs. semana anterior",
    mejorMomento: "Sábado (21:30 a 23:00)",
    categoriaTop: "Sándwiches",
    serieLabel: "Ventas por día",
    serie: [
      { label: "Lun", valor: 42300 },
      { label: "Mar", valor: 38700 },
      { label: "Mié", valor: 51200 },
      { label: "Jue", valor: 64800 },
      { label: "Vie", valor: 96500 },
      { label: "Sáb", valor: 121400 },
      { label: "Dom", valor: 71400 },
    ],
    topProducts: [
      { nombre: "Sándwich de Milanesa", uds: 34, total: 176800 },
      { nombre: "Hamburguesa Completa", uds: 27, total: 143100 },
      { nombre: "Choripán con Chimichurri", uds: 19, total: 79800 },
      { nombre: "Gaseosa (Coca-Cola)", uds: 41, total: 86100 },
    ],
  },
  mensual: {
    etiqueta: "Mensual",
    rango: "Agosto 2026",
    ingresos: 2094500,
    pedidos: 462,
    ticket: 4533,
    productosActivos: 12,
    crecimiento: "+12,1% vs. julio",
    mejorMomento: "Fines de semana (72% de las ventas)",
    categoriaTop: "Sándwiches",
    serieLabel: "Ventas por semana",
    serie: [
      { label: "Sem 1", valor: 448200 },
      { label: "Sem 2", valor: 472600 },
      { label: "Sem 3", valor: 486300 },
      { label: "Sem 4", valor: 512900 },
      { label: "Sem 5", valor: 174500 },
    ],
    topProducts: [
      { nombre: "Sándwich de Milanesa", uds: 142, total: 738400 },
      { nombre: "Hamburguesa Completa", uds: 118, total: 625400 },
      { nombre: "Lomito Completo", uds: 74, total: 384800 },
      { nombre: "Combo Picada Jujeña", uds: 38, total: 265000 },
    ],
  },
  anual: {
    etiqueta: "Anual",
    rango: "Año 2026 (ene – ago)",
    ingresos: 15380000,
    pedidos: 3412,
    ticket: 4508,
    productosActivos: 12,
    crecimiento: "+23,7% vs. 2025",
    mejorMomento: "Julio (vacaciones de invierno)",
    categoriaTop: "Sándwiches",
    serieLabel: "Ventas por mes",
    serie: [
      { label: "Ene", valor: 1620000 },
      { label: "Feb", valor: 1485000 },
      { label: "Mar", valor: 1712000 },
      { label: "Abr", valor: 1654000 },
      { label: "May", valor: 1890000 },
      { label: "Jun", valor: 1975000 },
      { label: "Jul", valor: 2949500 },
      { label: "Ago", valor: 2094500 },
    ],
    topProducts: [
      { nombre: "Sándwich de Milanesa", uds: 1043, total: 5423600 },
      { nombre: "Hamburguesa Completa", uds: 872, total: 4621600 },
      { nombre: "Lomito Completo", uds: 561, total: 2917200 },
      { nombre: "Sándwich de rúcula y bondiola", uds: 402, total: 2211000 },
    ],
  },
};

type Opcion = { id: string; label: string; rango: string; factor: number; crecimiento: string; mejorMomento: string };

const OPCIONES: Record<Periodo, Opcion[]> = {
  semanal: [
    { id: "s34", label: "Semana 17 – 23 ago", rango: "Lun 17 – Dom 23 de agosto", factor: 1, crecimiento: "+8,4% vs. semana anterior", mejorMomento: "Sábado (21:30 a 23:00)" },
    { id: "s33", label: "Semana 10 – 16 ago", rango: "Lun 10 – Dom 16 de agosto", factor: 0.92, crecimiento: "+3,1% vs. semana anterior", mejorMomento: "Viernes (21:00 a 22:30)" },
    { id: "s32", label: "Semana 3 – 9 ago", rango: "Lun 3 – Dom 9 de agosto", factor: 0.86, crecimiento: "-1,8% vs. semana anterior", mejorMomento: "Sábado (22:00 a 23:30)" },
  ],
  mensual: [
    { id: "m8", label: "Agosto 2026", rango: "Agosto 2026", factor: 1, crecimiento: "+12,1% vs. julio", mejorMomento: "Fines de semana (72% de las ventas)" },
    { id: "m7", label: "Julio 2026", rango: "Julio 2026", factor: 1.41, crecimiento: "+49,4% vs. junio", mejorMomento: "Vacaciones de invierno (todas las noches)" },
    { id: "m6", label: "Junio 2026", rango: "Junio 2026", factor: 0.94, crecimiento: "+4,5% vs. mayo", mejorMomento: "Fines de semana (68% de las ventas)" },
  ],
  anual: [
    { id: "a2026", label: "Año 2026", rango: "Año 2026 (ene – ago)", factor: 1, crecimiento: "+23,7% vs. 2025", mejorMomento: "Julio (vacaciones de invierno)" },
    { id: "a2025", label: "Año 2025", rango: "Año 2025 (completo)", factor: 0.81, crecimiento: "+15,2% vs. 2024", mejorMomento: "Julio (vacaciones de invierno)" },
    { id: "a2024", label: "Año 2024", rango: "Año 2024 (completo)", factor: 0.7, crecimiento: "+9,6% vs. 2023", mejorMomento: "Diciembre (fiestas)" },
  ],
};

function ReportesView() {
  const [periodo, setPeriodo] = useState<Periodo>("semanal");
  const [opcionId, setOpcionId] = useState<string>(OPCIONES.semanal[0].id);

  const opciones = OPCIONES[periodo];
  const opcion = opciones.find((o) => o.id === opcionId) ?? opciones[0];
  const f = opcion.factor;
  const base = REPORTES[periodo];

  const cambiarPeriodo = (p: Periodo) => {
    setPeriodo(p);
    setOpcionId(OPCIONES[p][0].id);
  };

  const data = {
    ...base,
    rango: opcion.rango,
    crecimiento: opcion.crecimiento,
    mejorMomento: opcion.mejorMomento,
    ingresos: Math.round((base.ingresos * f) / 100) * 100,
    pedidos: Math.round(base.pedidos * f),
    ticket: Math.round(base.ticket * (0.97 + f * 0.03)),
    serie: base.serie.map((s) => ({ ...s, valor: Math.round((s.valor * f) / 100) * 100 })),
    topProducts: base.topProducts.map((p) => ({
      ...p,
      uds: Math.round(p.uds * f),
      total: Math.round((p.total * f) / 100) * 100,
    })),
  };

  const topProducts = data.topProducts;
  const maxTotal = Math.max(...topProducts.map((t) => t.total));
  const maxSerie = Math.max(...data.serie.map((s) => s.valor));


  const exportExcel = () => {
    const resumen = [
      { "Métrica": "Período", "Valor ($)": `${data.etiqueta} · ${data.rango}` },
      { "Métrica": "Ingresos", "Valor ($)": data.ingresos },
      { "Métrica": "Pedidos", "Valor ($)": data.pedidos },
      { "Métrica": "Ticket promedio", "Valor ($)": data.ticket },
      { "Métrica": "Productos activos", "Valor ($)": data.productosActivos },
      { "Métrica": "Crecimiento", "Valor ($)": data.crecimiento },
      { "Métrica": "Mejor momento", "Valor ($)": data.mejorMomento },
      { "Métrica": "Categoría más vendida", "Valor ($)": data.categoriaTop },
    ];
    const evolucion = data.serie.map((s) => ({ "Período": s.label, "Total ($)": s.valor }));
    const productos = topProducts.map((p) => ({
      "Nombre del Item": p.nombre,
      "Unidades": p.uds,
      "Total ($)": p.total,
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumen), "Resumen");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(evolucion), "Evolución");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productos), "Top Productos");
    XLSX.writeFile(wb, `sam-guchi-reporte-${periodo}-${opcion.id}-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success(`Reporte ${data.etiqueta.toLowerCase()} exportado`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display text-2xl md:text-4xl text-foreground">REPORTES DE VENTA</h1>
          <p className="text-sm text-muted-foreground mt-1">{data.rango}</p>
        </div>
        <button
          onClick={exportExcel}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Exportar a Excel
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full bg-muted p-1">
          {(["semanal", "mensual", "anual"] as Periodo[]).map((p) => (
            <button
              key={p}
              onClick={() => cambiarPeriodo(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
                periodo === p ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Período:</span>
          <select
            value={opcion.id}
            onChange={(e) => setOpcionId(e.target.value)}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground"
          >
            {opciones.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<DollarSign className="h-5 w-5 text-emerald-600" />} bg="bg-emerald-50" label="Ingresos" value={formatARS(data.ingresos)} />
        <StatCard icon={<LayoutGrid className="h-5 w-5 text-blue-600" />} bg="bg-blue-50" label="Pedidos" value={String(data.pedidos)} />
        <StatCard icon={<BarChart3 className="h-5 w-5 text-amber-600" />} bg="bg-amber-50" label="Ticket promedio" value={formatARS(data.ticket)} />
        <StatCard icon={<Package className="h-5 w-5 text-purple-600" />} bg="bg-purple-50" label="Productos activos" value={String(data.productosActivos)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <InfoCard label="Crecimiento" value={data.crecimiento} />
        <InfoCard label="Mejor momento de venta" value={data.mejorMomento} />
        <InfoCard label="Categoría más vendida" value={data.categoriaTop} />
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 mb-6">
        <h2 className="font-display text-2xl mb-6">{data.serieLabel.toUpperCase()}</h2>
        <div className="flex items-end gap-2 sm:gap-4 h-48">
          {data.serie.map((s) => (
            <div key={s.label} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
              <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
                {Math.round(s.valor / 1000)}k
              </span>
              <div
                className="w-full rounded-t-md bg-primary/80 hover:bg-primary transition-all"
                style={{ height: `${(s.valor / maxSerie) * 100}%` }}
                title={`${s.label}: ${formatARS(s.valor)}`}
              />
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="font-display text-2xl mb-5">PRODUCTOS MÁS PEDIDOS</h2>
        <ol className="space-y-4">
          {topProducts.map((p, i) => (
            <li key={p.nombre} className="flex items-center gap-4">
              <span className="font-display text-2xl text-muted-foreground w-6">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1 gap-2">
                  <span className="font-semibold">{p.nombre}</span>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {p.uds} uds. <span className="ml-3 font-display text-lg text-primary">{formatARS(p.total)}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(p.total / maxTotal) * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold text-foreground">{value}</p>
    </div>
  );
}


function StatCard({ icon, bg, label, value }: { icon: React.ReactNode; bg: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${bg}`}>{icon}</div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-2xl md:text-4xl mt-1">{value}</p>
    </div>
  );
}
