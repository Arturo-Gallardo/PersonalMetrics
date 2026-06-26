import { expenseCategories } from "data/mockData";
import { EXPENSE_CATEGORY_LABELS, ROLE_LABELS } from "lib/app";

const MONTHS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
].map((m) => ({ value: m, label: m }));

const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const EXPENSE_CATEGORY_OPTIONS = expenseCategories.map((c) => ({
  value: c,
  label: EXPENSE_CATEGORY_LABELS[c] ?? c,
}));

function deleteSuccess(itemLabel, entity = "registro") {
  return {
    title: "Eliminado",
    description: `${itemLabel} se eliminó de ${entity}.`,
  };
}

function editSuccess(itemLabel) {
  return {
    title: "Cambios guardados",
    description: `${itemLabel} se actualizó correctamente.`,
  };
}

/** Field sets and copy keyed by UI context — each action gets its own form. */
export const FORM_SCHEMAS = {
  income: {
    add: {
      title: "Registrar ingreso",
      description: "Captura sueldo, trabajo independiente u otra entrada personal.",
      fields: [
        { id: "label", label: "Concepto", placeholder: "Concepto ejemplo", fullWidth: true },
        {
          id: "channel",
          label: "Categoría",
          type: "select",
          defaultValue: "DINE_IN",
          options: [
            { value: "DINE_IN", label: "Sueldo" },
            { value: "TAKEOUT", label: "Trabajo independiente" },
            { value: "DELIVERY", label: "Rendimientos" },
            { value: "CATERING", label: "Venta de artículos" },
            { value: "OTHER", label: "Otro ingreso" },
          ],
        },
        { id: "amount", label: "Monto (USD)", type: "number", min: "0", step: "0.01" },
        { id: "date", label: "Fecha del ingreso", type: "date" },
      ],
      submitLabel: "Guardar cambios",
      success: {
        title: "Ingreso registrado",
        description: "El ingreso se ha registrado y ya forma parte de los cálculos financieros.",
      },
    },
    edit: (itemLabel) => ({
      title: "Editar ingreso",
      description: "Corrige los datos usados.",
      fields: [
        { id: "label", label: "Concepto", defaultValue: itemLabel },
        {
          id: "channel",
          label: "Categoría",
          type: "select",
          options: [
            { value: "DINE_IN", label: "Sueldo" },
            { value: "TAKEOUT", label: "Trabajo independiente" },
            { value: "DELIVERY", label: "Rendimientos" },
            { value: "CATERING", label: "Venta de artículos" },
            { value: "OTHER", label: "Otro ingreso" },
          ],
        },
        { id: "amount", label: "Monto (USD)", type: "number", min: "0", step: "0.01" },
        { id: "date", label: "Fecha del ingreso", type: "date" },
      ],
      submitLabel: "Guardar cambios",
      success: {
        title: "Ingreso registrado",
        description: "El ingreso se ha registrado y ya forma parte de los cálculos financieros.",
      },
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ingreso ${itemLabel}?`,
      description: "Se quitará del resumen de ingresos mensual. Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar ingreso",
      success: {
        title: "Ingreso eliminado",
        description: "El ingreso se ha eliminado.",
      },
    }),
  },

  expense: {
    add: {
      title: "Registrar gasto",
      description: "Captura una salida nueva y marca si se repite.",
      fields: [
        { id: "label", label: "Concepto", placeholder: "Concepto ejemplo" },
        {
          id: "category",
          label: "Categoría",
          type: "select",
          defaultValue: expenseCategories[0],
          options: EXPENSE_CATEGORY_OPTIONS,
        },
        { id: "amount", label: "Monto (USD)", type: "number", min: "0", step: "0.01" },
        { id: "date", label: "Fecha del gasto", type: "date" },
        {
          id: "recurring",
          label: "Gasto recurrente",
          type: "switch",
          helperText: "Se repite cada mes.",
          fullWidth: true,
          hideLabel: true,
        },
      ],
      submitLabel: "Guardar cambios",
      success: {
        title: "Gasto registrado",
        description: "El gasto se ha registrado y ya forma parte de los cálculos financieros.",
      },
    },
    edit: (itemLabel) => ({
      title: "Editar gasto",
      description: "Corrige los datos usados.",
      fields: [
        { id: "label", label: "Concepto", defaultValue: itemLabel },
        {
          id: "category",
          label: "Categoría",
          type: "select",
          defaultValue: expenseCategories[0],
          options: EXPENSE_CATEGORY_OPTIONS,
        },
        { id: "amount", label: "Monto (USD)", type: "number", min: "0", step: "0.01" },
        { id: "date", label: "Fecha del gasto", type: "date" },
        {
          id: "recurring",
          label: "Gasto recurrente",
          type: "switch",
          helperText: "Se repite cada mes.",
          fullWidth: true,
          hideLabel: true,
        },
      ],
      submitLabel: "Guardar cambios",
      success: {
        title: "Gasto registrado",
        description: "El gasto se ha registrado y ya forma parte de los cálculos financieros.",
      },
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar gasto ${itemLabel}?`,
      description: "Se quitará del resumen de gastos mensuales. Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar gasto",
      success: {
        title: "Gasto eliminado",
        description: "El gasto se ha eliminado.",
      },
    }),
  },

  supplier: {
    add: {
      title: "Agregar proveedor",
      description: "Añade un contacto al directorio de proveedores.",
      fields: [
        { id: "name", label: "Nombre", placeholder: "Mariscos Costa" },
        { id: "products", label: "Productos", placeholder: "Mariscos, pescado fresco" },
        { id: "email", label: "Correo", type: "email", placeholder: "pedidos@mariscos.com" },
        { id: "phone", label: "Teléfono", placeholder: "+52 55 1234 5678" },
        { id: "paymentTerms", label: "Plazo de pago (días)", type: "number", min: "0", placeholder: "30" },
      ],
      submitLabel: "Guardar proveedor",
      success: {
        title: "Proveedor agregado",
        description: "Ya puedes registrar compras y pagos con este contacto.",
      },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Nombre", defaultValue: itemLabel },
        { id: "products", label: "Productos", placeholder: "Mariscos, pescado fresco" },
        { id: "email", label: "Correo", type: "email" },
        { id: "phone", label: "Teléfono" },
        { id: "paymentTerms", label: "Plazo de pago (días)", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar proveedor",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      description: "Se eliminará del directorio junto con su historial de contacto.",
      success: deleteSuccess(itemLabel, "proveedores"),
    }),
  },

  supplierActiveSummary: {
    edit: () => ({
      title: "Editar meta de proveedores",
      description: "Define cuántos proveedores activos quieres mantener.",
      fields: [
        { id: "targetCount", label: "Meta de proveedores activos", type: "number", min: "1" },
        { id: "notes", label: "Notas", type: "textarea", placeholder: "Ej. priorizar proveedores locales" },
      ],
      submitLabel: "Guardar meta",
      success: { title: "Meta actualizada", description: "El panel reflejará la nueva meta de proveedores." },
    }),
    delete: () => ({
      title: "¿Restablecer meta de proveedores?",
      description: "Volverás al valor calculado automáticamente.",
      confirmLabel: "Restablecer",
      success: { title: "Meta restablecida", description: "Se usa de nuevo el conteo automático." },
    }),
  },

  supplierPayableSummary: {
    edit: () => ({
      title: "Editar ventana de cuentas por pagar",
      fields: [
        { id: "periodDays", label: "Días a considerar", type: "number", min: "7", defaultValue: "30" },
        { id: "alertThreshold", label: "Alerta si supera (USD)", type: "number", min: "0", step: "100" },
      ],
      submitLabel: "Guardar configuración",
      success: { title: "Configuración guardada", description: "El total de cuentas por pagar usará estos parámetros." },
    }),
    delete: () => ({
      title: "¿Restablecer cuentas por pagar?",
      description: "Se volverá al cálculo estándar de 30 días.",
      confirmLabel: "Restablecer",
      success: { title: "Restablecido", description: "El panel muestra de nuevo el periodo de 30 días." },
    }),
  },

  supplierReminderSummary: {
    edit: () => ({
      title: "Editar recordatorios de reorden",
      fields: [
        { id: "lookaheadDays", label: "Anticipación (días)", type: "number", min: "1", defaultValue: "14" },
        { id: "minAlerts", label: "Mínimo de alertas visibles", type: "number", min: "1" },
      ],
      submitLabel: "Guardar reglas",
      success: { title: "Reglas guardadas", description: "Los recordatorios seguirán estos criterios." },
    }),
    delete: () => ({
      title: "¿Restablecer recordatorios?",
      description: "Se usarán las reglas heurísticas predeterminadas.",
      confirmLabel: "Restablecer",
      success: { title: "Restablecido", description: "Los recordatorios vuelven a la configuración base." },
    }),
  },

  inventoryIngredient: {
    add: {
      title: "Agregar ingrediente",
      description: "Registra stock, costo y fecha de caducidad.",
      fields: [
        { id: "name", label: "Nombre del ingrediente", placeholder: "Tomate cherry", fullWidth: true },
        { id: "quantity", label: "Existencia actual", type: "number", min: "0" },
        {
          id: "unit",
          label: "Unidad",
          type: "select",
          defaultValue: "kg",
          options: [
            { value: "kg", label: "Kilogramos (kg)" },
            { value: "g", label: "Gramos (g)" },
            { value: "L", label: "Litros (L)" },
            { value: "ml", label: "Mililitros (ml)" },
            { value: "pzas", label: "Piezas" },
            { value: "latas", label: "Latas" },
          ],
        },
        { id: "reorderAt", label: "Nivel mínimo", type: "number", min: "0" },
        { id: "unitCost", label: "Costo unitario (USD)", type: "number", min: "0", step: "0.01" },
        { id: "expiresOn", label: "Fecha de caducidad", type: "date" },
      ],
      submitLabel: "Guardar ingrediente",
      success: { title: "Ingrediente agregado", description: "Aparecerá en el registro y en las alertas de stock." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Nombre del ingrediente", defaultValue: itemLabel, fullWidth: true },
        { id: "quantity", label: "Existencia actual", type: "number", min: "0" },
        {
          id: "unit",
          label: "Unidad",
          type: "select",
          options: [
            { value: "kg", label: "Kilogramos (kg)" },
            { value: "g", label: "Gramos (g)" },
            { value: "L", label: "Litros (L)" },
            { value: "ml", label: "Mililitros (ml)" },
            { value: "pzas", label: "Piezas" },
            { value: "latas", label: "Latas" },
          ],
        },
        { id: "reorderAt", label: "Nivel mínimo", type: "number", min: "0" },
        { id: "unitCost", label: "Costo unitario (USD)", type: "number", min: "0", step: "0.01" },
        { id: "expiresOn", label: "Fecha de caducidad", type: "date" },
      ],
      submitLabel: "Actualizar ingrediente",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      description: "Se quitará del inventario y dejará de generar alertas.",
      success: deleteSuccess(itemLabel, "inventario"),
    }),
  },

  inventorySeries: {
    add: {
      title: "Agregar serie al gráfico",
      description: "Compara disponible vs. objetivo de reorden.",
      fields: [
        { id: "label", label: "Etiqueta", placeholder: "Tomate" },
        { id: "onHand", label: "Disponible", type: "number", min: "0" },
        { id: "par", label: "Reorden en", type: "number", min: "0" },
      ],
      submitLabel: "Agregar serie",
      success: { title: "Serie agregada", description: "El gráfico incluirá la nueva barra." },
    },
    edit: (itemLabel) => ({
      title: `Editar serie ${itemLabel}`,
      fields: [
        { id: "label", label: "Etiqueta", defaultValue: itemLabel },
        { id: "onHand", label: "Disponible", type: "number", min: "0" },
        { id: "par", label: "Reorden en", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar serie",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Quitar ${itemLabel} del gráfico?`,
      description: "La serie dejará de mostrarse en la comparativa.",
      success: deleteSuccess(itemLabel, "el gráfico"),
    }),
  },

  alert: {
    add: {
      title: "Nueva alerta",
      description: "Configura tipo, severidad y mensaje.",
      fields: [
        {
          id: "type",
          label: "Tipo",
          type: "select",
          defaultValue: "INVENTORY",
          options: [
            { value: "INVENTORY", label: "Inventario" },
            { value: "SUPPLIER", label: "Proveedor" },
            { value: "EXPENSE", label: "Gasto" },
            { value: "PROFIT", label: "Rentabilidad" },
          ],
        },
        {
          id: "severity",
          label: "Severidad",
          type: "select",
          defaultValue: "warning",
          options: [
            { value: "critical", label: "Crítico" },
            { value: "warning", label: "Advertencia" },
            { value: "info", label: "Información" },
          ],
        },
        { id: "message", label: "Mensaje", type: "textarea", placeholder: "Describe el riesgo o la acción sugerida" },
      ],
      submitLabel: "Crear alerta",
      success: { title: "Alerta creada", description: "Aparecerá en el flujo de alertas abiertas." },
    },
    edit: (itemLabel) => ({
      title: `Editar alerta — ${itemLabel}`,
      fields: [
        {
          id: "severity",
          label: "Severidad",
          type: "select",
          defaultValue: "warning",
          options: [
            { value: "critical", label: "Crítico" },
            { value: "warning", label: "Advertencia" },
            { value: "info", label: "Información" },
          ],
        },
        { id: "message", label: "Mensaje", type: "textarea" },
        {
          id: "status",
          label: "Estado",
          type: "select",
          defaultValue: "open",
          options: [
            { value: "open", label: "Abierta" },
            { value: "acknowledged", label: "Reconocida" },
            { value: "resolved", label: "Resuelta" },
          ],
        },
      ],
      submitLabel: "Actualizar alerta",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar alerta de ${itemLabel}?`,
      description: "Desaparecerá del flujo de alertas abiertas.",
      success: deleteSuccess(itemLabel, "alertas"),
    }),
  },

  dashboardKpi: {
    add: {
      title: "Agregar indicador",
      description: "Añade un KPI personalizado al panel.",
      fields: [
        { id: "title", label: "Nombre del indicador", placeholder: "Ticket promedio" },
        { id: "value", label: "Valor", placeholder: "$45.00" },
        { id: "hint", label: "Descripción breve", type: "textarea", placeholder: "Promedio por comanda en sala" },
      ],
      submitLabel: "Agregar indicador",
      success: { title: "Indicador agregado", description: "Ya se muestra en tu panel principal." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "title", label: "Nombre", defaultValue: itemLabel },
        { id: "value", label: "Valor", placeholder: "$0.00" },
        { id: "hint", label: "Descripción breve", type: "textarea" },
      ],
      submitLabel: "Guardar cambios",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      description: "El indicador dejará de mostrarse en el panel.",
      success: deleteSuccess(itemLabel, "el panel"),
    }),
  },

  dashboardMonth: {
    add: {
      title: "Agregar mes",
      description: "Ingresa ingresos y gastos para un nuevo mes.",
      fields: [
        { id: "month", label: "Mes", type: "select", defaultValue: "Jul", options: MONTHS },
        { id: "revenue", label: "Ingresos (USD)", type: "number", min: "0" },
        { id: "expenses", label: "Gastos (USD)", type: "number", min: "0" },
      ],
      submitLabel: "Agregar mes",
      success: { title: "Mes agregado", description: "La curva de ingresos vs. gastos se actualizó." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "month", label: "Mes", type: "select", options: MONTHS, defaultValue: itemLabel },
        { id: "revenue", label: "Ingresos (USD)", type: "number", min: "0" },
        { id: "expenses", label: "Gastos (USD)", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar mes",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar datos de ${itemLabel}?`,
      description: "Ese mes dejará de aparecer en el gráfico.",
      success: deleteSuccess(itemLabel, "el gráfico"),
    }),
  },

  dashboardCategory: {
    add: {
      title: "Agregar categoría de gasto",
      fields: [
        { id: "name", label: "Categoría", placeholder: "Marketing" },
        { id: "value", label: "Monto mensual (USD)", type: "number", min: "0" },
      ],
      submitLabel: "Agregar categoría",
      success: { title: "Categoría agregada", description: "Aparecerá en el desglose de gastos." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Categoría", defaultValue: itemLabel },
        { id: "value", label: "Monto mensual (USD)", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar categoría",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      description: "Se quitará del gráfico de distribución de gastos.",
      success: deleteSuccess(itemLabel, "gastos"),
    }),
  },

  dashboardInventoryAlert: {
    add: {
      title: "Agregar alerta de stock",
      fields: [
        { id: "item", label: "Artículo", placeholder: "Aceite de oliva" },
        { id: "qty", label: "En stock", type: "number", min: "0" },
        { id: "unit", label: "Unidad", placeholder: "L" },
        { id: "threshold", label: "Mínimo recomendado", type: "number", min: "0" },
      ],
      submitLabel: "Agregar alerta",
      success: { title: "Alerta agregada", description: "Se mostrará en productos por acabarse." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "item", label: "Artículo", defaultValue: itemLabel },
        { id: "qty", label: "En stock", type: "number", min: "0" },
        { id: "unit", label: "Unidad", placeholder: "kg" },
        { id: "threshold", label: "Mínimo recomendado", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar alerta",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar alerta de ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "alertas de stock"),
    }),
  },

  dashboardPaymentReminder: {
    add: {
      title: "Agregar recordatorio de pago",
      fields: [
        { id: "supplier", label: "Proveedor", placeholder: "Mariscos Costa" },
        { id: "due", label: "Fecha de vencimiento", placeholder: "2026-05-22" },
        { id: "amount", label: "Monto (MXN)", type: "number", min: "0", step: "0.01" },
      ],
      submitLabel: "Agregar recordatorio",
      success: { title: "Recordatorio agregado", description: "Aparecerá en pagos a proveedores." },
    },
    edit: (itemLabel) => ({
      title: `Editar pago — ${itemLabel}`,
      fields: [
        { id: "supplier", label: "Proveedor", defaultValue: itemLabel },
        { id: "due", label: "Fecha de vencimiento", placeholder: "2026-05-22" },
        { id: "amount", label: "Monto (MXN)", type: "number", min: "0", step: "0.01" },
      ],
      submitLabel: "Actualizar recordatorio",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar recordatorio de ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "recordatorios"),
    }),
  },

  breakEvenFixedCost: {
    add: {
      title: "Agregar costo fijo",
      fields: [
        { id: "name", label: "Concepto", placeholder: "Renta del local" },
        { id: "monthlyAmount", label: "Monto mensual (USD)", type: "number", min: "0" },
        { id: "category", label: "Categoría", placeholder: "Operación" },
      ],
      submitLabel: "Agregar costo",
      success: { title: "Costo fijo agregado", description: "Se incluirá en el cálculo de equilibrio." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Concepto", defaultValue: itemLabel },
        { id: "monthlyAmount", label: "Monto mensual (USD)", type: "number", min: "0" },
        { id: "category", label: "Categoría" },
      ],
      submitLabel: "Actualizar costo",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "costos fijos"),
    }),
  },

  breakEvenVariable: {
    add: {
      title: "Agregar factor variable",
      fields: [
        { id: "name", label: "Factor", placeholder: "Costo de alimentos" },
        { id: "percentage", label: "Porcentaje de ventas", type: "number", min: "0", max: "100", step: "0.1" },
      ],
      submitLabel: "Agregar factor",
      success: { title: "Factor agregado", description: "Afectará el ratio de costo variable." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Factor", defaultValue: itemLabel },
        { id: "percentage", label: "Porcentaje de ventas", type: "number", min: "0", max: "100", step: "0.1" },
      ],
      submitLabel: "Actualizar factor",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "factores variables"),
    }),
  },

  breakEvenRevenueRule: {
    add: {
      title: "Agregar regla de ingreso",
      fields: [
        { id: "name", label: "Nombre", placeholder: "Meta entre semana" },
        { id: "dailyTarget", label: "Ingreso diario objetivo (USD)", type: "number", min: "0" },
        { id: "notes", label: "Notas", type: "textarea" },
      ],
      submitLabel: "Agregar regla",
      success: { title: "Regla agregada", description: "Se usará para comparar contra ingresos reales." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Nombre", defaultValue: itemLabel },
        { id: "dailyTarget", label: "Ingreso diario objetivo (USD)", type: "number", min: "0" },
        { id: "notes", label: "Notas", type: "textarea" },
      ],
      submitLabel: "Actualizar regla",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "reglas de ingreso"),
    }),
  },

  breakEvenTicket: {
    add: {
      title: "Agregar nivel de ticket",
      fields: [
        { id: "label", label: "Segmento", placeholder: "Cena fin de semana" },
        { id: "avgTicket", label: "Ticket promedio (USD)", type: "number", min: "0", step: "0.01" },
        { id: "ordersPerDay", label: "Pedidos por día", type: "number", min: "0" },
      ],
      submitLabel: "Agregar nivel",
      success: { title: "Nivel agregado", description: "Se incluirá en el cálculo de pedidos necesarios." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "label", label: "Segmento", defaultValue: itemLabel },
        { id: "avgTicket", label: "Ticket promedio (USD)", type: "number", min: "0", step: "0.01" },
        { id: "ordersPerDay", label: "Pedidos por día", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar nivel",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "niveles de ticket"),
    }),
  },

  breakEvenWeek: {
    add: {
      title: "Agregar semana",
      fields: [
        { id: "label", label: "Etiqueta", placeholder: "Semana 24" },
        { id: "startDate", label: "Inicio", placeholder: "2026-06-02" },
        { id: "endDate", label: "Fin", placeholder: "2026-06-08" },
      ],
      submitLabel: "Agregar semana",
      success: { title: "Semana agregada", description: "Podrás registrar ingresos diarios para ese periodo." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "label", label: "Etiqueta", defaultValue: itemLabel },
        { id: "startDate", label: "Inicio", placeholder: "2026-06-02" },
        { id: "endDate", label: "Fin", placeholder: "2026-06-08" },
      ],
      submitLabel: "Actualizar semana",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "semanas"),
    }),
  },

  breakEvenChartPoint: {
    add: {
      title: "Agregar punto al gráfico",
      fields: [
        { id: "day", label: "Día", placeholder: "Lun" },
        { id: "revenue", label: "Ingresos reales (USD)", type: "number", min: "0" },
        { id: "target", label: "Línea de equilibrio (USD)", type: "number", min: "0" },
      ],
      submitLabel: "Agregar punto",
      success: { title: "Punto agregado", description: "El gráfico semanal se actualizó." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "day", label: "Día", defaultValue: itemLabel },
        { id: "revenue", label: "Ingresos reales (USD)", type: "number", min: "0" },
        { id: "target", label: "Línea de equilibrio (USD)", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar punto",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "el gráfico"),
    }),
  },

  forecastMonth: {
    add: {
      title: "Agregar mes de pronóstico",
      fields: [
        { id: "month", label: "Mes", type: "select", options: MONTHS, defaultValue: "Jul" },
        { id: "revenueForecast", label: "Ingresos proyectados (USD)", type: "number", min: "0" },
        { id: "expenseForecast", label: "Gastos proyectados (USD)", type: "number", min: "0" },
      ],
      submitLabel: "Agregar pronóstico",
      success: { title: "Pronóstico agregado", description: "La curva incluirá el nuevo mes proyectado." },
    },
    edit: (itemLabel) => ({
      title: `Editar pronóstico — ${itemLabel}`,
      fields: [
        { id: "month", label: "Mes", type: "select", options: MONTHS, defaultValue: itemLabel },
        { id: "revenueForecast", label: "Ingresos proyectados (USD)", type: "number", min: "0" },
        { id: "expenseForecast", label: "Gastos proyectados (USD)", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar pronóstico",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar pronóstico de ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "pronósticos"),
    }),
  },

  forecastScenario: {
    add: {
      title: "Agregar escenario",
      fields: [
        { id: "name", label: "Nombre del escenario", placeholder: "Temporada alta" },
        { id: "revenueAdjust", label: "Ajuste de ingresos (%)", type: "number", step: "1", placeholder: "10" },
        { id: "expenseAdjust", label: "Ajuste de gastos (%)", type: "number", step: "1", placeholder: "-5" },
        { id: "notes", label: "Supuestos", type: "textarea", placeholder: "Más turismo, mismo personal" },
      ],
      submitLabel: "Guardar escenario",
      success: { title: "Escenario guardado", description: "Podrás compararlo contra el pronóstico base." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Nombre", defaultValue: itemLabel },
        { id: "revenueAdjust", label: "Ajuste de ingresos (%)", type: "number", step: "1" },
        { id: "expenseAdjust", label: "Ajuste de gastos (%)", type: "number", step: "1" },
        { id: "notes", label: "Supuestos", type: "textarea" },
      ],
      submitLabel: "Actualizar escenario",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar escenario ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "escenarios"),
    }),
  },

  forecastUsageRule: {
    add: {
      title: "Agregar regla de uso",
      fields: [
        { id: "ingredient", label: "Ingrediente", placeholder: "Salmon" },
        { id: "leadDays", label: "Días de anticipación", type: "number", min: "1" },
        { id: "threshold", label: "Umbral de alerta", type: "number", min: "0" },
      ],
      submitLabel: "Guardar regla",
      success: { title: "Regla guardada", description: "El pronóstico de inventario usará estos parámetros." },
    },
    edit: (itemLabel) => ({
      title: `Editar regla — ${itemLabel}`,
      fields: [
        { id: "ingredient", label: "Ingrediente", defaultValue: itemLabel },
        { id: "leadDays", label: "Días de anticipación", type: "number", min: "1" },
        { id: "threshold", label: "Umbral de alerta", type: "number", min: "0" },
      ],
      submitLabel: "Actualizar regla",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar regla de ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "reglas de uso"),
    }),
  },

  forecastAnomalyRule: {
    add: {
      title: "Agregar regla de anomalía",
      fields: [
        {
          id: "category",
          label: "Categoría de gasto",
          type: "select",
          defaultValue: expenseCategories[0],
          options: EXPENSE_CATEGORY_OPTIONS,
        },
        { id: "stdDevThreshold", label: "Desviaciones estándar", type: "number", min: "1", step: "0.5", defaultValue: "2" },
        { id: "notifyEmail", label: "Notificar a", type: "email", placeholder: "gerencia@restaurante.com" },
      ],
      submitLabel: "Guardar regla",
      success: { title: "Regla guardada", description: "Recibirás alertas cuando un gasto supere el umbral." },
    },
    edit: (itemLabel) => ({
      title: `Editar regla — ${itemLabel}`,
      fields: [
        {
          id: "category",
          label: "Categoría de gasto",
          type: "select",
          options: EXPENSE_CATEGORY_OPTIONS,
        },
        { id: "stdDevThreshold", label: "Desviaciones estándar", type: "number", min: "1", step: "0.5" },
        { id: "notifyEmail", label: "Notificar a", type: "email" },
      ],
      submitLabel: "Actualizar regla",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar regla de ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "reglas de anomalía"),
    }),
  },

  analyticsMarginNote: {
    add: {
      title: "Agregar nota de margen",
      fields: [
        { id: "title", label: "Título", placeholder: "Margen estable en Q2" },
        { id: "body", label: "Nota", type: "textarea", placeholder: "El margen se mantuvo por encima del 20%..." },
        { id: "month", label: "Mes de referencia", type: "select", options: MONTHS },
      ],
      submitLabel: "Guardar nota",
      success: { title: "Nota guardada", description: "Quedó registrada en el espacio de análisis." },
    },
    edit: (itemLabel) => ({
      title: `Editar nota — ${itemLabel}`,
      fields: [
        { id: "title", label: "Título", defaultValue: itemLabel },
        { id: "body", label: "Nota", type: "textarea" },
        { id: "month", label: "Mes de referencia", type: "select", options: MONTHS },
      ],
      submitLabel: "Actualizar nota",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar nota ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "notas"),
    }),
  },

  analyticsObservation: {
    add: {
      title: "Agregar observación",
      fields: [
        { id: "title", label: "Título", placeholder: "Gastos bajo control" },
        { id: "body", label: "Observación", type: "textarea", placeholder: "Los gastos crecieron más lento que los ingresos..." },
      ],
      submitLabel: "Guardar observación",
      success: { title: "Observación guardada", description: "Visible en el panel de análisis." },
    },
    edit: (itemLabel) => ({
      title: `Editar observación`,
      fields: [
        { id: "title", label: "Título", defaultValue: itemLabel },
        { id: "body", label: "Observación", type: "textarea" },
      ],
      submitLabel: "Actualizar observación",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar esta observación?`,
      description: "Dejará de mostrarse en el panel de análisis.",
      success: deleteSuccess(itemLabel || "La observación", "análisis"),
    }),
  },

  analyticsPolicy: {
    add: {
      title: "Agregar política",
      fields: [
        { id: "name", label: "Nombre", placeholder: "Pagos a proveedores" },
        { id: "description", label: "Descripción", type: "textarea", placeholder: "Alinear lotes de cuentas por pagar..." },
        { id: "effectiveDate", label: "Vigente desde", placeholder: "2026-06-01" },
      ],
      submitLabel: "Guardar política",
      success: { title: "Política guardada", description: "El equipo verá la nueva directriz de efectivo." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Nombre", defaultValue: itemLabel },
        { id: "description", label: "Descripción", type: "textarea" },
        { id: "effectiveDate", label: "Vigente desde", placeholder: "2026-06-01" },
      ],
      submitLabel: "Actualizar política",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "políticas"),
    }),
  },

  analyticsMonth: {
    add: {
      title: "Agregar mes",
      fields: [
        { id: "month", label: "Mes", type: "select", options: MONTHS },
        { id: "margin", label: "Margen neto (%)", type: "number", step: "0.1" },
      ],
      submitLabel: "Agregar mes",
      success: { title: "Mes agregado", description: "La tendencia de margen incluirá el nuevo dato." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "month", label: "Mes", type: "select", options: MONTHS, defaultValue: itemLabel },
        { id: "margin", label: "Margen neto (%)", type: "number", step: "0.1" },
      ],
      submitLabel: "Actualizar mes",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "la tendencia"),
    }),
  },

  analyticsTrendPoint: {
    add: {
      title: "Agregar punto de tendencia",
      fields: [
        { id: "month", label: "Mes", type: "select", options: MONTHS },
        { id: "margin", label: "Margen neto (%)", type: "number", step: "0.1" },
        { id: "note", label: "Comentario", placeholder: "Pico por temporada" },
      ],
      submitLabel: "Agregar punto",
      success: { title: "Punto agregado", description: "El gráfico de margen se actualizó." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "month", label: "Mes", type: "select", options: MONTHS, defaultValue: itemLabel },
        { id: "margin", label: "Margen neto (%)", type: "number", step: "0.1" },
        { id: "note", label: "Comentario" },
      ],
      submitLabel: "Actualizar punto",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "el gráfico"),
    }),
  },

  settingsTeamMember: {
    add: {
      title: "Agregar miembro del equipo",
      fields: [
        { id: "firstName", label: "Nombre", placeholder: "Ana" },
        { id: "lastName", label: "Apellido", placeholder: "García" },
        { id: "email", label: "Correo", type: "email", placeholder: "ana@restaurante.com" },
        { id: "role", label: "Rol", type: "select", defaultValue: "EMPLOYEE", options: ROLE_OPTIONS },
      ],
      submitLabel: "Enviar invitación",
      success: {
        title: "Invitación enviada",
        description: "Recibirán un correo para unirse a tu espacio.",
      },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "firstName", label: "Nombre" },
        { id: "lastName", label: "Apellido" },
        { id: "email", label: "Correo", type: "email" },
        { id: "role", label: "Rol", type: "select", options: ROLE_OPTIONS },
      ],
      submitLabel: "Guardar cambios",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar a ${itemLabel}?`,
      description: "Perderá acceso a este restaurante.",
      success: deleteSuccess(itemLabel, "el equipo"),
    }),
  },

  settingsProfileField: {
    add: {
      title: "Agregar campo de perfil",
      fields: [
        { id: "label", label: "Etiqueta", placeholder: "Teléfono del local" },
        {
          id: "fieldType",
          label: "Tipo",
          type: "select",
          defaultValue: "text",
          options: [
            { value: "text", label: "Texto" },
            { value: "email", label: "Correo" },
            { value: "phone", label: "Teléfono" },
            { value: "number", label: "Número" },
          ],
        },
        { id: "defaultValue", label: "Valor predeterminado", placeholder: "Opcional" },
      ],
      submitLabel: "Agregar campo",
      success: { title: "Campo agregado", description: "Aparecerá en el perfil del espacio." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "label", label: "Etiqueta", defaultValue: itemLabel },
        {
          id: "fieldType",
          label: "Tipo",
          type: "select",
          options: [
            { value: "text", label: "Texto" },
            { value: "email", label: "Correo" },
            { value: "phone", label: "Teléfono" },
            { value: "number", label: "Número" },
          ],
        },
        { id: "defaultValue", label: "Valor predeterminado" },
      ],
      submitLabel: "Actualizar campo",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      success: deleteSuccess(itemLabel, "el perfil"),
    }),
  },

  settingsEndpoint: {
    add: {
      title: "Agregar endpoint",
      fields: [
        { id: "name", label: "Nombre", placeholder: "API principal" },
        { id: "url", label: "URL base", placeholder: "https://api.personalmetrics.com" },
        {
          id: "environment",
          label: "Entorno",
          type: "select",
          defaultValue: "production",
          options: [
            { value: "production", label: "Producción" },
            { value: "staging", label: "Staging" },
            { value: "development", label: "Desarrollo" },
          ],
        },
      ],
      submitLabel: "Guardar endpoint",
      success: { title: "Endpoint guardado", description: "Las integraciones usarán esta URL base." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Nombre", defaultValue: itemLabel },
        { id: "url", label: "URL base" },
        {
          id: "environment",
          label: "Entorno",
          type: "select",
          options: [
            { value: "production", label: "Producción" },
            { value: "staging", label: "Staging" },
            { value: "development", label: "Desarrollo" },
          ],
        },
      ],
      submitLabel: "Actualizar endpoint",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Eliminar ${itemLabel}?`,
      description: "Las integraciones dejarán de usar este endpoint.",
      success: deleteSuccess(itemLabel, "endpoints"),
    }),
  },

  settingsIntegration: {
    add: {
      title: "Agregar integración",
      fields: [
        { id: "name", label: "Nombre", placeholder: "Square POS" },
        {
          id: "provider",
          label: "Proveedor",
          type: "select",
          defaultValue: "square",
          options: [
            { value: "square", label: "Square" },
            { value: "toast", label: "Toast" },
            { value: "quickbooks", label: "QuickBooks" },
            { value: "custom", label: "Personalizado" },
          ],
        },
        { id: "apiKey", label: "Clave API", type: "password", placeholder: "••••••••" },
        { id: "webhookUrl", label: "Webhook (opcional)", placeholder: "https://..." },
      ],
      submitLabel: "Conectar integración",
      success: { title: "Integración conectada", description: "Empezará a sincronizar datos según la configuración." },
    },
    edit: (itemLabel) => ({
      title: `Editar ${itemLabel}`,
      fields: [
        { id: "name", label: "Nombre", defaultValue: itemLabel },
        {
          id: "provider",
          label: "Proveedor",
          type: "select",
          options: [
            { value: "square", label: "Square" },
            { value: "toast", label: "Toast" },
            { value: "quickbooks", label: "QuickBooks" },
            { value: "custom", label: "Personalizado" },
          ],
        },
        { id: "apiKey", label: "Clave API", type: "password" },
        { id: "webhookUrl", label: "Webhook (opcional)" },
      ],
      submitLabel: "Actualizar integración",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `¿Desconectar ${itemLabel}?`,
      description: "Dejará de sincronizar datos con PersonalMetrics.",
      confirmLabel: "Desconectar",
      success: { title: "Integración desconectada", description: `${itemLabel} ya no envía datos.` },
    }),
  },
  menuItem: {
    add: {
      title: "Add menu item",
      description: "Enter the selling price, ingredient cost, and current popularity score.",
      fields: [
        { id: "name", label: "Dish name", placeholder: "Roasted salmon", fullWidth: true },
        { id: "price", label: "Menu price", type: "number", min: "0", step: "0.01" },
        { id: "ingredientCost", label: "Ingredient cost", type: "number", min: "0", step: "0.01" },
        { id: "popularity", label: "Popularity score", type: "number", min: "0", max: "100" },
      ],
      submitLabel: "Save menu item",
      success: {
        title: "Menu item saved",
        description: "The dish is now included in menu profitability reporting.",
      },
    },
    edit: (itemLabel) => ({
      title: `Edit ${itemLabel}`,
      description: "Update pricing and cost assumptions for this dish.",
      fields: [
        { id: "name", label: "Dish name", defaultValue: itemLabel, fullWidth: true },
        { id: "price", label: "Menu price", type: "number", min: "0", step: "0.01" },
        { id: "ingredientCost", label: "Ingredient cost", type: "number", min: "0", step: "0.01" },
        { id: "popularity", label: "Popularity score", type: "number", min: "0", max: "100" },
      ],
      submitLabel: "Update menu item",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `Remove ${itemLabel}?`,
      description: "This dish will be removed from menu tables and profitability charts.",
      confirmLabel: "Remove item",
      success: {
        title: "Menu item removed",
        description: `${itemLabel} was removed from menu reporting.`,
      },
    }),
  },

  menuChartPoint: {
    add: {
      title: "Add chart data point",
      description: "Add a pricing and popularity comparison to the menu chart.",
      fields: [
        { id: "name", label: "Dish name", placeholder: "Seasonal ravioli", fullWidth: true },
        { id: "price", label: "Menu price", type: "number", min: "0", step: "0.01" },
        { id: "ingredientCost", label: "Ingredient cost", type: "number", min: "0", step: "0.01" },
        { id: "marginPct", label: "Contribution margin", type: "number", min: "0", max: "100", step: "0.1" },
        { id: "popularity", label: "Popularity score", type: "number", min: "0", max: "100" },
      ],
      submitLabel: "Add data point",
      success: {
        title: "Data point added",
        description: "The menu profitability charts now include this dish.",
      },
    },
    edit: (itemLabel) => ({
      title: `Edit chart point — ${itemLabel}`,
      fields: [
        { id: "name", label: "Dish name", defaultValue: itemLabel, fullWidth: true },
        { id: "price", label: "Menu price", type: "number", min: "0", step: "0.01" },
        { id: "ingredientCost", label: "Ingredient cost", type: "number", min: "0", step: "0.01" },
        { id: "marginPct", label: "Contribution margin", type: "number", min: "0", max: "100", step: "0.1" },
        { id: "popularity", label: "Popularity score", type: "number", min: "0", max: "100" },
      ],
      submitLabel: "Update data point",
      success: editSuccess(itemLabel),
    }),
    delete: (itemLabel) => ({
      title: `Remove ${itemLabel} from the chart?`,
      description: "The dish will no longer appear in this profitability comparison.",
      confirmLabel: "Remove point",
      success: {
        title: "Data point removed",
        description: `${itemLabel} was removed from the chart.`,
      },
    }),
  },
};

const OPTIONAL_FIELD_IDS = new Set([
  "notes",
  "note",
  "hint",
  "body",
  "webhookUrl",
  "defaultValue",
]);

const EDIT_FALLBACKS = {
  amount: "1250.00",
  value: "24500",
  quantity: "12",
  qty: "12",
  unit: "kg",
  reorderAt: "8",
  threshold: "8",
  unitCost: "14.50",
  price: "26.00",
  ingredientCost: "7.20",
  margin: "72",
  marginPct: "72",
  percentage: "38",
  popularity: "88",
  revenue: "168000",
  expenses: "88000",
  monthlyAmount: "12000",
  dailyTarget: "3300",
  avgTicket: "40",
  ordersPerDay: "61",
  targetCount: "12",
  alertThreshold: "10000",
  minAlerts: "3",
  lookaheadDays: "14",
  periodDays: "30",
  stdDevThreshold: "2",
  email: "operaciones@bistronorte.com",
  phone: "+1 (555) 201-4490",
  products: "Productos frescos y suministros",
  paymentTerms: "30",
  url: "https://api.personalmetrics.com",
  webhookUrl: "https://bistronorte.com/api/webhooks/personalmetrics",
  apiKey: "pm_live_demo_key",
  date: "2026-06-09",
  due: "2026-06-30",
  expiresOn: "2026-08-15",
  effectiveDate: "2026-06-09",
  message: "Revisar este registro y tomar acción antes del próximo cierre.",
  description: "Configuración operativa del restaurante.",
  notes: "Revisado por gerencia.",
  note: "Dato validado contra el cierre mensual.",
  body: "Los resultados se mantienen dentro del rango esperado.",
  reference: "Cierre POS #1842",
};

const SAMPLE_EDIT_ITEMS = {
  dashboardKpi: { title: "Ingresos netos", value: "$42,850", hint: "Resultado después de gastos operativos." },
  inventorySeries: { label: "Parmigiano", onHand: 5, par: 8 },
  inventoryIngredient: { name: "Parmigiano Reggiano", quantity: 5, unit: "kg", reorderAt: 8, unitCost: 38.5, expiresOn: "2026-06-20" },
  supplierActiveSummary: { name: "Meta de proveedores", targetCount: 12, notes: "Priorizar proveedores locales." },
  supplierPayableSummary: { name: "Cuentas por pagar", periodDays: 30, alertThreshold: 10000 },
  supplierReminderSummary: { name: "Recordatorios de reorden", lookaheadDays: 14, minAlerts: 3 },
  breakEvenFixedCost: { name: "Renta del local", monthlyAmount: 12000, category: "Operación" },
  breakEvenVariable: { name: "Costo de alimentos", percentage: 38 },
  breakEvenRevenueRule: { name: "Meta entre semana", dailyTarget: 3300, notes: "Aplicar de lunes a jueves." },
  breakEvenTicket: { name: "Ticket promedio", avgTicket: 40, ordersPerDay: 61 },
  breakEvenChartPoint: { name: "Escenario base", revenue: 115000, expenses: 88000 },
  forecastScenario: { name: "Escenario conservador", growthPct: 4, probability: 70 },
  forecastUsageRule: { name: "Consumo de ingredientes", percentage: 36 },
  forecastAnomalyRule: { name: "Ingredientes", category: "INGREDIENTS", stdDevThreshold: 2, notifyEmail: "gerencia@bistronorte.com" },
  analyticsMarginNote: { title: "Margen estable en Q2", body: "El margen se mantuvo por encima del objetivo.", month: "Jun" },
  analyticsObservation: { title: "Gastos bajo control", body: "Los gastos crecieron más lento que los ingresos." },
  analyticsPolicy: { name: "Pagos a proveedores", description: "Agrupar pagos cada jueves.", effectiveDate: "2026-06-09" },
  analyticsTrendPoint: { month: "Jun", margin: 23.3, note: "Mejora por ajuste de precios." },
  settingsProfileField: { label: "Teléfono del local", fieldType: "phone", defaultValue: "+1 (555) 010-2200" },
  settingsIntegration: { name: "Square POS", provider: "square", apiKey: "pm_live_demo_key", webhookUrl: "https://bistronorte.com/api/webhooks/personalmetrics" },
  menuItem: { name: "Risotto de hongos silvestres", price: 26, ingredientCost: 7.2, popularity: 88 },
  menuChartPoint: { name: "Risotto de hongos silvestres", price: 26, ingredientCost: 7.2, marginPct: 72, popularity: 88 },
};

const DELETE_CONFIRM_LABELS = {
  income: "Eliminar ingreso",
  expense: "Eliminar gasto",
  supplier: "Eliminar proveedor",
  inventoryIngredient: "Eliminar ingrediente",
  inventorySeries: "Quitar serie",
  alert: "Eliminar alerta",
  dashboardKpi: "Eliminar indicador",
  dashboardMonth: "Eliminar mes",
  dashboardCategory: "Eliminar categoría",
  dashboardInventoryAlert: "Eliminar alerta",
  dashboardPaymentReminder: "Eliminar recordatorio",
  breakEvenFixedCost: "Eliminar costo",
  breakEvenVariable: "Eliminar factor",
  breakEvenRevenueRule: "Eliminar regla",
  breakEvenTicket: "Eliminar nivel",
  breakEvenWeek: "Eliminar semana",
  breakEvenChartPoint: "Quitar punto",
  forecastMonth: "Eliminar mes",
  forecastScenario: "Eliminar escenario",
  forecastUsageRule: "Eliminar regla",
  forecastAnomalyRule: "Eliminar regla",
  analyticsMarginNote: "Eliminar nota",
  analyticsObservation: "Eliminar observación",
  analyticsPolicy: "Eliminar política",
  analyticsMonth: "Eliminar mes",
  analyticsTrendPoint: "Quitar punto",
  settingsTeamMember: "Eliminar miembro",
  settingsProfileField: "Eliminar campo",
  settingsEndpoint: "Eliminar endpoint",
  menuItem: "Remove item",
  menuChartPoint: "Remove point",
};

function itemLabelOf(item) {
  if (typeof item === "string" && item) return item;
  if (!item || typeof item !== "object") return "este registro";
  return (
    item.name ??
    item.label ??
    item.title ??
    item.item ??
    item.supplier ??
    item.month ??
    item.type ??
    "este registro"
  );
}

function fieldPresentation(field) {
  const isMoney = /amount|cost|price|revenue|expenses|target/i.test(field.id);
  const isPercent = /percentage|margin/i.test(field.id);
  return {
    ...field,
    required: field.required ?? !OPTIONAL_FIELD_IDS.has(field.id),
    prefix: field.prefix ?? (isMoney ? "$" : undefined),
    suffix: field.suffix ?? (isPercent ? "%" : undefined),
    helperText:
      field.helperText ??
      (field.id === "popularity"
        ? "Use a score from 0 to 100 based on recent sales."
        : field.id === "reorderAt"
          ? "An alert appears when available stock reaches this quantity."
          : undefined),
  };
}

function preparedFields(fields, item) {
  return fields.map((field) => {
    const directValue =
      item && typeof item === "object" ? item[field.id] : undefined;
    return fieldPresentation({
      ...field,
      defaultValue:
        directValue ??
        field.defaultValue ??
        EDIT_FALLBACKS[field.id] ??
        (field.type === "select" ? field.options?.[0]?.value : ""),
    });
  });
}

/**
 * Builds onAdd / onEdit / onDelete handlers from a schema key.
 * Schemas without `add` omit onAdd (summary cards).
 */
export function createCrudHandlers(crud, schemaKey) {
  const schema = FORM_SCHEMAS[schemaKey];
  if (!schema) {
    throw new Error(`Unknown form schema: ${schemaKey}`);
  }

  return {
    onAdd: schema.add
      ? () =>
          crud.openForm({
            ...schema.add,
            fields: schema.add.fields.map(fieldPresentation),
            success: schema.add.success,
          })
      : undefined,
    onEdit: (item) => {
      const effectiveItem = item ?? SAMPLE_EDIT_ITEMS[schemaKey];
      const itemLabel = itemLabelOf(effectiveItem);
      const config = schema.edit(itemLabel);
      crud.openForm({
        ...config,
        fields: preparedFields(config.fields, effectiveItem),
        success: config.success,
      });
    },
    onDelete: (item) => {
      const effectiveItem = item ?? SAMPLE_EDIT_ITEMS[schemaKey];
      const itemLabel = itemLabelOf(effectiveItem);
      const config = schema.delete(itemLabel);
      const confirmLabel =
        config.confirmLabel ?? DELETE_CONFIRM_LABELS[schemaKey] ?? "Eliminar";
      crud.openConfirm({
        title: config.title,
        description: config.description,
        confirmLabel,
        destructive: config.destructive ?? confirmLabel !== "Restablecer",
        success: config.success,
      });
    },
  };
}

/** Profile and password fields for the account menu. */
export const PROFILE_FIELDS = [
  { id: "firstName", label: "Nombre", placeholder: "Jordan", required: true, autoComplete: "given-name" },
  { id: "lastName", label: "Apellido", placeholder: "Lee", required: true, autoComplete: "family-name" },
  { id: "email", label: "Correo", type: "email", placeholder: "owner@restaurante.com", required: true, autoComplete: "email" },
  { id: "restaurantName", label: "Nombre del perfil", placeholder: "Mi perfil personal", required: true, fullWidth: true },
];

export const PASSWORD_FIELDS = [
  { id: "currentPassword", label: "Contraseña actual", type: "password", required: true, fullWidth: true, autoComplete: "current-password" },
  { id: "newPassword", label: "Nueva contraseña", type: "password", required: true, autoComplete: "new-password", helperText: "Usa al menos 8 caracteres, una mayúscula y un número." },
  { id: "confirmPassword", label: "Confirmar contraseña", type: "password", required: true, autoComplete: "new-password" },
];
