import * as React from "react";
import { CalendarClock, CreditCard, Plus, ReceiptText } from "lucide-react";
import { FinanceMetricCard } from "components/finance/FinanceMetricCard";
import { CrudRowActions } from "components/crud/CrudRowActions";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUserFinanceData } from "hooks/useUserFinanceData";
import { EXPENSE_CATEGORY_LABELS, currentMonthKey, sumBy } from "lib/finance";
import { formatCurrency } from "lib/format";

const categories = Object.keys(EXPENSE_CATEGORY_LABELS);

export default function ExpensesPage() {
  useDocumentTitle("Gastos");
  const {
    income,
    expenses,
    createItem,
    updateItem,
    deleteItem,
    createSystemAlert,
  } = useUserFinanceData();
  const [label, setLabel] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [category, setCategory] = React.useState(categories[0]);
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [recurring, setRecurring] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [deleting, setDeleting] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState("");
  const recurringRows = expenses.filter((row) => row.recurring);
  const recurringExpenses = sumBy(recurringRows, (row) => row.amount);
  const month = currentMonthKey();
  const monthlyIncome = sumBy(
    income.filter((item) => item.date?.startsWith(month)),
    (item) => item.amount,
  );
  const monthly = sumBy(
    expenses.filter((item) => item.date?.startsWith(month)),
    (item) => item.amount,
  );
  const lastDate = expenses[0]?.date || "Sin registros";

  async function addExpense(event) {
    event.preventDefault();
    if (!label.trim() || !amount || !date) return;
    try {
      const expenseAmount = Number(amount);
      const expenseLabel = label.trim();
      await createItem("expenses", {
        label: expenseLabel,
        category,
        amount: expenseAmount,
        date,
        recurring,
      });
      const alerts = [
        createSystemAlert({
          type: "expense",
          severity: "info",
          message: `Se registró gasto de ${formatCurrency(expenseAmount)} en ${expenseLabel}.`,
        }),
      ];
      if (recurring) {
        alerts.push(
          createSystemAlert({
            type: "recurring",
            severity: "warning",
            message: `${expenseLabel} quedó como gasto recurrente mensual.`,
          }),
        );
      }
      if (date.startsWith(month) && monthly + expenseAmount > monthlyIncome) {
        alerts.push(
          createSystemAlert({
            type: "balance",
            severity: "critical",
            message: "Tus gastos del mes ya superan tus ingresos registrados.",
          }),
        );
      }
      await Promise.all(alerts);
      setLabel("");
      setAmount("");
      setRecurring(false);
      setSuccess({
        title: "Gasto registrado",
        description: "El gasto se guardó en Firestore.",
      });
    } catch (err) {
      setError(err.message || "No se pudo guardar el gasto.");
    }
  }

  async function handleEdit(values) {
    if (!editing) return;
    try {
      await updateItem("expenses", editing.id, {
        label: values.label || editing.label,
        category: values.category || editing.category,
        amount: Number(values.amount || editing.amount),
        date: values.date || editing.date,
        recurring: Boolean(values.recurring),
      });
      setSuccess({
        title: "Gasto actualizado",
        description: "Los cambios se guardaron.",
      });
    } catch (err) {
      setError(err.message || "No se pudo actualizar el gasto.");
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    try {
      await deleteItem("expenses", deleting.id);
      setSuccess({
        title: "Gasto eliminado",
        description: "El gasto se eliminó.",
      });
    } catch (err) {
      setError(err.message || "No se pudo eliminar el gasto.");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestión de gastos
        </h1>
        <p className="text-sm text-muted-foreground">
          Clasifica tus gastos y mantén claro cuánto dinero sale cada mes.
        </p>
      </div>
      {error ? (
        <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <FinanceMetricCard
          icon={ReceiptText}
          label="Gastos recurrentes"
          value={formatCurrency(recurringExpenses)}
          detail="Compromisos que se repiten."
          tone="amber"
        />
        <FinanceMetricCard
          icon={CreditCard}
          label="Gasto mensual"
          value={formatCurrency(monthly)}
          detail="Gastos registrados este mes."
        />
        <FinanceMetricCard
          icon={CalendarClock}
          label="Última actualización"
          value={lastDate}
          detail={`${expenses.length} movimientos registrados.`}
          tone="blue"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <CardTitle>Todos los gastos</CardTitle>
            <CardDescription>
              Los recurrentes están señalados claramente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Frecuencia</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="w-[90px] text-right">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium">{row.label}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {EXPENSE_CATEGORY_LABELS[row.category] || row.category}
                      </TableCell>
                      <TableCell>
                        <Badge variant={row.recurring ? "warning" : "outline"}>
                          {row.recurring ? "Recurrente" : "Único"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.date}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                        {formatCurrency(row.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <CrudRowActions
                          itemLabel={row.label}
                          onEdit={() => setEditing(row)}
                          onDelete={() => setDeleting(row)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No hay gastos todavía. Agrega el primero desde el formulario.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Agregar gasto</CardTitle>
            <CardDescription>
              Captura una salida nueva y marca si se repite.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-3" onSubmit={addExpense}>
              <div className="space-y-2">
                <Label htmlFor="expense-label">Concepto</Label>
                <Input
                  id="expense-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ej. Supermercado"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-category">Categoría</Label>
                <select
                  id="expense-category"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {EXPENSE_CATEGORY_LABELS[item]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Monto (MXN)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-date">Fecha</Label>
                <Input
                  id="expense-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="expense-recurring">Gasto recurrente</Label>
                  <p className="text-xs text-muted-foreground">
                    Se repite cada mes.
                  </p>
                </div>
                <Switch
                  id="expense-recurring"
                  checked={recurring}
                  onCheckedChange={setRecurring}
                />
              </div>
              <Button type="submit" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Guardar gasto
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <PrototypeFormDialog
        open={Boolean(editing)}
        onOpenChange={(open) => !open && setEditing(null)}
        title="Editar gasto"
        fields={[
          {
            id: "label",
            label: "Concepto",
            defaultValue: editing?.label,
            required: true,
          },
          {
            id: "category",
            label: "Categoría",
            type: "select",
            defaultValue: editing?.category,
            options: categories.map((item) => ({
              value: item,
              label: EXPENSE_CATEGORY_LABELS[item],
            })),
          },
          {
            id: "amount",
            label: "Monto",
            type: "number",
            defaultValue: editing?.amount,
            min: "0",
            step: "0.01",
            required: true,
          },
          {
            id: "date",
            label: "Fecha",
            type: "date",
            defaultValue: editing?.date,
            required: true,
          },
          {
            id: "recurring",
            label: "Gasto recurrente",
            type: "switch",
            defaultValue: editing?.recurring,
          },
        ]}
        submitLabel="Guardar cambios"
        onSubmit={handleEdit}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="¿Eliminar gasto?"
        description={deleting?.label}
        confirmLabel="Eliminar"
        destructive
        onConfirm={handleDelete}
      />
      <SuccessDialog
        open={Boolean(success)}
        onOpenChange={(open) => !open && setSuccess(null)}
        title={success?.title}
        description={success?.description}
      />
    </div>
  );
}
