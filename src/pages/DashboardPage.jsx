import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gem, Plus, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "components/ui/table";
import { useTheme } from "context/ThemeContext";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUserFinanceData } from "hooks/useUserFinanceData";
import { formatCurrency } from "lib/format";
import {
  chart,
  chartAxisColor,
  chartContrastColor,
  chartGridColor,
} from "lib/theme";
import {
  buildExpenseBreakdown,
  buildMonthlyTrend,
  currentMonthKey,
  sumBy,
} from "lib/finance";

function KpiCard({ title, value, hint }) {
  return (
    <Card>
      <CardHeader className="space-y-1 pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl tabular-nums text-primary">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {hint}
      </CardContent>
    </Card>
  );
}

function EmptyPanel({ title, text, to, action }) {
  return (
    <div className="rounded-lg border border-dashed p-6 text-center">
      <p className="font-medium">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        {text}
      </p>
      <Button asChild className="mt-4" size="sm">
        <Link to={to}>
          <Plus className="mr-2 h-4 w-4" />
          {action}
        </Link>
      </Button>
    </div>
  );
}

export default function DashboardPage() {
  useDocumentTitle("Resumen");
  const { isDark } = useTheme();
  const { income, expenses, assets, loading } = useUserFinanceData();
  const axisColor = chartAxisColor(isDark);
  const contrastColor = chartContrastColor(isDark);
  const gridColor = chartGridColor(isDark);
  const month = currentMonthKey();

  const monthlyIncome = sumBy(
    income.filter((item) => item.date?.startsWith(month)),
    (item) => item.amount,
  );

  const monthlyExpenses = sumBy(
    expenses.filter((item) => item.date?.startsWith(month)),
    (item) => item.amount,
  );

  const balance = monthlyIncome - monthlyExpenses;

  const netWorth = sumBy(assets, (item) => item.current);
  const trend = buildMonthlyTrend(income, expenses);
  const spending = buildExpenseBreakdown(
    expenses.filter((item) => item.date?.startsWith(month)),
  );
  const recurringPayments = expenses
    .filter((item) => item.recurring)
    .slice(0, 5);
  const hasData = income.length || expenses.length || assets.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Resumen financiero
        </h1>
        <p className="text-sm text-muted-foreground">
          Tu dinero, tus gastos y el valor de lo que tienes, en un solo lugar.
        </p>
      </div>

      {!loading && !hasData ? (
        <EmptyPanel
          title="Tu tablero está listo"
          text="Agrega tu primer ingreso, gasto o activo para ver métricas reales en este resumen."
          to="/app/income"
          action="Agregar ingreso"
        />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Saldo del mes"
          value={formatCurrency(balance)}
          hint="Ingresos menos gastos registrados este mes."
        />
        <KpiCard
          title="Ingresos del mes"
          value={formatCurrency(monthlyIncome)}
          hint="Todo lo que recibiste este mes."
        />
        <KpiCard
          title="Gastos del mes"
          value={formatCurrency(monthlyExpenses)}
          hint="Salidas registradas este mes."
        />
        <KpiCard
          title="Patrimonio neto"
          value={formatCurrency(netWorth)}
          hint="Valor total de tus activos."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Ingresos y gastos</CardTitle>
            <CardDescription>
              Tu flujo de dinero durante los últimos seis meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 min-w-0">
            {trend.some((item) => item.income || item.expenses) ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <AreaChart
                  data={trend}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chart.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={chart.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                  <YAxis
                    stroke={axisColor}
                    fontSize={12}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Ingresos"
                    stroke={chart.primary}
                    fill="url(#incomeFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Gastos"
                    stroke={contrastColor}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyPanel
                title="Sin historial"
                text="Agrega ingresos y gastos para generar esta gráfica."
                to="/app/income"
                action="Capturar datos"
              />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>En qué gastas</CardTitle>
            <CardDescription>
              Distribución de tus gastos de este mes.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-72 min-w-0">
            {spending.length ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <PieChart>
                  <Pie
                    data={spending}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={82}
                    paddingAngle={2}
                  >
                    {spending.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyPanel
                title="Sin gastos este mes"
                text="Agrega gastos para ver su distribución."
                to="/app/expenses"
                action="Agregar gasto"
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activos</CardTitle>
            <CardDescription>
              Bienes e inversiones que forman parte de tu patrimonio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {assets.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activo</TableHead>
                    <TableHead className="text-right">Valor actual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.slice(0, 5).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="rounded-md bg-primary/10 p-2 text-primary">
                            <Gem className="h-4 w-4" />
                          </span>
                          <span>
                            <span className="block font-medium">
                              {item.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums text-primary">
                        {formatCurrency(item.current)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyPanel
                title="Sin activos"
                text="Registra bienes e inversiones para calcular patrimonio."
                to="/app/assets"
                action="Agregar activo"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagos recurrentes</CardTitle>
            <CardDescription>
              Gastos que se repiten y debes tener presentes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recurringPayments.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pago</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recurringPayments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3 font-medium">
                          <span className="rounded-md bg-primary/10 p-2 text-primary">
                            <WalletCards className="h-4 w-4" />
                          </span>
                          {item.label}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.date}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <EmptyPanel
                title="Sin pagos recurrentes"
                text="Marca gastos recurrentes para verlos aquí."
                to="/app/expenses"
                action="Agregar gasto"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
