import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS, formatARS } from "@/lib/products";
import heroAsset from "@/assets/hero-menu-wall.png.asset.json";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const hero = heroAsset.url;

export const Route = createFileRoute("/")({
  component: Home,
});

// Top promos más vendidas
const TOP_IDS = ["p1", "p4"];
const TOP = TOP_IDS.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean);

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        action={
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-warm hover:opacity-90"
          >
            Pedidos
          </Link>
        }
      />


      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={hero} alt="Sándwiches Sam Guchi" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/85 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-sm ring-1 ring-primary/20 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Jujuy · Sabor argentino
          </p>
          <h1 className="max-w-2xl font-display text-5xl leading-tight text-foreground md:text-7xl">
            Sándwiches que <span className="text-primary">se sienten en el alma</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Milanesas jugosas, lomitos completos y choripán con chimichurri. Hecho a mano, con productos de la tierra.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-warm hover:opacity-90"
            >
              Ver el menú
            </Link>
          </div>
        </div>
      </section>

      {/* Promos más vendidas */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <h2 className="font-display text-4xl md:text-5xl">Promos más vendidas</h2>
          <p className="mt-1 text-muted-foreground">Lo que más piden nuestros clientes.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TOP.map((p, i) => (
            <article key={p.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-warm">
              <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                <img src={p.imagen} alt={p.nombre} loading="lazy" width={800} height={640} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  #{i + 1} Más pedido
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl leading-tight">{p.nombre}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.descripcion}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-2xl text-primary">{formatARS(p.precio)}</span>
                  <Link
                    to="/menu"
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Pedir
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer / Contacto */}
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
            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />Av. Senador Perez 450, Jujuy</p>
          </div>
          <div>
            <h4 className="font-semibold">Horarios & Redes</h4>
            <p className="mt-2 text-sm text-muted-foreground">Lun a Dom · 18:00 a 00:30</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
              >
                <Instagram className="h-4 w-4" /> Instagram
              </a>
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
              >
                <Facebook className="h-4 w-4" /> Facebook
              </a>
              <a
                href={SOCIAL.linktree}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Linktree"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
              >
                <Link2 className="h-4 w-4" /> Linktree
              </a>
            </div>
            <Link to="/admin" className="mt-4 inline-block text-sm text-muted-foreground hover:text-primary hover:underline">
              Panel de administración →
            </Link>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Sam Guchi — Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
