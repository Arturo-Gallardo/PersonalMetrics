import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  BellRing,
  Banknote,
  Gem,
  LayoutDashboard,
  LineChart,
  Menu,
  Settings,
  Wallet,
} from "lucide-react";
import { cn } from "lib/utils";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components/ui/dialog";
import { APP_NAME, APP_TAGLINE } from "lib/app";

const nav = [
  { to: "/app", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "/app/income", label: "Ingresos", icon: Banknote },
  { to: "/app/expenses", label: "Gastos", icon: Wallet },
  { to: "/app/assets", label: "Activos", icon: Gem },
  { to: "/app/alerts", label: "Alertas", icon: BellRing },
  { to: "/app/forecast", label: "Pronóstico", icon: LineChart },
  { to: "/app/settings", label: "Configuración", icon: Settings },
];

const activeNavClass =
  "bg-primary text-white hover:bg-primary hover:text-white dark:bg-primary dark:text-white";

export function SidebarBrand({ subtitle = APP_TAGLINE }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold tracking-tight text-primary">{APP_NAME}</span>
      <span className="text-sm text-muted-foreground">{subtitle}</span>
    </div>
  );
}

function NavItems({ onNavigate, mobile }) {
  return (
    <nav className={cn("flex flex-col gap-1", mobile && "px-1")}>
      {nav.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? activeNavClass
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-card lg:flex lg:flex-col">
      <div className="flex-1 overflow-y-auto p-3">
        <NavItems />
      </div>
    </aside>
  );
}

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden" type="button">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Abrir navegación</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="left-0 top-0 flex h-full max-w-xs translate-x-0 translate-y-0 flex-col rounded-none border-y-0 border-l-0 p-0 sm:max-w-xs">
        <DialogHeader className="border-b bg-background px-4 py-4 text-left">
          <DialogTitle className="text-xl font-bold text-primary">{APP_NAME}</DialogTitle>
          <p className="text-sm text-muted-foreground">{APP_TAGLINE}</p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-3">
          <NavItems mobile onNavigate={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
