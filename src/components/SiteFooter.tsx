import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Instagram, Facebook, Link2 } from "lucide-react";
import logoAsset from "@/assets/logosamguchi.png.asset.json";

const logo = logoAsset.url;

const SOCIAL = {
  instagram: "https://www.instagram.com/eldesembarcook/",
  facebook: "https://www.facebook.com/eldesembarcoo/",
  linktree: "https://linktr.ee/eldesembarco",
};

export function SiteFooter() {
  return (
    <footer id="contacto" className="border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-display text-xl text-primary">SAM GUCHI</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Sándwiches artesanales con sabor jujeño. Pedí online y disfrutá.
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Contacto</h4>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />+54 9 388 400-0000
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />Av. Senador Perez 450, Jujuy
          </p>
        </div>
        <div>
          <h4 className="font-semibold">Horarios & Redes</h4>
          <p className="mt-2 text-sm text-muted-foreground">Lun a Dom · 18:00 a 00:30</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary">
              <Instagram className="h-4 w-4" /> Instagram
            </a>
            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary">
              <Facebook className="h-4 w-4" /> Facebook
            </a>
            <a href={SOCIAL.linktree} target="_blank" rel="noopener noreferrer" aria-label="Linktree" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary">
              <Link2 className="h-4 w-4" /> Linktree
            </a>
          </div>
          <Link to="/admin" className="mt-4 inline-block text-sm text-muted-foreground hover:text-primary hover:underline">
            Panel de administración →
          </Link>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sam Guchi — Todos los derechos reservados.
      </div>
    </footer>
  );
}
