import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Download, Trash2, ArrowLeft } from "lucide-react";
import { deleteOrder, updateOrderState, useOrders, type Order } from "@/lib/orders-store";
import { formatARS } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel · Sam Guchi" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const ESTADOS: Order["estado"][] = ["Nuevo", "En Preparación", "Despachado", "Finalizado"];

function Admin() {
  const orders = useOrders();
  const [filtro, setFiltro] = useState<Order["estado"] | "Todos">("Todos");

  const shown = useMemo(
    () => (filtro === "Todos" ? orders : orders.filter((o) => o.estado === filtro)),
    [orders, filtro],
  );

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.total, 0);
    const finalizados = orders.filter((o) => o.estado === "Finalizado").length;
    const nuevos = orders.filter((o) => o.estado === "Nuevo").length;
    return { total, finalizados, nuevos, count: orders.length };
  }, [orders]);

  const exportExcel = () => {
    if (orders.length === 0) return toast.error("No hay ventas para exportar");
    const rows = orders.flatMap((o) =>
      o.items.map((i) => ({
        "N° Pedido": o.id,
        Fecha: new Date(o.fecha).toLocaleString("es-AR"),
        Cliente: o.cliente,
        Estado: o.estado,
        Producto: i.nombre,
        Cantidad: i.cantidad,
        "Precio Unit.": i.precio,
        Subtotal: i.precio * i.cantidad,
        "Total Pedido": o.total,
      })),
    );
    const wb = XLSX.utils.book_new();
    const wsDetalle = XLSX.utils.json_to_sheet(rows);
    wsDetalle["!cols"] = [{ wch: 16 }, { wch: 20 }, { wch: 18 }, { wch: 16 }, { wch: 28 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsDetalle, "Ventas");

    const resumen = orders.map((o) => ({
      "N° Pedido": o.id,
      Fecha: new Date(o.fecha).toLocaleString("es-AR"),
      Cliente: o.cliente,
      Estado: o.estado,
      Ítems: o.items.reduce((s, i) => s + i.cantidad, 0),
      Total: o.total,
    }));
    const wsResumen = XLSX.utils.json_to_sheet(resumen);
    wsResumen["!cols"] = [{ wch: 16 }, { wch: 20 }, { wch: 18 }, { wch: 16 }, { wch: 8 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `sam-guchi-ventas-${fecha}.xlsx`);
    toast.success("Excel generado");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Link>
            <span className="h-6 w-px bg-border" />
            <h1 className="font-display text-2xl text-primary">Panel Sam Guchi</h1>
          </div>
          <button
            onClick={exportExcel}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-warm hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Exportar a Excel
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Pedidos", value: stats.count },
            { label: "Nuevos", value: stats.nuevos },
            { label: "Finalizados", value: stats.finalizados },
            { label: "Ventas totales", value: formatARS(stats.total) },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-3xl">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(["Todos", ...ESTADOS] as const).map((e) => (
            <button
              key={e}
              onClick={() => setFiltro(e)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filtro === e ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"
              }`}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card">
          {shown.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              Todavía no hay pedidos. Realizá un pedido desde la home para verlo acá.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Pedido</th>
                    <th className="px-4 py-3 font-semibold">Fecha</th>
                    <th className="px-4 py-3 font-semibold">Cliente</th>
                    <th className="px-4 py-3 font-semibold">Detalle</th>
                    <th className="px-4 py-3 font-semibold">Total</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {shown.map((o) => (
                    <tr key={o.id} className="border-t border-border align-top">
                      <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(o.fecha).toLocaleString("es-AR")}</td>
                      <td className="px-4 py-3 font-medium">{o.cliente}</td>
                      <td className="px-4 py-3">
                        <ul className="space-y-0.5 text-xs text-muted-foreground">
                          {o.items.map((i) => (
                            <li key={i.id}>{i.cantidad}× {i.nombre}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">{formatARS(o.total)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.estado}
                          onChange={(e) => updateOrderState(o.id, e.target.value as Order["estado"])}
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                        >
                          {ESTADOS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { deleteOrder(o.id); toast.success("Pedido eliminado"); }}
                          className="text-destructive hover:opacity-70"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
