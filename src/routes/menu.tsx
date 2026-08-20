import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, Trash2, ExternalLink } from "lucide-react";
import { CATEGORIES, formatARS, type Category } from "@/lib/products";
import { addOrder, type OrderItem } from "@/lib/orders-store";
import { useCatalog } from "@/lib/catalog-store";
import { SiteHeader } from "@/components/SiteHeader";
import { HOURS_LABEL, isWithinServiceHours } from "@/lib/hours";
import { useEffect } from "react";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menú · Sam Guchi" },
      { name: "description", content: "Menú completo de Sam Guchi: sándwiches, bebidas y promos." },
    ],
  }),
  component: Menu,
});

type CartMap = Record<string, number>;

function Menu() {
  const [activeCat, setActiveCat] = useState<Category | "Todos">("Todos");
  const [cart, setCart] = useState<CartMap>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cliente, setCliente] = useState("");
  const [waLink, setWaLink] = useState<string | null>(null);
  const [variants, setVariants] = useState<Record<string, string>>({});
  const products = useCatalog();
  const [abierto, setAbierto] = useState(true);

  useEffect(() => {
    const tick = () => setAbierto(isWithinServiceHours());
    tick();
    const t = setInterval(tick, 30_000);
    return () => clearInterval(t);
  }, []);

  const filtered = useMemo(
    () => (activeCat === "Todos" ? products : products.filter((p) => p.categoria === activeCat)),
    [activeCat, products],
  );

  const items: OrderItem[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, cantidad]) => {
          const p = products.find((x) => x.id === id);
          if (!p) return null;
          const v = p.variantes?.length ? variants[id] || p.variantes[0] : null;
          return { id, nombre: v ? `${p.nombre} (${v})` : p.nombre, precio: p.precio, cantidad };
        })
        .filter((i): i is OrderItem => i !== null && i.cantidad > 0),
    [cart, products, variants],
  );

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const count = items.reduce((s, i) => s + i.cantidad, 0);

  const add = (id: string) => { setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })); toast.success("Agregado al pedido"); };
  const dec = (id: string) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));
  const remove = (id: string) => setCart((c) => ({ ...c, [id]: 0 }));
  const clearCart = () => {
    if (items.length === 0) return;
    setCart({});
    toast.info("Pedido vaciado");
  };

  const enviarPedido = () => {
    if (!isWithinServiceHours()) {
      setAbierto(false);
      return toast.error(`Estamos cerrados. Pedidos de ${HOURS_LABEL} hs`);
    }
    if (items.length === 0) return toast.error("Tu pedido está vacío");
    if (!cliente.trim()) return toast.error("Ingresá tu nombre");
    const order = addOrder({ cliente: cliente.trim(), items, total });
    const detalle = items.map((i) => `• ${i.cantidad}x ${i.nombre} — ${formatARS(i.precio * i.cantidad)}`).join("\n");
    const msg = `Hola Sam Guchi! Soy ${cliente}. Quiero pedir (${order.id}):\n${detalle}\n\nTotal: ${formatARS(total)}`;
    const link = `https://wa.me/5493884000000?text=${encodeURIComponent(msg)}`;
    window.open(link, "_blank");
    setWaLink(link);
    setCart({});
    setCliente("");
    setCartOpen(false);
    toast.success(`Pedido ${order.id} registrado`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Carrito flotante */}
      <button
        onClick={() => setCartOpen(true)}
        aria-label="Abrir carrito"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-warm ring-4 ring-primary/20 transition hover:scale-105 hover:opacity-95"
      >
        <ShoppingBag className="h-6 w-6" />
        {count > 0 ? (
          <>
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-accent-foreground shadow">
              {count}
            </span>
            <span className="text-sm font-bold leading-none">{formatARS(total)}</span>
          </>
        ) : (
          <span className="text-sm font-bold leading-none">Carrito</span>
        )}
      </button>


      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-4xl md:text-5xl">Nuestro menú</h1>
            <p className="mt-1 text-muted-foreground">Elegí, sumá al pedido y enviálo por WhatsApp.</p>
            <p className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${abierto ? "border-primary/40 bg-primary/10 text-primary" : "border-destructive/40 bg-destructive/10 text-destructive"}`}>
              <span className={`h-2 w-2 rounded-full ${abierto ? "bg-primary" : "bg-destructive"}`} />
              {abierto ? `Abierto ahora · Pedidos de ${HOURS_LABEL} hs` : `Cerrado · Pedidos de ${HOURS_LABEL} hs`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Todos", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeCat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article
              key={p.id}
              className={`group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-warm ${!p.disponible ? "opacity-80" : ""}`}
            >
              <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                {p.imagen ? (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    loading="lazy"
                    width={800}
                    height={640}
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${!p.disponible ? "grayscale" : ""}`}
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">Sin imagen</div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold">{p.categoria}</span>
                {!p.disponible && (
                  <span className="absolute right-3 top-3 rounded-full bg-destructive/90 px-2 py-1 text-xs font-semibold text-destructive-foreground">
                    No disponible
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl leading-tight">{p.nombre}</h3>
                  <span className="whitespace-nowrap font-semibold text-primary">{formatARS(p.precio)}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.descripcion}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  {p.variantes?.length ? (
                    <select
                      aria-label={`Variante de ${p.nombre}`}
                      value={variants[p.id] || p.variantes[0]}
                      onChange={(e) => setVariants((v) => ({ ...v, [p.id]: e.target.value }))}
                      disabled={!p.disponible}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium outline-none focus:border-primary disabled:opacity-50"
                    >
                      {p.variantes.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  ) : null}
                  {p.disponible && cart[p.id] ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => dec(p.id)} className="rounded-full border border-border p-2 hover:bg-muted"><Minus className="h-4 w-4" /></button>
                      <span className="min-w-8 text-center font-semibold">{cart[p.id]}</span>
                      <button onClick={() => add(p.id)} className="rounded-full border border-border p-2 hover:bg-muted"><Plus className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <span className={`text-xs ${p.disponible ? "text-muted-foreground" : "font-medium text-destructive"}`}>
                      {p.disponible ? "Disponible" : "No disponible"}
                    </span>
                  )}
                  <button
                    onClick={() => p.disponible && add(p.id)}
                    disabled={!p.disponible}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                  >
                    {p.disponible ? "Agregar" : "No disponible"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {cartOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="font-display text-2xl">Tu pedido</h3>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="inline-flex items-center gap-1 text-sm text-destructive hover:opacity-80"
                  >
                    <Trash2 className="h-4 w-4" /> Vaciar
                  </button>
                )}
                <button onClick={() => setCartOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Cerrar</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="mt-8 text-center text-muted-foreground">Tu pedido está vacío.</p>
              ) : (
                <ul className="space-y-3">
                  {items.map((i) => (
                    <li key={i.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium">{i.nombre}</p>
                        <p className="text-xs text-muted-foreground">{formatARS(i.precio)} c/u</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => dec(i.id)} className="rounded-full border border-border p-1 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                        <span className="min-w-6 text-center text-sm font-semibold">{i.cantidad}</span>
                        <button onClick={() => add(i.id)} className="rounded-full border border-border p-1 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                        <button onClick={() => remove(i.id)} className="ml-2 text-destructive hover:opacity-70"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="space-y-3 border-t border-border p-4">
              <input value={cliente} onChange={(e) => setCliente(e.target.value)} placeholder="Tu nombre" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-primary">{formatARS(total)}</span>
              </div>
              {!abierto && (
                <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                  Estamos cerrados. Tomamos pedidos de {HOURS_LABEL} hs.
                </p>
              )}
              <button onClick={enviarPedido} disabled={items.length === 0 || !abierto} className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-warm hover:opacity-90 disabled:opacity-50">
                {abierto ? "Enviar por WhatsApp" : `Cerrado · ${HOURS_LABEL} hs`}
              </button>
            </div>
          </aside>
        </div>
      )}

      {waLink && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setWaLink(null)}>
          <div className="w-full max-w-md rounded-2xl bg-card p-6 border border-border" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-2xl mb-2">¡Pedido enviado!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Si WhatsApp no se abrió automáticamente, tocá el siguiente enlace:
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 font-semibold text-white hover:opacity-90"
            >
              <ExternalLink className="h-4 w-4" /> Abrir WhatsApp
            </a>
            <button onClick={() => setWaLink(null)} className="mt-3 w-full text-center text-sm text-muted-foreground hover:text-foreground">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
