import * as React from "react";
import { Link } from "react-router-dom";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useAuth } from "context/AuthContext";
import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "components/ui/tooltip";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";

export function AccountMenu() {
  const { user, logout } = useAuth();
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-full" aria-label="Cuenta y perfil">
                <UserRound className="h-4 w-4 text-muted-foreground" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Tu cuenta</TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/app/settings" className="cursor-pointer">
              <Settings className="h-4 w-4" />
              Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setLogoutOpen(true)}>
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="¿Cerrar sesión?"
        description="Saldrás de PersonalMetrics en este dispositivo."
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
        destructive
        onConfirm={logout}
      />
    </>
  );
}
