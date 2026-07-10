import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
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

const selectClassName = "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function SettingSwitch({ id, title, description, checked, onCheckedChange }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div className="space-y-1"><Label htmlFor={id}>{title}</Label><p className="text-sm text-muted-foreground">{description}</p></div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} aria-label={title} />
    </div>
  );
}

export default function SettingsPage() {
  useDocumentTitle("Configuración");
  const { user, logout, resetPassword, updateUserProfile } = useAuth();
  const [firstName, setFirstName] = React.useState(user?.firstName || "");
  const [lastName, setLastName] = React.useState(user?.lastName || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [preferences, setPreferences] = React.useState(user?.preferences || {});
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
    setEmail(user?.email || "");
    setPreferences(user?.preferences || {});
  }, [user]);

  function setPreference(key, value) {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  }

  async function saveProfile() {
    try {
      await updateUserProfile({ firstName, lastName, email });
      setSuccess({ title: "Perfil guardado", description: "Tus datos de cuenta se actualizaron." });
    } catch (err) { setError(err.message || "No se pudo guardar el perfil."); }
  }

  async function savePreferences() {
    try {
      await updateUserProfile({ preferences });
      setSuccess({ title: "Preferencias guardadas", description: "Tus preferencias se actualizaron." });
    } catch (err) { setError(err.message || "No se pudieron guardar las preferencias."); }
  }

  async function sendPasswordReset() {
    const result = await resetPassword(email);
    if (result.ok) setSuccess({ title: "Revisa tu correo", description: "Firebase envió un enlace para cambiar tu contraseña." });
    else setError(result.error);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div><h1 className="text-2xl font-semibold tracking-tight">Configuración</h1><p className="mt-1 text-sm text-muted-foreground">Administra tu cuenta, perfil financiero y preferencias.</p></div>
      {error ? <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}
      <Card><CardHeader><CardTitle>Cuenta</CardTitle><CardDescription>Datos personales usados para acceder a PersonalMetrics.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="firstName">Nombre</Label><Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="lastName">Apellido</Label><Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div></div><div className="space-y-2"><Label htmlFor="email">Correo electrónico</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="max-w-md" /><p className="text-xs text-muted-foreground">Cambiar correo puede requerir sesión reciente en Firebase.</p></div><div className="flex flex-wrap gap-2"><Button type="button" onClick={saveProfile}>Guardar cambios</Button><Button type="button" variant="outline" onClick={() => setPasswordOpen(true)}>Cambiar contraseña</Button></div></CardContent></Card>
      <Card><CardHeader><CardTitle>Preferencias financieras</CardTitle><CardDescription>Ajusta cómo se muestran y organizan tus datos financieros.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="currency">Moneda</Label><select id="currency" className={selectClassName} value={preferences.currency || "MXN"} onChange={(e) => setPreference("currency", e.target.value)}><option value="MXN">Peso Mexicano (MXN)</option><option value="USD">Dólar Americano (USD)</option></select></div><div className="space-y-2"><Label htmlFor="timezone">Horario</Label><select id="timezone" className={selectClassName} value={preferences.timezone || "America/Hermosillo"} onChange={(e) => setPreference("timezone", e.target.value)}><option value="America/Hermosillo">Hermosillo (GMT-7)</option><option value="America/Mexico_City">Ciudad de México</option><option value="America/Tijuana">Tijuana</option></select></div></div><div className="max-w-xs space-y-2"><Label htmlFor="monthStart">Periodo financiero</Label><select id="monthStart" className={selectClassName} value={preferences.monthStart || "1"} onChange={(e) => setPreference("monthStart", e.target.value)}><option value="1">Primer día del mes</option><option value="15">Día 15 de cada mes</option></select></div><Button type="button" onClick={savePreferences}>Guardar preferencias</Button></CardContent></Card>
      <Card><CardHeader><CardTitle>Notificaciones</CardTitle><CardDescription>Elige qué avisos de la aplicación quieres recibir.</CardDescription></CardHeader><CardContent><SettingSwitch id="paymentReminders" title="Pagos recurrentes" description="Avisos antes del vencimiento de pagos importantes." checked={Boolean(preferences.paymentReminders)} onCheckedChange={(value) => setPreference("paymentReminders", value)} /><Separator /><SettingSwitch id="weeklySummary" title="Resumen financiero" description="Resumen periódico de ingresos, gastos y patrimonio." checked={Boolean(preferences.weeklySummary)} onCheckedChange={(value) => setPreference("weeklySummary", value)} /><Separator /><SettingSwitch id="forecastChanges" title="Cambios en el pronóstico" description="Avisos cuando cambien tus ingresos, gastos o ahorro proyectado." checked={Boolean(preferences.forecastChanges)} onCheckedChange={(value) => setPreference("forecastChanges", value)} /><Button type="button" className="mt-2" onClick={savePreferences}>Guardar notificaciones</Button></CardContent></Card>
      <Card className="border-destructive/30"><CardHeader><CardTitle>Sesión</CardTitle><CardDescription>Opciones de acceso para este dispositivo.</CardDescription></CardHeader><CardContent><Button variant="destructive" type="button" onClick={() => setLogoutOpen(true)}>Cerrar sesión</Button></CardContent></Card>
      <PrototypeFormDialog open={passwordOpen} onOpenChange={setPasswordOpen} title="Cambiar contraseña" description="Te enviaremos un enlace seguro al correo de tu cuenta." fields={[{ id: "email", label: "Correo", type: "email", defaultValue: email, required: true, fullWidth: true }]} submitLabel="Enviar enlace" onSubmit={sendPasswordReset} />
      <ConfirmDialog open={logoutOpen} onOpenChange={setLogoutOpen} title="¿Cerrar sesión?" description="Saldrás de PersonalMetrics en este dispositivo." confirmLabel="Cerrar sesión" destructive onConfirm={logout} />
      <SuccessDialog open={Boolean(success)} onOpenChange={(open) => !open && setSuccess(null)} title={success?.title} description={success?.description} />
    </div>
  );
}
