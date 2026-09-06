import { Quote, Star, BadgeCheck } from "lucide-react";
import { useLang } from "@/lib/i18n";

const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJ_____SamGuchiJujuy";

const COPY = {
  es: {
    eyebrow: "Lo que dicen de nosotros",
    title: "Sabor que la gente recomienda",
    featuredQuote:
      "El mejor sándwich de milanesa de Jujuy. Pan fresco, porción generosa y siempre calentito cuando llega. Ya es parada obligada los viernes.",
    featuredName: "Lucía Ramírez",
    featuredRole: "Clienta desde 2023 · San Salvador de Jujuy · Agosto 2026",
    verified: "Reseña verificada de Google",
    cta: "Dejá tu reseña con Google",
    ctaNote: "Se abre Google y usás tu cuenta de siempre.",
    reviews: [
      {
        name: "Martín Álvarez",
        text: "La hamburguesa completa es enorme y el chimichurri del choripán es otro nivel.",
        date: "Agosto 2026",
      },
      {
        name: "Sofía Quispe",
        text: "Pedí por WhatsApp y en 20 minutos estaba listo. Atención re amable.",
        date: "Julio 2026",
      },
      {
        name: "Diego Fernández",
        text: "El combo picada jujeña lo compartimos entre tres y sobró. Precio justo.",
        date: "Junio 2026",
      },
      {
        name: "Camila Torres",
        text: "El sándwich de rúcula y bondiola se volvió mi favorito. Todo súper fresco.",
        date: "Mayo 2026",
      },
    ],
  },
  en: {
    eyebrow: "What people say",
    title: "Flavor people recommend",
    featuredQuote:
      "The best milanesa sandwich in Jujuy. Fresh bread, generous portion and always warm on arrival. A must every Friday.",
    featuredName: "Lucía Ramírez",
    featuredRole: "Customer since 2023 · San Salvador de Jujuy · August 2026",
    verified: "Verified Google review",
    cta: "Leave your review with Google",
    ctaNote: "Opens Google and uses your usual account.",
    reviews: [
      {
        name: "Martín Álvarez",
        text: "The hamburguesa completa is huge and the choripán chimichurri is next level.",
        date: "August 2026",
      },
      {
        name: "Sofía Quispe",
        text: "Ordered on WhatsApp and it was ready in 20 minutes. Lovely service.",
        date: "July 2026",
      },
      {
        name: "Diego Fernández",
        text: "We shared the combo picada jujeña between three and had leftovers. Fair price.",
        date: "June 2026",
      },
      {
        name: "Camila Torres",
        text: "The rúcula and bondiola sandwich is now my favorite. Everything super fresh.",
        date: "May 2026",
      },
    ],
  },
} as const;

function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 ${className}`} aria-label="5/5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
      ))}
    </div>
  );
}

export function SocialProof() {
  const { lang } = useLang();
  const c = COPY[lang];

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{c.eyebrow}</p>
        <h2 className="mt-2 font-display text-4xl md:text-5xl">{c.title}</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Featured dark pull-quote panel */}
        <article className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-background shadow-warm lg:col-span-2">
          <Quote className="absolute -right-4 -top-4 h-28 w-28 text-primary/25" />
          <Stars className="relative" />
          <p className="relative mt-5 font-display text-2xl leading-snug md:text-3xl">
            “{c.featuredQuote}”
          </p>
          <div className="relative mt-6">
            <p className="font-semibold">{c.featuredName}</p>
            <p className="text-sm opacity-70">{c.featuredRole}</p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-xs font-medium">
              <BadgeCheck className="h-3.5 w-3.5 text-accent" />
              {c.verified}
            </p>
          </div>
        </article>

        {/* Verified review grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {c.reviews.map((r) => (
            <article
              key={r.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-warm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-lg text-primary">
                    {r.name.charAt(0)}
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold">{r.name}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <BadgeCheck className="h-3 w-3 text-primary" />
                      Google · {r.date}
                    </span>
                  </div>
                </div>
                <Stars />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.text}</p>
            </article>
          ))}

          <div className="sm:col-span-2 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-center">
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-warm hover:opacity-90"
            >
              <Star className="h-4 w-4" />
              {c.cta}
            </a>
            <p className="text-xs text-muted-foreground">{c.ctaNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
