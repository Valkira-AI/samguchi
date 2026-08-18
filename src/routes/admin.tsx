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
  { id: "#1001", estado: "Nuevo", cliente: "Marcos R.", hora: "14:32 hs", items: [{ cant: 2, nombre: "Milanesa Simple" }, { cant: 2, nombre: "Coca-Cola 500ml" }], total: 8800 },
  { id: "#1002", estado: "En Preparación", cliente: "Laura G.", hora: "14:25 hs", items: [{ cant: 1, nombre: "Lomito Simple" }, { cant: 1, nombre: "Agua Mineral 500ml" }], total: 6600 },
  { id: "#1003", estado: "Despachado", cliente: "Diego M.", hora: "14:10 hs", items: [{ cant: 1, nombre: "Hamburguesa Clásica" }, { cant: 1, nombre: "Jugo Natural" }], total: 5700 },
  { id: "#1004", estado: "Finalizado", cliente: "Sofía P.", hora: "13:55 hs", items: [{ cant: 2, nombre: "Milanesa Completa" }], total: 9000 },
  { id: "#1005", estado: "Finalizado", cliente: "Julián A.", hora: "13:40 hs", items: [{ cant: 1, nombre: "Lomito Completo" }, { cant: 2, nombre: "Coca-Cola 500ml" }], total: 8800 },
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
      <aside className="hidden md:flex w-60 shrink-0 bg-[#1a1a1a] text-white flex-col">
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

      <main className="flex-1 min-w-0 px-4 py-6 md:px-10 md:py-8">
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
  const realOrders = useOrders();
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
      <h1 className="font-display text-2xl md:text-4xl mb-6 text-foreground">DASHBOARD DE PEDIDOS</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {(Object.keys(counts) as Order["estado"][]).map((e) => (
          <div key={e} className="rounded-2xl bg-card p-5 border border-border">
            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${ESTADO_STYLES[e]}`}>{e}</span>
            <p className="mt-4 font-display text-2xl md:text-4xl">{counts[e]}</p>
            <p className="text-xs text-muted-foreground">pedidos</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {demoList.map((o) => {
          const next = NEXT_STATE[o.estado];
          return (
            <div key={o.id} className="rounded-2xl bg-card border border-border p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-display text-2xl">{o.id}</span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${ESTADO_STYLES[o.estado]}`}>{o.estado}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground"><User className="h-3.5 w-3.5" />{o.cliente}</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-0.5">
                    {o.items.map((i, idx) => <li key={idx}>{i.cant}× {i.nombre}</li>)}
                  </ul>
                  <p className="mt-3 font-display text-2xl text-primary">{formatARS(o.total)}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="text-sm text-muted-foreground">{o.hora}</span>
                  {next && (
                    <button
                      onClick={() => advanceDemo(o.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                    >
                      <ChevronRight className="h-4 w-4" /> {next}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {realOrders.length > 0 && (
          <>
            <h2 className="font-display text-2xl mt-8 mb-2">Pedidos reales</h2>
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
type CatItem = { id: string; nombre: string; categoria: string; precio: number; disponible: boolean; imagen: string };

function CatalogoView() {
  const availability = useAvailability();
  const initial: CatItem[] = PRODUCTS.map((p: Product) => ({
    id: p.id, nombre: p.nombre, categoria: p.categoria, precio: p.precio, disponible: p.disponible, imagen: p.imagen,
  }));
  const [items, setItems] = useState<CatItem[]>(initial);
  const [editing, setEditing] = useState<CatItem | null>(null);

  const displayItems = items.map((it) => ({ ...it, disponible: isAvailable(it.id, availability) }));

  const toggle = (id: string) => {
    const current = isAvailable(id, availability);
    setAvailability(id, !current);
    toast.success(!current ? "Producto marcado disponible" : "Producto marcado no disponible");
  };

  const save = (updated: CatItem) => {
    setItems((xs) => xs.map((x) => x.id === updated.id ? updated : x));
    setEditing(null);
    toast.success("Producto actualizado");
  };

  return (
    <div>
      <h1 className="font-display text-2xl md:text-4xl mb-6 text-foreground">GESTIÓN DE CATÁLOGO</h1>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_60px] px-6 py-4 border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <div>Producto</div><div>Categoría</div><div>Precio</div><div>Disponible</div><div />
        </div>
        {displayItems.map((it) => (
          <div
            key={it.id}
            className={`flex flex-col gap-3 md:grid md:grid-cols-[2fr_1fr_1fr_1fr_60px] md:items-center px-4 md:px-6 py-3 border-b border-border/60 last:border-0 ${!it.disponible ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <img src={it.imagen} alt={it.nombre} className="h-11 w-11 shrink-0 rounded-full object-cover" />
              <span className="font-medium truncate">{it.nombre}</span>
            </div>
            <div className="text-sm text-muted-foreground md:block">
              <span className="md:hidden text-xs uppercase tracking-wide mr-2">Categoría:</span>{it.categoria}
            </div>
            <div className="font-display text-xl text-primary">{formatARS(it.precio)}</div>
            <div className="flex items-center justify-between md:block">
              <span className="md:hidden text-xs uppercase tracking-wide text-muted-foreground">Disponible</span>
              <button
                onClick={() => toggle(it.id)}
                className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-bold uppercase transition ${
                  it.disponible
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-red-300 bg-red-50 text-red-700"
                }`}
              >
                {it.disponible ? "Sí" : "No"}
              </button>
            </div>
            <button
              onClick={() => setEditing(it)}
              className="self-end md:self-auto md:justify-self-end grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
              aria-label="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>


      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6 border border-border" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-4">Editar producto</h2>
            <label className="text-sm font-medium">Nombre</label>
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editing.nombre}
              onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
            />
            <label className="mt-3 block text-sm font-medium">Categoría</label>
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editing.categoria}
              onChange={(e) => setEditing({ ...editing, categoria: e.target.value })}
            />
            <label className="mt-3 block text-sm font-medium">Precio</label>
            <input
              type="number"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editing.precio}
              onChange={(e) => setEditing({ ...editing, precio: Number(e.target.value) })}
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
function ReportesView() {
  const topProducts = [
    { nombre: "Hamburguesa Clásica", uds: 3, total: 12600 },
    { nombre: "Coca-Cola 500ml", uds: 3, total: 3600 },
    { nombre: "Milanesa Completa", uds: 1, total: 4500 },
    { nombre: "Jugo Natural", uds: 1, total: 1500 },
  ];
  const maxTotal = Math.max(...topProducts.map((t) => t.total));

  const exportExcel = () => {
    const resumen = [
      { "Métrica": "Ingresos del día", "Valor ($)": 22200 },
      { "Métrica": "Pedidos activos", "Valor ($)": 3 },
      { "Métrica": "Productos activos", "Valor ($)": 12 },
    ];
    const productos = topProducts.map((p) => ({
      "Nombre del Item": p.nombre,
      "Unidades": p.uds,
      "Total ($)": p.total,
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumen), "Resumen");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productos), "Top Productos");
    XLSX.writeFile(wb, `sam-guchi-reporte-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Reporte exportado");
  };


  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl md:text-4xl text-foreground">REPORTES DE VENTA</h1>
        <button
          onClick={exportExcel}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-warm hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Exportar a Excel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard icon={<DollarSign className="h-5 w-5 text-emerald-600" />} bg="bg-emerald-50" label="Ingresos del día" value="$22.200" />
        <StatCard icon={<LayoutGrid className="h-5 w-5 text-blue-600" />} bg="bg-blue-50" label="Pedidos activos" value="3" />
        <StatCard icon={<Package className="h-5 w-5 text-purple-600" />} bg="bg-purple-50" label="Productos activos" value="12" />
      </div>

      <div className="rounded-2xl bg-card border border-border p-6">
        <h2 className="font-display text-2xl mb-5">PRODUCTOS MÁS PEDIDOS</h2>
        <ol className="space-y-4">
          {topProducts.map((p, i) => (
            <li key={p.nombre} className="flex items-center gap-4">
              <span className="font-display text-2xl text-muted-foreground w-6">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-semibold">{p.nombre}</span>
                  <span className="text-sm text-muted-foreground">
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

function StatCard({ icon, bg, label, value }: { icon: React.ReactNode; bg: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${bg}`}>{icon}</div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-2xl md:text-4xl mt-1">{value}</p>
    </div>
  );
}
