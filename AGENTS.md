# Sam Guchi

Sitio web de venta de sándwiches artesanales de Jujuy: catálogo público (inicio,
menú, nosotros, contacto) y panel de administración con pedidos, catálogo,
personal y reportes.

- Stack: TanStack Start + React + TypeScript + Vite + Tailwind CSS.
- Datos: almacenados en el navegador (`localStorage`) y en módulos declarativos.
- Despliegue: GitHub Pages mediante el workflow `.github/workflows/deploy.yml`.
- Acceso admin: contraseña validada por hash en `src/lib/admin-gate.ts`.
