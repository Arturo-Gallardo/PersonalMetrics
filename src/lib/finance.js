export const EXPENSE_CATEGORY_LABELS = {
  housing: "Vivienda",
  food: "Alimentos",
  transport: "Transporte",
  utilities: "Servicios",
  health: "Salud",
  subscriptions: "Suscripciones",
  other: "Otro",
};

export const INCOME_CATEGORY_LABELS = {
  salary: "Sueldo",
  freelance: "Trabajo independiente",
  investment: "Rendimientos",
  sale: "Venta de artÃ­culos",
  other: "Otro ingreso",
};

export const ASSET_CATEGORY_LABELS = {
  vehicle: "VehÃ­culo",
  technology: "TecnologÃ­a",
  investment: "InversiÃ³n",
  property: "Inmueble",
  collectible: "Coleccionable",
  other: "Otro",
};

export const ALERT_TYPE_LABELS = {
  income: "Ingreso",
  expense: "Gasto",
  recurring: "Recurrente",
  budget: "Presupuesto",
  balance: "Balance",
  savings: "Ahorro",
  asset: "Activo",
  forecast: "Pronóstico",
  summary: "Resumen",
};

export const ALERT_SEVERITY_LABELS = {
  info: "InformaciÃ³n",
  warning: "Advertencia",
  critical: "CrÃ­tica",
};

export function sumBy(items, getValue) {
  return items.reduce((sum, item) => sum + Number(getValue(item) || 0), 0);
}

export function currentMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function monthLabel(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat("es-MX", { month: "short" }).format(new Date(year, month - 1, 1));
}

export function toMonthKey(date) {
  return String(date || "").slice(0, 7);
}

export function buildMonthlyTrend(income, expenses, monthCount = 6) {
  const totals = new Map();
  const now = new Date();

  for (let index = monthCount - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    const key = currentMonthKey(date);
    totals.set(key, { month: monthLabel(key), income: 0, expenses: 0, key });
  }

  income.forEach((item) => {
    const key = toMonthKey(item.date);
    if (totals.has(key)) totals.get(key).income += Number(item.amount || 0);
  });

  expenses.forEach((item) => {
    const key = toMonthKey(item.date);
    if (totals.has(key)) totals.get(key).expenses += Number(item.amount || 0);
  });

  return Array.from(totals.values());
}

export function buildExpenseBreakdown(expenses) {
  const byCategory = new Map();
  expenses.forEach((item) => {
    const key = item.category || "other";
    byCategory.set(key, (byCategory.get(key) || 0) + Number(item.amount || 0));
  });

  const colors = ["#075c3b", "#3f9567", "#78bd8e", "#b6d9bd", "#6b7378", "#d97706", "#dc2626"];
  return Array.from(byCategory.entries()).map(([category, value], index) => ({
    name: EXPENSE_CATEGORY_LABELS[category] || category,
    value,
    color: colors[index % colors.length],
  }));
}

export function buildForecast(income, expenses) {
  const trend = buildMonthlyTrend(income, expenses, 4);
  const lastIncome = trend.at(-1)?.income || 0;
  const lastExpenses = trend.at(-1)?.expenses || 0;
  const incomeGrowth = 0.03;
  const expenseGrowth = 0.02;
  const now = new Date();

  return Array.from({ length: 4 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index + 1, 1);
    const incomeForecast = Math.round(lastIncome * (1 + incomeGrowth * (index + 1)));
    const expenseForecast = Math.round(lastExpenses * (1 + expenseGrowth * (index + 1)));
    return {
      month: monthLabel(currentMonthKey(date)),
      incomeForecast,
      expenseForecast,
      savings: incomeForecast - expenseForecast,
    };
  });
}

