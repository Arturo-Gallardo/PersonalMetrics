import { Plus } from "lucide-react";
import { Button } from "components/ui/button";

/**
 * Primary “add” control for lists and sections. Wire `onAdd` when the API exists.
 */
export function CrudAddButton({
  children = "Agregar",
  onAdd,
  size = "sm",
  className,
  variant = "default",
}) {
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={`shrink-0 gap-1.5 ${className || ""}`}
      onClick={onAdd ?? (() => {})}
    >
      <Plus className="h-4 w-4" aria-hidden />
      {children}
    </Button>
  );
}
