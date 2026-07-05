import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Minus, Plus, ShoppingBag, Trash2, MapPin, Clock, Phone, ShieldCheck } from "lucide-react";
import { PRODUCTS, CATEGORIES, formatARS, type Category } from "@/lib/products";
import { addOrder, type OrderItem } from "@/lib/orders-store";
import hero from "@/assets/hero.jpg";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  component: Home,
});

type CartMap = Record<string, number>;

function Home() {
  const [activeCat, setActiveCat] = useState<Category | "Todos">("Todos");
  const [cart, setCart] = useState<CartMap>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cliente, setCliente] = useState("");

  const filtered = useMemo(
    () => (activeCat === "Todos" ? PRODUCTS : PRODUCTS.filter((p) => p.categoria === activeCat)),
    [activeCat],
  );

  const items: OrderItem[] = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, cantidad]) => {
          const p = PRODUCTS.find((x) => x.id === id)!;
          return { id, nombre: p.nombre, precio: p.precio, cantidad };
        })
        .filter((i) => i.cantidad > 0),
    [cart],
  );

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const count = items.reduce((s, i) => s + i.cantidad, 0);

  const add = (id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    toast.success("Agregado al pedido");
  };
  const dec = (id: string) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));
  const remove = (id: string) => setCart((c) => ({ ...c, [id]: 0 }));

  const enviarPedido = () => {
    if (items.length === 0) return toast.error("Tu pedido está vacío");
    if (!cliente.trim()) return toast.error("Ingresá tu nombre");
    const order = addOrder({ cliente: cliente.trim(), items, total });
    const detalle = items.map((i) => `• ${i.cantidad}x ${i.nombre} — ${formatARS(i.precio * i.cantidad)}`).join("%0A");
    const msg = `Hola Sam Guchi! Soy ${cliente}. Quiero pedir (${order.id}):%0A${detalle}%0A%0ATotal: ${formatARS(total)}`;
    window.open(`https://wa.me/5493884000000?text=${msg}`, "_blank");
    setCart({});
    setCliente("");
    setCartOpen(false);
    toast.success(`Pedido ${order.id} registrado`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#" className="flex items-center gap-2">
            <img src={logo} alt="Sam Guchi" width={40} height={40} className="h-10 w-10 object-contain" />
            <span className="font-display text-2xl tracking-wide text-primary">SAM GUCHI</span>
          </a>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="#menu" className="hover:text-primary">Menú</a>
            <a href="#nosotros" className="hover:text-primary">Nosotros</a>
            <a href="#contacto" className="hover:text-primary">Contacto</a>
            <Link to="/admin" className="text-muted-foreground hover:text-primary">Admin</Link>
          </nav>
          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-warm transition hover:opacity-90"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Pedido</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={hero} alt="Sándwiches Sam Guchi" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <p className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            Jujuy · Sabor argentino
          </p>
          <h1 className="max-w-2xl font-display text-5xl leading-tight text-foreground md:text-7xl">
            Sándwiches que <span className="text-primary">se sienten en el alma</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Milanesas jugosas, lomitos completos y choripán con chimichurri. Hecho a mano, con productos de la tierra.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#menu" className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-warm hover:opacity-90">
              Ver el menú
            </a>
            <a href="#contacto" className="rounded-full border border-border bg-card/70 px-6 py-3 font-semibold hover:bg-card">
              Cómo pedir
            </a>
          </div>
        </div>
      </section>

      {/* Menú */}
      <section id="menu" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-4xl md:text-5xl">Nuestro menú</h2>
            <p className="mt-1 text-muted-foreground">Elegí, sumá al pedido y enviálo por WhatsApp.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["Todos", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeCat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <article key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-warm">
              <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                <img
                  src={p.imagen}
                  alt={p.nombre}
                  loading="lazy"
                  width={800}
                  height={640}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs font-semibold">
                  {p.categoria}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl leading-tight">{p.nombre}</h3>
                  <span className="whitespace-nowrap font-semibold text-primary">{formatARS(p.precio)}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{p.descripcion}</p>
                <div className="mt-4 flex items-center justify-between">
                  {cart[p.id] ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => dec(p.id)} className="rounded-full border border-border p-2 hover:bg-muted">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center font-semibold">{cart[p.id]}</span>
                      <button onClick={() => add(p.id)} className="rounded-full border border-border p-2 hover:bg-muted">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Disponible</span>
                  )}
                  <button
                    onClick={() => add(p.id)}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Nosotros */}
      <section id="nosotros" className="border-t border-border bg-secondary/40 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          {[
            { icon: MapPin, t: "San Salvador de Jujuy", d: "Av. Gorriti 1200, esquina barrio centro." },
            { icon: Clock, t: "Todos los días", d: "18:00 a 00:30 hs. Retiro o delivery cercano." },
            { icon: ShieldCheck, t: "Productos frescos", d: "Panes artesanales y carnes de la región." },
          ].map((f, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-3 font-display text-xl">{f.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <footer id="contacto" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
              <span className="font-display text-xl text-primary">SAM GUCHI</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Sándwiches artesanales con sabor jujeño. Pedí online y disfrutá.</p>
          </div>
          <div>
            <h4 className="font-semibold">Contacto</h4>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />+54 9 388 400-0000</p>
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />Av. Gorriti 1200, Jujuy</p>
          </div>
          <div>
            <h4 className="font-semibold">Horarios</h4>
            <p className="mt-2 text-sm text-muted-foreground">Lun a Dom · 18:00 a 00:30</p>
            <Link to="/admin" className="mt-4 inline-block text-sm text-primary hover:underline">Panel de administración →</Link>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sam Guchi — Todos los derechos reservados.
        </div>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="font-display text-2xl">Tu pedido</h3>
              <button onClick={() => setCartOpen(false)} className="text-sm text-muted-foreground hover:text-foreground">Cerrar</button>
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
              <input
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Tu nombre"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-display text-2xl text-primary">{formatARS(total)}</span>
              </div>
              <button
                onClick={enviarPedido}
                className="w-full rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-warm hover:opacity-90 disabled:opacity-50"
                disabled={items.length === 0}
              >
                Enviar por WhatsApp
              </button>
              <p className="text-center text-xs text-muted-foreground">Al enviar, tu pedido queda registrado en el panel.</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
