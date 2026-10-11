import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logo from "@/assets/logo.png";
import { useLang, type Lang } from "@/lib/i18n";

const NAV = [
  { to: "/", key: "nav.inicio", exact: true },
  { to: "/menu", key: "nav.productos", exact: false },
  { to: "/nosotros", key: "nav.nosotros", exact: false },
  { to: "/contacto", key: "nav.contacto", exact: false },
] as const;

function LangSwitch() {
  const { lang, setLang, t } = useLang();
  const opts: Lang[] = ["es", "en"];
  return (
    <div
      aria-label={t("lang.label")}
      className="inline-flex items-center rounded-full border border-border bg-card p-0.5"
    >
      {opts.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase transition ${
            lang === l
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader({ action }: { action?: ReactNode }) {
  const { t } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-3 md:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Sam Guchi"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
          />
          <span className="leading-none">
            <span className="block font-display text-2xl text-primary">Sam Guchi</span>
            <span className="block text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {t("brand.tagline")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              activeProps={{ className: "bg-primary/10 text-primary" }}
              className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/80 transition hover:bg-muted hover:text-primary"
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LangSwitch />
          {action}
        </div>
      </div>

      <nav className="flex items-center justify-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.exact }}
            activeProps={{ className: "bg-primary text-primary-foreground" }}
            className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
          >
            {t(n.key)}
          </Link>
        ))}
        <span className="ml-1">
          <LangSwitch />
        </span>
      </nav>
    </header>
  );
}
