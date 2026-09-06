import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useLang } from "@/lib/i18n";
import { Clock, Heart, MessageCircle, Users } from "lucide-react";
import aboutImg from "@/assets/nosotros-clientes.jpg";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Pensado para vos · Sam Guchi" },
      { name: "description", content: "En Sam Guchi todo gira alrededor tuyo: pedidos rápidos, ingredientes frescos y atención real por WhatsApp en Jujuy." },
      { property: "og:title", content: "Pensado para vos · Sam Guchi" },
      { property: "og:description", content: "Pedidos rápidos, ingredientes frescos y atención real: así cuidamos a cada cliente de Sam Guchi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Nosotros,
});

function Nosotros() {
  const { t } = useLang();
  const values = [
    { Icon: Clock, t: t("about.c1t"), d: t("about.c1d") },
    { Icon: Heart, t: t("about.c2t"), d: t("about.c2d") },
    { Icon: MessageCircle, t: t("about.c3t"), d: t("about.c3d") },
    { Icon: Users, t: t("about.c4t"), d: t("about.c4d") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2">
        <div>
          <span className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
            {t("about.badge")}
          </span>
          <h1 className="mt-4 font-display text-4xl text-primary md:text-5xl">{t("about.title")}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t("about.lead")}</p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-border shadow-warm">
          <img
            src={aboutImg}
            alt={t("about.imgAlt")}
            width={1280}
            height={960}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ Icon, t: title, d }) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={24} />
              </span>
              <h2 className="mt-4 font-display text-2xl">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-display text-3xl">{t("about.ctaTitle")}</h2>
            <p className="mt-1 text-primary-foreground/85">{t("about.ctaSub")}</p>
          </div>
          <Link
            to="/menu"
            className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground shadow-sm transition hover:opacity-90"
          >
            {t("about.cta")}
          </Link>
        </div>
      </section>
    </div>
  );
}
