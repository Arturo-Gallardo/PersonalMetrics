import * as React from "react";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function resolvedType(field) {
  if (field.type) return field.type;
  if (/date|due|expires|effective/i.test(field.id)) return "date";
  if (/phone/i.test(field.id)) return "tel";
  if (/url|webhook/i.test(field.id)) return "url";
  return "text";
}

function FieldControl({ field, value, onChange }) {
  if (field.type === "switch") {
    return (
      <div className="flex items-center justify-between rounded-md border p-3">
        <div>
          <Label htmlFor={field.id}>{field.label}</Label>
          {field.helperText ? (
            <p className="text-xs text-muted-foreground">{field.helperText}</p>
          ) : null}
        </div>
        <Switch
          id={field.id}
          checked={Boolean(value)}
          onCheckedChange={onChange}
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        id={field.id}
        className={`${selectClassName} min-h-[80px] py-2`}
        placeholder={field.placeholder}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        id={field.id}
        className={selectClassName}
        required={field.required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {!field.defaultValue ? <option value="">Selecciona una opción</option> : null}
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  const input = (
    <Input
      id={field.id}
      type={resolvedType(field)}
      placeholder={field.placeholder}
      min={field.min}
      max={field.max}
      step={field.step}
      required={field.required}
      autoComplete={field.autoComplete}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  if (!field.prefix && !field.suffix) return input;

  return (
    <div className="flex items-center rounded-md border border-input bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring">
      {field.prefix ? (
        <span className="pl-3 text-sm text-muted-foreground">{field.prefix}</span>
      ) : null}
      {React.cloneElement(input, {
        className: "border-0 bg-transparent shadow-none focus-visible:ring-0",
      })}
      {field.suffix ? (
        <span className="pr-3 text-sm text-muted-foreground">{field.suffix}</span>
      ) : null}
    </div>
  );
}

/**
 * Form shell for add/edit flows — submit closes the dialog without saving.
 */
export function PrototypeFormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields = [],
  submitLabel = "Guardar",
  onSubmit,
}) {
  const [values, setValues] = React.useState({});

  React.useEffect(() => {
    if (!open) return;
    const next = {};
    fields.forEach((field) => {
      next[field.id] = field.defaultValue ?? "";
    });
    setValues(next);
  }, [open, fields]);

  function handleChange(id, value) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit?.(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className={description ? undefined : "sr-only"}>
            {description || "Formulario de edición"}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.id}
              className={`space-y-2 ${field.fullWidth || field.type === "textarea" ? "sm:col-span-2" : ""}`}
            >
              {field.hideLabel ? null : (
                <Label htmlFor={field.id}>
                  {field.label}
                  {field.required ? <span className="ml-1 text-destructive">*</span> : null}
                </Label>
              )}
              <FieldControl
                field={field}
                value={values[field.id] ?? ""}
                onChange={(v) => handleChange(field.id, v)}
              />
              {field.helperText && field.type !== "switch" ? (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {field.helperText}
                </p>
              ) : null}
            </div>
          ))}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
