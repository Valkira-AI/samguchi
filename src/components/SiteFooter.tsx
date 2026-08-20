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
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-10 sm:gap-8">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contacto</h4>
          <div className="mt-4 space-y-2">
            <p className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <Phone className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" /> +54 9 388 400-0000
            </p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
              <MapPin className="h-3.5 w-3.5 text-primary sm:h-4 sm:w-4" /> Av. Senador Perez 450, Jujuy
            </p>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Horarios & Redes</h4>
          <p className="mt-4 text-xs text-muted-foreground sm:text-sm">{HOURS_LABEL_FULL}</p>
          <p className="text-xs text-muted-foreground">Pedidos online dentro de ese horario.</p>
          <div className="mt-4 flex flex-wrap gap-2 sm:gap-4">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary sm:text-sm">
              <Instagram className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Instagram
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary sm:text-sm">
              <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Facebook
            </a>
            <a href={SOCIAL.linktree} target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary sm:text-sm">
              <Link2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Linktree
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

