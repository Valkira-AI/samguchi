import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin, Clock, Send } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto · Sam Guchi" },
      { name: "description", content: "Contactate con Sam Guchi: Av. Senador Perez 450, Jujuy. Pedidos por WhatsApp." },
      { property: "og:title", content: "Contacto · Sam Guchi" },
      { property: "og:description", content: "Contactate con Sam Guchi: Av. Senador Perez 450, Jujuy. Pedidos por WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contacto,
});

const SUCURSALES = ["Av. Senador Perez 450, Jujuy"];

const inputClass =
  "mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

function Contacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    sucursal: SUCURSALES[0],
    mensaje: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const texto =
      `*Consulta desde la web · Sam Guchi*%0A` +
      `Nombre: ${form.nombre}%0A` +
      `Email: ${form.email}%0A` +
      `Teléfono: ${form.telefono}%0A` +
      `Sucursal: ${form.sucursal}%0A` +
      `Mensaje: ${form.mensaje}`;
    window.open(`https://wa.me/5493884000000?text=${texto}`, "_blank", "noopener,noreferrer");
    toast.success("¡Gracias! Te contactamos a la brevedad.");
    setForm({ nombre: "", email: "", telefono: "", sucursal: SUCURSALES[0], mensaje: "" });
  };

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
            <p className="mt-1 text-sm text-muted-foreground">Lun a Dom · 20:00 a 00:30</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8"
        >
          <h2 className="font-display text-2xl text-primary">Dejanos tu mensaje</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Nombre
              <input required value={form.nombre} onChange={set("nombre")} className={inputClass} placeholder="Tu nombre" />
            </label>
            <label className="block text-sm font-medium">
              Email
              <input required type="email" value={form.email} onChange={set("email")} className={inputClass} placeholder="tu@email.com" />
            </label>
            <label className="block text-sm font-medium">
              Teléfono
              <input required value={form.telefono} onChange={set("telefono")} className={inputClass} placeholder="+54 9 388 ..." />
            </label>
            <label className="block text-sm font-medium">
              Sucursal
              <select value={form.sucursal} onChange={set("sucursal")} className={inputClass}>
                {SUCURSALES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="mt-4 block text-sm font-medium">
            Mensaje
            <textarea
              required
              rows={4}
              value={form.mensaje}
              onChange={set("mensaje")}
              className={inputClass}
              placeholder="Contanos en qué te podemos ayudar"
            />
          </label>
          <button
            type="submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-warm hover:opacity-90"
          >
            <Send className="h-4 w-4" />
            Enviar consulta
          </button>
        </form>
      </section>
    </div>
  );
}
