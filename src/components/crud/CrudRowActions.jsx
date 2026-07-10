import { Pencil, Trash2 } from "lucide-react";
import { Button } from "components/ui/button";

/**
 * Per-row edit/delete controls. Handlers are optional; default is no-op until wired.
 */
export function CrudRowActions({
  itemLabel = "fila",
  onEdit,
  onDelete,
  className,
}) {
  return (
    <div className={`flex items-center justify-end gap-0.5 ${className || ""}`}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onEdit ?? (() => {})}
        aria-label={`Editar ${itemLabel}`}
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onDelete ?? (() => {})}
        aria-label={`Eliminar ${itemLabel}`}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </Button>
    </div>
  );
}
