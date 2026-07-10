import { Card, CardContent, CardHeader } from "components/ui/card";
import { cn } from "lib/utils";

const tones = {
  green: "bg-primary/10 text-primary",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
};

export function FinanceMetricCard({ icon: Icon, label, value, detail, tone = "green" }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
        <span className={cn("rounded-lg p-2.5", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="truncate text-2xl font-bold tabular-nums text-foreground">{value}</p>
        </div>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{detail}</CardContent>
    </Card>
  );
}
