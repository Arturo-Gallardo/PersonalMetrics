import { Moon, Sun } from "lucide-react";
import { useTheme } from "context/ThemeContext";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "components/ui/tooltip";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-muted-foreground" aria-hidden />
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Switch
              id="theme-switch"
              checked={isDark}
              onCheckedChange={() => toggleTheme()}
              aria-label="Alternar modo oscuro"
            />
            <Label htmlFor="theme-switch" className="sr-only">
              Modo oscuro
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        </TooltipContent>
      </Tooltip>
      <Moon className="h-4 w-4 text-muted-foreground" aria-hidden />
    </div>
  );
}
