import { createFileRoute, Link } from "@tanstack/react-router";
import { formatARS } from "@/lib/products";
import { useCatalog } from "@/lib/catalog-store";
import heroAsset from "@/assets/hero-menu-wall.png.asset.json";
import { SiteHeader } from "@/components/SiteHeader";
import { useLang } from "@/lib/i18n";
import { productName, productDescription } from "@/lib/product-i18n";

const hero = heroAsset.url;

export const Route = createFileRoute("/")({
  component: Home,
});

// Top promos más vendidas
const TOP_IDS = ["p1", "p4"];

function Home() {
  const products = useCatalog();
  const { t, lang } = useLang();
  const TOP = TOP_IDS.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />


      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={hero} alt="Sándwiches Sam Guchi" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-36">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/85 px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary shadow-sm ring-1 ring-primary/20 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t("home.badge")}
          </p>
          <h1 className="max-w-2xl font-display text-5xl leading-tight text-foreground md:text-7xl">
            {t("home.title1")} <span className="text-primary">{t("home.title2")}</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">{t("home.lead")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-warm hover:opacity-90"
            >
              {t("home.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Promos más vendidas */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8">
          <h2 className="font-display text-4xl md:text-5xl">{t("home.promos")}</h2>
          <p className="mt-1 text-muted-foreground">{t("home.promosSub")}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {TOP.map((p, i) => (
            <article key={p.id} className="group w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-warm">
              <div className="relative aspect-[5/4] overflow-hidden bg-muted">
                <img src={p.imagen} alt={productName(p, lang)} loading="lazy" width={800} height={640} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                  #{i + 1} {t("home.masPedido")}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl leading-tight">{productName(p, lang)}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{productDescription(p, lang)}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-2xl text-primary">{formatARS(p.precio)}</span>
                  <Link
                    to="/menu"
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    {t("home.pedir")}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

    </div>
  );
}
