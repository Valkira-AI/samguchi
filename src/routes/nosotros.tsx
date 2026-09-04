import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/nosotros")({
  head: () => ({
    meta: [
      { title: "Nosotros · Sam Guchi" },
      { name: "description", content: "Conocé la historia de Sam Guchi: sándwiches artesanales hechos a mano en Jujuy." },
      { property: "og:title", content: "Nosotros · Sam Guchi" },
      { property: "og:description", content: "Conocé la historia de Sam Guchi: sándwiches artesanales hechos a mano en Jujuy." },
    ],
  }),
  component: Nosotros,
});

function Nosotros() {
  const { t } = useLang();
  const cards = [
    { t: t("about.c1t"), d: t("about.c1d") },
    { t: t("about.c2t"), d: t("about.c2d") },
    { t: t("about.c3t"), d: t("about.c3d") },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="font-display text-4xl text-primary md:text-5xl">{t("about.title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("about.lead")}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <article key={c.t} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-2xl">{c.t}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
