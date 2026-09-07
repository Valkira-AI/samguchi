import { lazy, Suspense, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { DollarSign, LayoutGrid, BarChart3, Sandwich, CupSoda, TrendingUp } from "lucide-react";
import { formatARS } from "@/lib/products";
import { useOrders } from "@/lib/orders-store";
import StaffPanel from "./StaffPanel";

const TopProductsDonut = lazy(() => import("./TopProductsDonut"));

type Venta = { nombre: string; categoria: "Sándwiches" | "Bebidas" | "Promos"; uds: number; total: number };

/* Datos demo del prototipo (se combinan con los pedidos reales) */
const DEMO_DIA: Venta[] = [
  { nombre: "Sándwich de Milanesa", categoria: "Sándwiches", uds: 9, total: 53900 },
  { nombre: "Hamburguesa Completa", categoria: "Sándwiches", uds: 7, total: 51500 },
  { nombre: "Lomito Completo", categoria: "Sándwiches", uds: 5, total: 41400 },
  { nombre: "Gaseosa", categoria: "Bebidas", uds: 12, total: 28800 },
  { nombre: "Cerveza Artesanal", categoria: "Bebidas", uds: 6, total: 20000 },
  { nombre: "Choripán con Chimichurri", categoria: "Sándwiches", uds: 4, total: 20200 },
  { nombre: "Combo Picada Jujeña", categoria: "Promos", uds: 2, total: 23700 },
];

const DEMO_MES: Venta[] = [
  { nombre: "Sándwich de Milanesa", categoria: "Sándwiches", uds: 142, total: 850300 },
  { nombre: "Hamburguesa Completa", categoria: "Sándwiches", uds: 118, total: 868200 },
  { nombre: "Lomito Completo", categoria: "Sándwiches", uds: 74, total: 612700 },
  { nombre: "Gaseosa", categoria: "Bebidas", uds: 196, total: 470400 },
  { nombre: "Cerveza Artesanal", categoria: "Bebidas", uds: 88, total: 293700 },
  { nombre: "Choripán con Chimichurri", categoria: "Sándwiches", uds: 63, total: 318200 },
  { nombre: "Combo Picada Jujeña", categoria: "Promos", uds: 31, total: 367300 },
  { nombre: "Sándwich de rúcula y bondiola", categoria: "Sándwiches", uds: 47, total: 200100 },
];

const PEDIDOS_DEMO = { dia: 28, mes: 462 };

function esBebida(nombre: string) {
  return /gaseosa|cerveza|agua|jugo|coca|fanta|sprite/i.test(nombre);
}

export default function DashboardView() {
  const [rango, setRango] = useState<"dia" | "mes">("dia");
  const orders = useOrders();

  const { ventas, pedidos } = useMemo(() => {
    const ahora = new Date();
    const reales = orders.filter((o) => {
      const f = new Date(o.fecha);
      return rango === "dia"
        ? f.toDateString() === ahora.toDateString()
        : f.getMonth() === ahora.getMonth() && f.getFullYear() === ahora.getFullYear();
    });

    const mapa = new Map<string, Venta>();
    for (const v of rango === "dia" ? DEMO_DIA : DEMO_MES) mapa.set(v.nombre, { ...v });
    for (const o of reales) {
      for (const it of o.items) {
        const prev = mapa.get(it.nombre);
        const uds = it.cantidad;
        const total = it.precio * it.cantidad;
        if (prev) mapa.set(it.nombre, { ...prev, uds: prev.uds + uds, total: prev.total + total });
        else
          mapa.set(it.nombre, {
            nombre: it.nombre,
            categoria: esBebida(it.nombre) ? "Bebidas" : "Sándwiches",
            uds,
            total,
          });
      }
    }
    return {
      ventas: [...mapa.values()].sort((a, b) => b.uds - a.uds),
      pedidos: (rango === "dia" ? PEDIDOS_DEMO.dia : PEDIDOS_DEMO.mes) + reales.length,
    };
  }, [orders, rango]);

  const ingresos = ventas.reduce((a, v) => a + v.total, 0);
  const ticket = pedidos > 0 ? Math.round(ingresos / pedidos) : 0;
  const top5 = ventas.slice(0, 5);
  const sandwichTop = ventas.find((v) => v.categoria !== "Bebidas");
  const bebidaTop = ventas.find((v) => v.categoria === "Bebidas");
  const totalUds = top5.reduce((a, v) => a + v.uds, 0) || 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-4xl text-foreground">DASHBOARD</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {rango === "dia" ? "Resumen de hoy" : "Resumen del mes en curso"}
          </p>
        </div>
        <div className="inline-flex rounded-full bg-muted p-1">
          {(["dia", "mes"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRango(r)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                rango === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "dia" ? "Día" : "Mes"}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {rango === "dia" ? "Ventas del Día" : "Ventas del Mes"}
          </p>
          <p className="font-display text-2xl md:text-4xl mt-1">{formatARS(ingresos)}</p>
          <p className="text-xs text-muted-foreground mt-1">{pedidos} pedidos concretados</p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-50">
            <BarChart3 className="h-5 w-5 text-amber-600" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Ticket Promedio</p>
          <p className="font-display text-2xl md:text-4xl mt-1">{formatARS(ticket)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total ventas ÷ total pedidos</p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50">
            <Sandwich className="h-5 w-5 text-orange-600" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Sándwich Estrella</p>
          <p className="font-semibold text-lg mt-1 leading-tight">{sandwichTop?.nombre ?? "—"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {sandwichTop ? `${sandwichTop.uds} uds · ${formatARS(sandwichTop.total)}` : "Sin ventas"}
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50">
            <CupSoda className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Bebida Estrella</p>
          <p className="font-semibold text-lg mt-1 leading-tight">{bebidaTop?.nombre ?? "—"}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {bebidaTop ? `${bebidaTop.uds} uds · ${formatARS(bebidaTop.total)}` : "Sin ventas"}
          </p>
        </div>
      </div>

      {/* Gráfico de dona + detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 rounded-2xl bg-card border border-border p-6">
          <h2 className="font-display text-2xl mb-4">TOP 5 PRODUCTOS MÁS VENDIDOS</h2>
          <ClientOnly fallback={<div className="h-[280px] grid place-items-center text-sm text-muted-foreground">Cargando gráfico…</div>}>
            <Suspense fallback={<div className="h-[280px] grid place-items-center text-sm text-muted-foreground">Cargando gráfico…</div>}>
              <TopProductsDonut data={top5} />
            </Suspense>
          </ClientOnly>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6">
          <h2 className="font-display text-2xl mb-4">DISTRIBUCIÓN</h2>
          <ul className="space-y-3">
            {top5.map((v) => {
              const pct = (v.uds / totalUds) * 100;
              return (
                <li key={v.nombre}>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-sm font-semibold">{v.nombre}</span>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {v.uds} uds · {formatARS(v.total)}
                  </p>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <TrendingUp className="h-4 w-4 text-primary shrink-0" />
            {top5[0] ? `${top5[0].nombre} lidera con el ${(top5[0].uds / totalUds * 100).toFixed(0)}% de las unidades.` : "Sin datos"}
          </div>
        </div>
      </div>

      <StaffPanel />
    </div>
  );
}
