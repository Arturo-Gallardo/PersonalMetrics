import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";

/** Simple informational prompt (e.g. forgot password, demo notices). */
export function InfoDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = "Cerrar",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
