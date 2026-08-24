import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="font-display text-4xl text-primary md:text-5xl">Nosotros</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Sam Guchi nació en el corazón de Jujuy con una idea simple: un sándwich bien hecho alegra el día.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { t: "Hecho a mano", d: "Cada milanesa, cada pan y cada salsa se preparan en el día." },
            { t: "Productos de la tierra", d: "Trabajamos con proveedores jujeños y carnes de primera calidad." },
            { t: "Atención cercana", d: "Pedís por WhatsApp y te respondemos como si estuvieras en el mostrador." },
          ].map((c) => (
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
