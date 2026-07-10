import * as React from "react";
import { Link, Navigate } from "react-router-dom";
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
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { APP_NAME } from "lib/app";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  useDocumentTitle("Crear cuenta");
  const { signup, isAuthenticated, authError } = useAuth();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [formError, setFormError] = React.useState("");

  if (isAuthenticated) return <Navigate to="/app" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstName.trim() || !emailPattern.test(email.trim()) || password.length < 6) {
      setFormError("Ingresa nombre, correo válido y contraseña de al menos 6 caracteres.");
      return;
    }

    setPending(true);
    const result = await signup({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    setPending(false);
    if (!result.ok) setFormError(result.error);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Regístrate en {APP_NAME}
          </CardTitle>
          <CardDescription>
            Crea una cuenta privada para registrar ingresos, gastos, activos, alertas y pronósticos personales.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" noValidate onSubmit={handleSubmit}>
            {formError || authError ? (
              <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                {formError || authError}
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <p className="text-xs text-muted-foreground">Mínimo 6 caracteres.</p>
            </div>
            <Button className="w-full" type="submit" disabled={pending}>
              {pending ? "Creando…" : "Continuar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta? <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">Inicia sesión</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
