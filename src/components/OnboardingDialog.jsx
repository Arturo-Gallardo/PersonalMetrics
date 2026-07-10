import { BarChart3, BellRing, Gem, PiggyBank, ReceiptText, WalletCards } from "lucide-react";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";

const steps = [
  { icon: BarChart3, title: "Resumen", text: "Mira ingresos, gastos, saldo y patrimonio en un solo tablero." },
  { icon: WalletCards, title: "Ingresos", text: "Registra sueldo, trabajos independientes, ventas o rendimientos." },
  { icon: ReceiptText, title: "Gastos", text: "Clasifica salidas, marca gastos recurrentes y entiende patrones." },
  { icon: Gem, title: "Activos", text: "Guarda bienes e inversiones que forman parte de tu patrimonio." },
  { icon: BellRing, title: "Alertas", text: "Crea recordatorios financieros importantes y elimínalos cuando terminen." },
  { icon: PiggyBank, title: "Pronóstico", text: "Proyecta próximos meses con base en tu historial real." },
];

export function OnboardingDialog({ open, onComplete, pending }) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl" hideClose>
        <DialogHeader>
          <DialogTitle>Bienvenido a PersonalMetrics</DialogTitle>
          <DialogDescription>
            Tu cuenta empieza vacía. Este recorrido rápido te muestra dónde capturar tus datos para que el tablero cobre vida.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border bg-muted/20 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" onClick={onComplete} disabled={pending}>
            {pending ? "Preparando…" : "Entrar a mi tablero"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
