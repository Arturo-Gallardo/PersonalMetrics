import * as React from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUserFinanceData } from "hooks/useUserFinanceData";
import { ALERT_SEVERITY_LABELS, ALERT_TYPE_LABELS } from "lib/finance";

const severityVariant = { info: "outline", warning: "warning", critical: "destructive" };

export default function AlertsPage() {
  useDocumentTitle("Alertas");
  const { alerts, deleteItem } = useUserFinanceData();
  const [pendingAlert, setPendingAlert] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState("");

  async function confirmDelete() {
    if (!pendingAlert) return;
    try { await deleteItem("alerts", pendingAlert.id); setSuccess({ title: "Alerta eliminada", description: "La alerta se eliminó." }); }
    catch (err) { setError(err.message || "No se pudo eliminar la alerta."); }
  }

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-semibold tracking-tight">Alertas</h1><p className="text-sm text-muted-foreground">Avisos financieros creados automáticamente por el sistema.</p></div>
      {error ? <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}
      <Card><CardHeader><CardTitle>Flujo de alertas</CardTitle><CardDescription>{alerts.length} alertas activas.</CardDescription></CardHeader><CardContent>{alerts.length ? <Table><TableHeader><TableRow><TableHead>Tipo</TableHead><TableHead>Severidad</TableHead><TableHead>Mensaje</TableHead><TableHead>Fecha</TableHead><TableHead className="w-[80px] text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{alerts.map((alert) => <TableRow key={alert.id}><TableCell className="font-mono text-xs font-medium text-muted-foreground">{ALERT_TYPE_LABELS[alert.type] || alert.type}</TableCell><TableCell><Badge variant={severityVariant[alert.severity] || "outline"}>{ALERT_SEVERITY_LABELS[alert.severity] || alert.severity}</Badge></TableCell><TableCell className="max-w-md text-sm">{alert.message}</TableCell><TableCell className="whitespace-nowrap text-xs text-muted-foreground">{alert.date}</TableCell><TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => setPendingAlert(alert)}><Trash2 className="h-4 w-4" /><span className="sr-only">Eliminar alerta</span></Button></TableCell></TableRow>)}</TableBody></Table> : <p className="py-10 text-center text-sm text-muted-foreground">No tienes alertas activas. Se crearán automáticamente cuando registres ingresos, gastos o activos.</p>}</CardContent></Card>
      <ConfirmDialog open={Boolean(pendingAlert)} onOpenChange={(open) => !open && setPendingAlert(null)} title="¿Eliminar alerta?" description="Se quitará de tu lista." confirmLabel="Eliminar alerta" destructive onConfirm={confirmDelete} />
      <SuccessDialog open={Boolean(success)} onOpenChange={(open) => !open && setSuccess(null)} title={success?.title} description={success?.description} />
    </div>
  );
}
