import * as React from "react";
import { Gem, Plus } from "lucide-react";
import { CrudRowActions } from "components/crud/CrudRowActions";
import { Button } from "components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { ConfirmDialog } from "components/dialogs/ConfirmDialog";
import { PrototypeFormDialog } from "components/dialogs/PrototypeFormDialog";
import { SuccessDialog } from "components/dialogs/SuccessDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/ui/table";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUserFinanceData } from "hooks/useUserFinanceData";
import { ASSET_CATEGORY_LABELS, sumBy } from "lib/finance";
import { formatCurrency } from "lib/format";

const categories = Object.keys(ASSET_CATEGORY_LABELS);

export default function AssetsPage() {
  useDocumentTitle("Activos");
  const { assets, createItem, updateItem, deleteItem, createSystemAlert } = useUserFinanceData();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState(categories[0]);
  const [value, setValue] = React.useState("");
  const [editing, setEditing] = React.useState(null);
  const [deleting, setDeleting] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [error, setError] = React.useState("");
  const total = sumBy(assets, (item) => item.current);

  async function addAsset(event) {
    event.preventDefault();
    if (!name.trim() || !value) return;
    try {
      const assetName = name.trim();
      const assetValue = Number(value);
      await createItem("assets", { name: assetName, description: description.trim(), category, current: assetValue });
      await createSystemAlert({
        type: "asset",
        severity: "info",
        message: `Se agregó activo ${assetName} con valor de ${formatCurrency(assetValue)}.`,
      });
      setName(""); setDescription(""); setCategory(categories[0]); setValue("");
      setSuccess({ title: "Activo registrado", description: "El activo se guardó en Firestore." });
    } catch (err) { setError(err.message || "No se pudo guardar el activo."); }
  }

  async function handleEdit(values) {
    if (!editing) return;
    try {
      const nextName = values.name || editing.name;
      const nextValue = Number(values.current || editing.current);
      await updateItem("assets", editing.id, { name: nextName, description: values.description || "", category: values.category || editing.category, current: nextValue });
      if (nextValue !== Number(editing.current)) {
        await createSystemAlert({
          type: "asset",
          severity: "warning",
          message: `Valor de ${nextName} actualizado de ${formatCurrency(editing.current)} a ${formatCurrency(nextValue)}.`,
        });
      }
      setSuccess({ title: "Activo actualizado", description: "Los cambios se guardaron." });
    } catch (err) { setError(err.message || "No se pudo actualizar el activo."); }
  }

  async function handleDelete() {
    if (!deleting) return;
    try { await deleteItem("assets", deleting.id); setSuccess({ title: "Activo eliminado", description: "El activo se eliminó." }); }
    catch (err) { setError(err.message || "No se pudo eliminar el activo."); }
  }

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-semibold tracking-tight">Activos</h1><p className="text-sm text-muted-foreground">Registra bienes e inversiones que forman parte de tu patrimonio.</p></div>
      {error ? <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div> : null}
      <div className="grid gap-4 md:grid-cols-3"><Card><CardHeader><CardDescription>Patrimonio registrado</CardDescription><CardTitle className="text-2xl text-primary">{formatCurrency(total)}</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground">Suma del valor actual de tus activos.</CardContent></Card><Card><CardHeader><CardDescription>Activos</CardDescription><CardTitle className="text-2xl text-primary">{assets.length}</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground">Registros guardados.</CardContent></Card><Card><CardHeader><CardDescription>Promedio por activo</CardDescription><CardTitle className="text-2xl text-primary">{formatCurrency(assets.length ? total / assets.length : 0)}</CardTitle></CardHeader><CardContent className="text-xs text-muted-foreground">Valor promedio registrado.</CardContent></Card></div>
      <div className="grid gap-4 lg:grid-cols-3"><Card className="min-w-0 lg:col-span-2"><CardHeader><CardTitle>Lista de activos</CardTitle><CardDescription>Valor actual de bienes e inversiones.</CardDescription></CardHeader><CardContent>{assets.length ? <Table><TableHeader><TableRow><TableHead>Activo</TableHead><TableHead>Categoría</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="w-[90px] text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{assets.map((item) => <TableRow key={item.id}><TableCell><div className="flex items-center gap-3"><span className="rounded-md bg-primary/10 p-2 text-primary"><Gem className="h-4 w-4" /></span><span><span className="block font-medium">{item.name}</span><span className="text-xs text-muted-foreground">{item.description || "Sin descripción"}</span></span></div></TableCell><TableCell className="text-muted-foreground">{ASSET_CATEGORY_LABELS[item.category] || item.category}</TableCell><TableCell className="text-right font-semibold tabular-nums text-primary">{formatCurrency(item.current)}</TableCell><TableCell className="text-right"><CrudRowActions itemLabel={item.name} onEdit={() => setEditing(item)} onDelete={() => setDeleting(item)} /></TableCell></TableRow>)}</TableBody></Table> : <p className="py-10 text-center text-sm text-muted-foreground">No hay activos todavía. Agrega bienes o inversiones desde el formulario.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Agregar activo</CardTitle><CardDescription>Guarda un bien o inversión.</CardDescription></CardHeader><CardContent><form className="space-y-3" onSubmit={addAsset}><div className="space-y-2"><Label htmlFor="asset-name">Nombre</Label><Input id="asset-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Fondo de inversión" /></div><div className="space-y-2"><Label htmlFor="asset-description">Descripción</Label><Input id="asset-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej. S&P 500" /></div><div className="space-y-2"><Label htmlFor="asset-category">Categoría</Label><select id="asset-category" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item} value={item}>{ASSET_CATEGORY_LABELS[item]}</option>)}</select></div><div className="space-y-2"><Label htmlFor="asset-value">Valor actual (MXN)</Label><Input id="asset-value" type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} /></div><Button type="submit" className="w-full gap-2"><Plus className="h-4 w-4" />Guardar activo</Button></form></CardContent></Card></div>
      <PrototypeFormDialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)} title="Editar activo" fields={[{ id: "name", label: "Nombre", defaultValue: editing?.name, required: true }, { id: "category", label: "Categoría", type: "select", defaultValue: editing?.category, options: categories.map((item) => ({ value: item, label: ASSET_CATEGORY_LABELS[item] })) }, { id: "current", label: "Valor actual", type: "number", defaultValue: editing?.current, min: "0", step: "0.01", required: true }, { id: "description", label: "Descripción", defaultValue: editing?.description, fullWidth: true }]} submitLabel="Guardar cambios" onSubmit={handleEdit} />
      <ConfirmDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)} title="¿Eliminar activo?" description={deleting?.name} confirmLabel="Eliminar" destructive onConfirm={handleDelete} />
      <SuccessDialog open={Boolean(success)} onOpenChange={(open) => !open && setSuccess(null)} title={success?.title} description={success?.description} />
    </div>
  );
}
