import { Plus } from "lucide-react";
import { Button } from "components/ui/button";

/**
 * Footer actions for cards that are not tabular rows (KPI blocks, narrative cards).
 */
export function CrudCardActions({
  showAdd = true,
  addLabel = "Agregar",
  onAdd,
  onEdit,
  onDelete,
  className,
}) {
  const noop = () => {};
  return (
    <div
      className={`mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4 ${className || ""}`}
    >
      {showAdd ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => (onAdd ?? noop)()}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          {addLabel}
        </Button>
      ) : null}
      <Button type="button" variant="outline" size="sm" onClick={() => (onEdit ?? noop)()}>
        Editar
      </Button>
      <Button type="button" variant="destructive" size="sm" onClick={() => (onDelete ?? noop)()}>
        Eliminar
      </Button>
    </div>
  );
}
