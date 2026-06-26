package com.personalmetrics.service;

import com.personalmetrics.domain.InventoryItem;
import com.personalmetrics.domain.Restaurant;
import com.personalmetrics.domain.Supplier;
import com.personalmetrics.repository.InventoryItemRepository;
import com.personalmetrics.repository.SupplierRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

  private final InventoryItemRepository inventoryItemRepository;
  private final SupplierRepository supplierRepository;

  public Map<String, Object> summary(Restaurant restaurant) {
    Map<String, Object> kpis = new LinkedHashMap<>();
    kpis.put("grossIncome", 184200);
    kpis.put("netIncome", 42850);
    kpis.put("monthlyExpenses", 98400);
    kpis.put("profitMarginPct", 23.3);
    kpis.put("dailyBreakEven", 3300);
    kpis.put("monthlyRevenueTarget", 115000);

    List<Map<String, Object>> revenueTrend = defaultRevenueTrend();
    List<Map<String, Object>> expenseBreakdown = defaultExpenseBreakdown();
    List<Map<String, Object>> inventoryAlerts = buildInventoryAlerts(restaurant);
    List<Map<String, Object>> supplierReminders = buildSupplierReminders(restaurant);

    Map<String, Object> body = new LinkedHashMap<>();
    body.put("kpis", kpis);
    body.put("revenueTrend", revenueTrend);
    body.put("expenseBreakdown", expenseBreakdown);
    body.put("inventoryAlerts", inventoryAlerts);
    body.put("supplierReminders", supplierReminders);
    return body;
  }

  private List<Map<String, Object>> buildInventoryAlerts(Restaurant restaurant) {
    List<InventoryItem> items = inventoryItemRepository.findByRestaurant(restaurant);
    List<Map<String, Object>> rows = new ArrayList<>();
    for (InventoryItem item : items) {
      if (item.getReorderAt() != null && item.getQuantity() <= item.getReorderAt()) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("item", item.getName());
        row.put("qty", item.getQuantity());
        row.put("unit", item.getUnit());
        row.put("threshold", item.getReorderAt());
        rows.add(row);
      }
    }
    if (rows.isEmpty()) {
      return defaultInventoryAlerts();
    }
    return rows;
  }

  private List<Map<String, Object>> buildSupplierReminders(Restaurant restaurant) {
    List<Supplier> suppliers = supplierRepository.findByRestaurant(restaurant);
    List<Map<String, Object>> rows = new ArrayList<>();
    for (Supplier supplier : suppliers) {
      if (supplier.getPaymentDueOn() != null) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("supplier", supplier.getName());
        row.put("due", supplier.getPaymentDueOn().toString());
        row.put("amount", supplier.getLastTotal() != null ? supplier.getLastTotal().doubleValue() : 0);
        rows.add(row);
      }
    }
    if (rows.isEmpty()) {
      return defaultSupplierReminders();
    }
    return rows;
  }

  private List<Map<String, Object>> defaultRevenueTrend() {
    List<Map<String, Object>> list = new ArrayList<>();
    addTrend(list, "Ene", 120000, 78000);
    addTrend(list, "Feb", 132000, 81000);
    addTrend(list, "Mar", 128000, 79500);
    addTrend(list, "Abr", 145000, 83000);
    addTrend(list, "May", 152000, 86000);
    addTrend(list, "Jun", 168000, 88000);
    return list;
  }

  private void addTrend(List<Map<String, Object>> list, String month, int revenue, int expenses) {
    Map<String, Object> row = new LinkedHashMap<>();
    row.put("month", month);
    row.put("revenue", revenue);
    row.put("expenses", expenses);
    list.add(row);
  }

  private List<Map<String, Object>> defaultExpenseBreakdown() {
    List<Map<String, Object>> list = new ArrayList<>();
    list.add(Map.of("name", "Ingredientes", "value", 42000));
    list.add(Map.of("name", "Salarios", "value", 28000));
    list.add(Map.of("name", "Alquiler", "value", 12000));
    list.add(Map.of("name", "Servicios", "value", 6500));
    list.add(Map.of("name", "Mantenimiento", "value", 4200));
    list.add(Map.of("name", "Suscripciones", "value", 2700));
    return list;
  }

  private List<Map<String, Object>> defaultInventoryAlerts() {
    List<Map<String, Object>> list = new ArrayList<>();
    list.add(Map.of("item", "Salmón del Atlántico", "qty", 4, "unit", "kg", "threshold", 8));
    list.add(Map.of("item", "Crema espesa", "qty", 2, "unit", "L", "threshold", 6));
    list.add(Map.of("item", "Tomates San Marzano", "qty", 6, "unit", "latas", "threshold", 12));
    return list;
  }

  private List<Map<String, Object>> defaultSupplierReminders() {
    List<Map<String, Object>> list = new ArrayList<>();
    list.add(Map.of("supplier", "Mariscos Costa", "due", "2026-05-18", "amount", 4200));
    list.add(Map.of("supplier", "Productos del Valle", "due", "2026-05-22", "amount", 1850));
    list.add(Map.of("supplier", "Suministros Panadería Artesanal", "due", "2026-05-28", "amount", 960));
    return list;
  }
}
