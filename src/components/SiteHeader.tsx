import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logoAsset from "@/assets/logosamguchi.png.asset.json";

const logo = logoAsset.url;

const NAV = [
  { to: "/", label: "Inicio", exact: true },
  { to: "/menu", label: "Productos", exact: false },
  { to: "/nosotros", label: "Nosotros", exact: false },
  { to: "/contacto", label: "Contacto", exact: false },
] as const;

export function SiteHeader({ action }: { action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-3 md:justify-between">

        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Sam Guchi" width={44} height={44} className="h-11 w-11 object-contain" />
          <span className="leading-none">
            <span className="block font-display text-2xl text-primary">Sam Guchi</span>
            <span className="block text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              El sándwich que te gusta
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
              {n.label}
            </Link>
          ))}
        </nav>

        {action}
      </div>

      <nav className="flex justify-center gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.exact }}
            activeProps={{ className: "bg-primary text-primary-foreground" }}
            className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
