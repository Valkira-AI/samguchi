import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Instagram, Facebook, Link2 } from "lucide-react";
import { HOURS_LABEL_FULL } from "@/lib/hours";

const SOCIAL = {
  instagram: "https://www.instagram.com/eldesembarcook/",
  facebook: "https://www.facebook.com/eldesembarcoo/",
  linktree: "https://linktr.ee/eldesembarco",
};

export function SiteFooter() {
  return (
    <footer id="contacto" className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contacto</h4>
          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" /> +54 9 388 400-0000
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Av. Senador Perez 450, Jujuy
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Horarios & Redes</h4>
          <p className="mt-4 text-sm text-muted-foreground">{HOURS_LABEL_FULL}</p>
          <p className="text-xs text-muted-foreground">Pedidos online dentro de ese horario.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
            <a href={SOCIAL.linktree} target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
              <Link2 className="h-4 w-4" /> Linktree
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sam Guchi — Todos los derechos reservados.
          </p>
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary hover:underline">
            Panel de administración
          </Link>
        </div>
      </div>
    </footer>
  );
}

