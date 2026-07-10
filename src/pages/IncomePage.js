import * as React from "react";
import { CalendarClock, CircleDollarSign, Plus, WalletCards } from "lucide-react";
import { FinanceMetricCard } from "components/finance/FinanceMetricCard";
import { CrudRowActions } from "components/crud/CrudRowActions";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUserFinanceData } from "hooks/useUserFinanceData";
import { INCOME_CATEGORY_LABELS, currentMonthKey, sumBy } from "lib/finance";
import { formatCurrency } from "lib/format";

const categories = Object.keys(INCOME_CATEGORY_LABELS);

export default function IncomePage() {
  useDocumentTitle("Ingresos");
  const { income, createItem, updateItem, deleteItem, createSystemAlert } = useUserFinanceData();
  const [label, setLabel] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState(categories[0]);
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [editing, setEditing] = React.useState(null);
  const [deleting, setDeleting] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState("");
  const month = currentMonthKey();
  const monthly = sumBy(income.filter((item) => item.date?.startsWith(month)), (item) => item.amount);
  const annual = sumBy(income.filter((item) => item.date?.startsWith(String(new Date().getFullYear()))), (item) => item.amount);
  const lastDate = income[0]?.date || "Sin registros";

  async function addIncome(event) {
    event.preventDefault();
    if (!label.trim() || !amount || !date) return;
    try {
      const incomeAmount = Number(amount);
      const incomeLabel = label.trim();
      await createItem("income", { label: incomeLabel, category, amount: incomeAmount, date });
      await createSystemAlert({
        type: "income",
        severity: "info",
        message: `Se registró ingreso de ${formatCurrency(incomeAmount)} por ${incomeLabel}.`,
      });
      setLabel("");
      setAmount("");
      setSuccess({ title: "Ingreso registrado", description: "El ingreso se guardó en Firestore." });
    } catch (err) {
      setError(err.message || "No se pudo guardar el ingreso.");
    }
  }

  async function handleEdit(values) {
    if (!editing) return;
    try {
      await updateItem("income", editing.id, {
        label: values.label || editing.label,
        category: values.category || editing.category,
        amount: Number(values.amount || editing.amount),
        date: values.date || editing.date,
      });
      setSuccess({ title: "Ingreso actualizado", description: "Los cambios se guardaron." });
    } catch (err) {
      setError(err.message || "No se pudo actualizar el ingreso.");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteItem("income", deleting.id);
      setSuccess({ title: "Ingreso eliminado", description: "El ingreso se eliminó." });
    } catch (err) {
      setError(err.message || "No se pudo eliminar el ingreso.");
    }
  }

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-semibold tracking-tight">Gestión de ingresos</h1><p className="text-sm text-muted-foreground">Registra el dinero que recibes y entiende de dónde viene.</p></div>
      {error ? <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <FinanceMetricCard icon={CircleDollarSign} label="Ingreso anual" value={formatCurrency(annual)} detail="Ingresos registrados este año." />
        <FinanceMetricCard icon={WalletCards} label="Ingreso mensual" value={formatCurrency(monthly)} detail="Entradas registradas este mes." tone="blue" />
        <FinanceMetricCard icon={CalendarClock} label="Última actualización" value={lastDate} detail={`${income.length} movimientos registrados.`} tone="amber" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2"><CardHeader><CardTitle>Todos los ingresos</CardTitle><CardDescription>Sueldo, trabajo independiente, rendimientos y ventas.</CardDescription></CardHeader><CardContent>{income.length ? <Table><TableHeader><TableRow><TableHead>Concepto</TableHead><TableHead>Categoría</TableHead><TableHead>Fecha</TableHead><TableHead className="text-right">Monto</TableHead><TableHead className="w-[90px] text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{income.map((entry) => <TableRow key={entry.id}><TableCell className="font-medium">{entry.label}</TableCell><TableCell className="text-muted-foreground">{INCOME_CATEGORY_LABELS[entry.category] || entry.category}</TableCell><TableCell className="text-muted-foreground">{entry.date}</TableCell><TableCell className="text-right font-semibold tabular-nums text-primary">{formatCurrency(entry.amount)}</TableCell><TableCell className="text-right"><CrudRowActions itemLabel={entry.label} onEdit={() => setEditing(entry)} onDelete={() => setDeleting(entry)} /></TableCell></TableRow>)}</TableBody></Table> : <p className="py-10 text-center text-sm text-muted-foreground">No hay ingresos todavía. Agrega el primero desde el formulario.</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Agregar ingreso</CardTitle><CardDescription>Captura una nueva entrada de dinero.</CardDescription></CardHeader><CardContent><form className="space-y-3" onSubmit={addIncome}><div className="space-y-2"><Label htmlFor="income-label">Concepto</Label><Input id="income-label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ej. Sueldo" /></div><div className="space-y-2"><Label htmlFor="income-category">Categoría</Label><select id="income-category" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item} value={item}>{INCOME_CATEGORY_LABELS[item]}</option>)}</select></div><div className="space-y-2"><Label htmlFor="income-amount">Monto (MXN)</Label><Input id="income-amount" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} /></div><div className="space-y-2"><Label htmlFor="income-date">Fecha</Label><Input id="income-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div><Button type="submit" className="w-full gap-2"><Plus className="h-4 w-4" />Guardar ingreso</Button></form></CardContent></Card>
      </div>
      <PrototypeFormDialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)} title="Editar ingreso" fields={[{ id: "label", label: "Concepto", defaultValue: editing?.label, required: true }, { id: "category", label: "Categoría", type: "select", defaultValue: editing?.category, options: categories.map((item) => ({ value: item, label: INCOME_CATEGORY_LABELS[item] })) }, { id: "amount", label: "Monto", type: "number", defaultValue: editing?.amount, min: "0", step: "0.01", required: true }, { id: "date", label: "Fecha", type: "date", defaultValue: editing?.date, required: true }]} submitLabel="Guardar cambios" onSubmit={handleEdit} />
      <ConfirmDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)} title="¿Eliminar ingreso?" description={deleting?.label} confirmLabel="Eliminar" destructive onConfirm={handleDelete} />
      <SuccessDialog open={Boolean(success)} onOpenChange={(open) => !open && setSuccess(null)} title={success?.title} description={success?.description} />
    </div>
  );
}
