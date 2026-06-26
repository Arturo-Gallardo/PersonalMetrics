import * as React from "react";
import { Link } from "react-router-dom";
import { KeyRound, LogOut, Settings, UserRound } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "components/ui/tooltip";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import { PASSWORD_FIELDS, PROFILE_FIELDS } from "lib/formSchemas";

export function AccountMenu() {
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState({
    title: "Listo",
    description: "",
  });

  const profileFields = React.useMemo(
    () =>
      PROFILE_FIELDS.map((field) => ({
        ...field,
        defaultValue:
          field.id === "firstName"
            ? user?.firstName ?? ""
            : field.id === "lastName"
              ? user?.lastName ?? ""
              : field.id === "email"
                ? user?.email ?? ""
                : field.id === "restaurantName"
                  ? user?.restaurantName ?? ""
                  : "",
      })),
    [user]
  );

  function showSuccess(title, description) {
    setSuccessMessage({ title, description });
    setSuccessOpen(true);
  }

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                aria-label="Cuenta y perfil"
              >
                <UserRound className="h-4 w-4 text-muted-foreground" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Tu cuenta</TooltipContent>
        </Tooltip>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {user?.restaurantName}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setProfileOpen(true)}>
            <UserRound className="h-4 w-4" />
            Editar perfil
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPasswordOpen(true)}>
            <KeyRound className="h-4 w-4" />
            Cambiar contraseña
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/app/settings" className="cursor-pointer">
              <Settings className="h-4 w-4" />
              Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setLogoutOpen(true)}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PrototypeFormDialog
        open={profileOpen}
        onOpenChange={setProfileOpen}
        title="Editar perfil"
        description="Actualiza tu nombre, correo y perfil financiero."
        fields={profileFields}
        submitLabel="Guardar perfil"
        onSubmit={() =>
          showSuccess(
            "Perfil actualizado",
            "Tus datos de cuenta se guardaron correctamente."
          )
        }
      />

      <PrototypeFormDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        title="Cambiar contraseña"
        description="Usa una contraseña segura de al menos 8 caracteres."
        fields={PASSWORD_FIELDS}
        submitLabel="Actualizar contraseña"
        onSubmit={() =>
          showSuccess(
            "Contraseña actualizada",
            "Tu nueva contraseña ya está activa."
          )
        }
      />

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

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title={successMessage.title}
        description={successMessage.description}
      />
    </>
  );
}
