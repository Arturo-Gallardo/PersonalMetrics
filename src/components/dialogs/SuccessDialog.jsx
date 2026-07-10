import { CheckCircle2 } from "lucide-react";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog";

export function SuccessDialog({
  open,
  onOpenChange,
  title = "Listo",
  description = "La operación se completó correctamente.",
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary sm:mx-0">
            <CheckCircle2 className="h-6 w-6" aria-hidden />
          </div>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
