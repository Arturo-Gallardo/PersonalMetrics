import * as React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { APP_NAME } from "lib/app";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  useDocumentTitle("Iniciar sesión");
  const { login, resetPassword, isAuthenticated, authError } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/app";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [formError, setFormError] = React.useState("");
  const [forgotOpen, setForgotOpen] = React.useState(false);
  const [resetSentOpen, setResetSentOpen] = React.useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!emailPattern.test(email.trim()) || password.length < 6) {
      setFormError(
        "Ingresa un correo válido y una contraseña de al menos 6 caracteres.",
      );
      return;
    }

    setPending(true);
    const result = await login({ email: email.trim(), password });
    setPending(false);
    if (!result.ok) setFormError(result.error);
  }

  async function handleReset(values) {
    const targetEmail = values.email?.trim();
    if (!emailPattern.test(targetEmail)) {
      setFormError("Ingresa un correo válido para recuperar tu contraseña.");
      return;
    }

    const result = await resetPassword(targetEmail);
    if (result.ok) setResetSentOpen(true);
    else setFormError(result.error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Inicia sesión en {APP_NAME}
          </CardTitle>
          <CardDescription>
            Entra para consultar tu resumen financiero, registrar ingresos y
            gastos, revisar activos y anticipar cambios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            {formError || authError ? (
              <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {formError || authError}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Tus datos financieros en un solo lugar
              </span>
              <button
                type="button"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                onClick={() => setForgotOpen(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <Button className="w-full" type="submit" disabled={pending}>
              {pending ? "Iniciando sesión…" : "Continuar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Crear una
            </Link>
          </p>
        </CardContent>
      </Card>

      <PrototypeFormDialog
        open={forgotOpen}
        onOpenChange={setForgotOpen}
        title="Recuperación de contraseña"
        description="Ingresa el correo asociado a tu cuenta. Firebase enviará un enlace seguro para crear una nueva contraseña."
        fields={[
          {
            id: "email",
            label: "Correo electrónico",
            type: "email",
            defaultValue: email,
            required: true,
            fullWidth: true,
          },
        ]}
        submitLabel="Enviar enlace"
        onSubmit={handleReset}
      />
      <SuccessDialog
        open={resetSentOpen}
        onOpenChange={setResetSentOpen}
        title="Revisa tu correo"
        description="Si existe una cuenta con ese correo, recibirás un enlace para recuperar tu contraseña."
      />
    </div>
  );
}
