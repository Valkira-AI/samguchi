import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Clock } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto · Sam Guchi" },
      { name: "description", content: "Contactate con Sam Guchi: Av. Senador Perez 450, Jujuy. Pedidos por WhatsApp." },
      { property: "og:title", content: "Contacto · Sam Guchi" },
      { property: "og:description", content: "Contactate con Sam Guchi: Av. Senador Perez 450, Jujuy. Pedidos por WhatsApp." },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="font-display text-4xl text-primary md:text-5xl">Contacto</h1>
        <p className="mt-3 text-muted-foreground">Escribinos y armamos tu pedido al toque.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Phone className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">Teléfono</h2>
            <p className="mt-1 text-sm text-muted-foreground">+54 9 388 400-0000</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">Dirección</h2>
            <p className="mt-1 text-sm text-muted-foreground">Av. Senador Perez 450, Jujuy</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="mt-3 font-semibold">Horarios</h2>
            <p className="mt-1 text-sm text-muted-foreground">Lun a Dom · 18:00 a 00:30</p>
          </div>
        </div>
        <a
          href="https://wa.me/5493884000000"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-warm hover:opacity-90"
        >
          Escribinos por WhatsApp
        </a>
      </section>
    </div>
  );
}
