import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PiggyBank, TrendingDown, TrendingUp } from "lucide-react";
import { FinanceMetricCard } from "components/finance/FinanceMetricCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { useTheme } from "context/ThemeContext";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUserFinanceData } from "hooks/useUserFinanceData";
import { buildForecast, buildMonthlyTrend } from "lib/finance";
import { formatCurrency } from "lib/format";
import { chartAxisColor, chartGridColor } from "lib/theme";

const ChangeValue = ({ value, reverse = false }) => {
  const isGood = reverse ? value <= 0 : value >= 0;
  const color = isGood ? "text-emerald-600 dark:text-emerald-400" : "text-destructive";
  return <p className={`font-medium tabular-nums ${color}`}>{value > 0 ? "+" : ""}{value}%</p>;
};

function changePercent(current, previous) {
  if (!previous) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default function ForecastPage() {
  useDocumentTitle("Pronóstico");
  const { isDark } = useTheme();
  const { income, expenses } = useUserFinanceData();
  const axisColor = chartAxisColor(isDark);
  const gridColor = chartGridColor(isDark);
  const history = buildMonthlyTrend(income, expenses, 4);
  const forecast = buildForecast(income, expenses);
  const projection = [
    ...history.map((item) => ({ month: item.month, income: item.income, expenses: item.expenses })),
    ...forecast.map((item) => ({ month: item.month, incomeForecast: item.incomeForecast, expenseForecast: item.expenseForecast })),
  ];
  const last = forecast.at(-1) || { incomeForecast: 0, expenseForecast: 0, savings: 0 };
  const rows = forecast.map((item, index) => {
    const previous = index === 0
      ? { incomeForecast: history.at(-1)?.income || 0, expenseForecast: history.at(-1)?.expenses || 0, savings: (history.at(-1)?.income || 0) - (history.at(-1)?.expenses || 0) }
      : forecast[index - 1];
    return {
      ...item,
      incomeChange: changePercent(item.incomeForecast, previous.incomeForecast),
      expenseChange: changePercent(item.expenseForecast, previous.expenseForecast),
      savingsChange: changePercent(item.savings, previous.savings),
    };
  });
  const hasHistory = income.length || expenses.length;

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-semibold tracking-tight">Pronóstico personal</h1><p className="text-sm text-muted-foreground">Una estimación determinística de tus ingresos, gastos y ahorro para los próximos cuatro meses.</p></div>
      {!hasHistory ? <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Agrega ingresos y gastos para generar un pronóstico útil. Mientras tanto, los valores permanecen en cero.</div> : null}
      <div className="grid gap-4 md:grid-cols-3"><FinanceMetricCard icon={TrendingUp} label="Ingresos estimados" value={formatCurrency(last.incomeForecast)} detail="Basado en ingresos recientes." /><FinanceMetricCard icon={TrendingDown} label="Gastos estimados" value={formatCurrency(last.expenseForecast)} detail="Basado en gastos recientes." tone="amber" /><FinanceMetricCard icon={PiggyBank} label="Ahorro estimado" value={formatCurrency(last.savings)} detail="Ingresos menos gastos proyectados." tone="blue" /></div>
      <Card><CardHeader><CardTitle>Perspectiva de tu dinero</CardTitle><CardDescription>Líneas sólidas para meses registrados y punteadas para la proyección.</CardDescription></CardHeader><CardContent className="h-80 min-w-0">{hasHistory ? <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}><LineChart data={projection} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke={gridColor} /><XAxis dataKey="month" stroke={axisColor} fontSize={12} /><YAxis stroke={axisColor} fontSize={12} tickFormatter={(value) => `${Math.round(value / 1000)}k`} /><Tooltip formatter={(value) => formatCurrency(value)} /><Legend /><Line type="monotone" dataKey="income" name="Ingresos registrados" stroke="#16855b" strokeWidth={3} dot={{ fill: "#16855b" }} connectNulls={false} /><Line type="monotone" dataKey="expenses" name="Gastos registrados" stroke="#d97706" strokeWidth={3} dot={{ fill: "#d97706" }} connectNulls={false} /><Line type="monotone" dataKey="incomeForecast" name="Ingresos proyectados" stroke="#16855b" strokeDasharray="6 5" strokeWidth={2} dot={{ fill: "#16855b" }} /><Line type="monotone" dataKey="expenseForecast" name="Gastos proyectados" stroke="#d97706" strokeDasharray="6 5" strokeWidth={2} dot={{ fill: "#d97706" }} /></LineChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center rounded-lg border border-dashed text-center text-sm text-muted-foreground">Agrega ingresos y gastos para ver la gráfica de pronóstico.</div>}</CardContent></Card>
      <Card><CardHeader><CardTitle>Próximos meses</CardTitle><CardDescription>Cuánto podrían cambiar tus ingresos, gastos y ahorro contra el mes anterior.</CardDescription></CardHeader><CardContent className="space-y-2"><div className="hidden grid-cols-7 gap-4 px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid"><span>Mes</span><span>Ingresos</span><span>Cambio</span><span>Gastos</span><span>Cambio</span><span>Ahorro</span><span>Cambio</span></div>{rows.map((row) => <div key={row.month} className="grid gap-3 rounded-lg border-l-4 border-l-primary bg-muted/20 p-4 lg:grid-cols-7 lg:items-center"><p className="font-semibold">{row.month}</p><div><span className="text-xs text-muted-foreground lg:hidden">Ingresos</span><p className="font-medium tabular-nums text-primary">{formatCurrency(row.incomeForecast)}</p></div><div><span className="text-xs text-muted-foreground lg:hidden">Cambio ingresos</span><ChangeValue value={row.incomeChange} /></div><div><span className="text-xs text-muted-foreground lg:hidden">Gastos</span><p className="font-medium tabular-nums text-amber-600 dark:text-amber-400">{formatCurrency(row.expenseForecast)}</p></div><div><span className="text-xs text-muted-foreground lg:hidden">Cambio gastos</span><ChangeValue value={row.expenseChange} reverse /></div><div><span className="text-xs text-muted-foreground lg:hidden">Ahorro</span><p className="font-semibold tabular-nums text-sky-600 dark:text-sky-400">{formatCurrency(row.savings)}</p></div><div><span className="text-xs text-muted-foreground lg:hidden">Cambio ahorro</span><ChangeValue value={row.savingsChange} /></div></div>)}</CardContent></Card>
    </div>
  );
}
