import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Switch } from "components/ui/switch";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import { useAuth } from "context/AuthContext";
import { useDocumentTitle } from "hooks/useDocumentTitle";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const passwordFields = [
  {
    id: "currentPassword",
    label: "Escribe tu contraseña vieja",
    type: "password",
    required: true,
    fullWidth: true,
    autoComplete: "current-password",
  },
  {
    id: "confirmOldPassword",
    label: "Escribe tu contraseña vieja de nuevo",
    type: "password",
    required: true,
    fullWidth: true,
    autoComplete: "current-password",
  },
  {
    id: "newPassword",
    label: "Escribe tu contraseña nueva",
    type: "password",
    required: true,
    fullWidth: true,
    autoComplete: "new-password",
  },
];

function SettingSwitch({ id, title, description, defaultChecked = false }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{title}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} defaultChecked={defaultChecked} aria-label={title} />
    </div>
  );
}

export default function SettingsPage() {
  useDocumentTitle("Configuración");
  const { user, logout } = useAuth();
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successConfig, setSuccessConfig] = React.useState({
    title: "Cambios guardados",
    description: "Los cambios han sido guardados.",
  });

  function showSuccess(title, description) {
    setSuccessConfig({ title, description });
    setSuccessOpen(true);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra tu cuenta, tu perfil financiero y tus preferencias.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cuenta</CardTitle>
          <CardDescription>
            Datos personales usados para acceder a PersonalMetrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input id="firstName" defaultValue={user?.firstName ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input id="lastName" defaultValue={user?.lastName ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email ?? ""}
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              Este correo se usa para iniciar sesión y recibir avisos
              importantes.
            </p>
          </div>
          <Button
            type="button"
            onClick={() =>
              showSuccess(
                "Cambios guardados",
                "Los cambios han sido guardados."
              )
            }
          >
            Guardar cambios
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferencias financieras</CardTitle>
          <CardDescription>
            Ajusta cómo se muestran y organizan tus datos financieros.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <select id="currency" className={selectClassName} defaultValue="USD">
                <option value="USD">Dólar Americano (USD)</option>
                <option value="MXN">Peso Mexicano (MXN)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Horario</Label>
              <select
                id="timezone"
                className={selectClassName}
                defaultValue="America/Hermosillo"
              >
                <option value="America/Hermosillo">Hermosillo (GMT-7)</option>
                <option value="America/Mexico_City">
                  Ciudad de México (GMT-6)
                </option>
                <option value="America/Tijuana">Tijuana (GMT-8)</option>
              </select>
            </div>
          </div>
          <div className="max-w-xs space-y-2">
            <Label htmlFor="monthStart">Periodo financiero</Label>
            <select id="monthStart" className={selectClassName} defaultValue="1">
              <option value="1">Primer día del mes</option>
              <option value="15">Día 15 de cada mes</option>
            </select>
          </div>
          <Button
            type="button"
            onClick={() =>
              showSuccess(
                "Cambios guardados",
                "Los cambios han sido guardados."
              )
            }
          >
            Guardar preferencias
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones</CardTitle>
          <CardDescription>
            Elige qué avisos de la aplicación quieres recibir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingSwitch
            id="paymentReminders"
            title="Pagos recurrentes"
            description="Avisos antes del vencimiento de renta, servicios y suscripciones."
            defaultChecked
          />
          <Separator />
          <SettingSwitch
            id="weeklySummary"
            title="Resumen financiero"
            description="Resumen periódico de ingresos, gastos y patrimonio."
            defaultChecked
          />
          <Separator />
          <SettingSwitch
            id="forecastChanges"
            title="Cambios en el pronóstico"
            description="Avisos cuando cambien tus ingresos, gastos o ahorro proyectado."
          />
          <Button
            type="button"
            className="mt-2"
            onClick={() =>
              showSuccess(
                "Cambios guardados",
                "Los cambios han sido guardados."
              )
            }
          >
            Guardar notificaciones
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>
            Protege el acceso a tu cuenta y administra tu sesión.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Contraseña</p>
              <p className="text-sm text-muted-foreground">
                Actualiza tu contraseña periódicamente.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPasswordOpen(true)}
            >
              Cambiar contraseña
            </Button>
          </div>
          <Separator />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Cerrar sesión</p>
              <p className="text-sm text-muted-foreground">
                Sal de PersonalMetrics en este dispositivo.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLogoutOpen(true)}
            >
              Cerrar sesión
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Eliminar cuenta</CardTitle>
          <CardDescription>
            Esta acción eliminará permanentemente todos tus datos financieros.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Eliminar cuenta
          </Button>
        </CardContent>
      </Card>

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title={successConfig.title}
        description={successConfig.description}
      />
      <PrototypeFormDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        title="Cambiar contraseña"
        description="Cambia tu contraseña."
        fields={passwordFields}
        submitLabel="Cambiar contraseña"
        onSubmit={() =>
          showSuccess(
            "Contraseña actualizada",
            "Tu contraseña ha sido actualizada."
          )
        }
      />
      <ConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        title="¿Estás seguro que quieres cerrar sesión?"
        description="Tendrás que iniciar sesión de nuevo después."
        confirmLabel="Cerrar sesión"
        cancelLabel="Cancelar"
        destructive
        onConfirm={logout}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="¿Estás seguro que quieres borrar tu cuenta?"
        description="Esta acción eliminará permanentemente todos tus datos."
        confirmLabel="BORRAR CUENTA"
        cancelLabel="Cancelar"
        destructive
      />
    </div>
  );
}
