import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";

/**
 * Generic yes/no prompt — confirm handler is optional for prototype shells.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title = "¿Confirmar acción?",
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  destructive = false,
}) {
  function handleConfirm() {
    onConfirm?.();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
