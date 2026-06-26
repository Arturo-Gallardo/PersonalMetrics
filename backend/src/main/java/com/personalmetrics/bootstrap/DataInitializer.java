package com.personalmetrics.bootstrap;

import com.personalmetrics.domain.Alert;
import com.personalmetrics.domain.Expense;
import com.personalmetrics.domain.InventoryItem;
import com.personalmetrics.domain.MenuItem;
import com.personalmetrics.domain.Restaurant;
import com.personalmetrics.domain.Role;
import com.personalmetrics.domain.Supplier;
import com.personalmetrics.domain.User;
import com.personalmetrics.repository.AlertRepository;
import com.personalmetrics.repository.ExpenseRepository;
import com.personalmetrics.repository.InventoryItemRepository;
import com.personalmetrics.repository.MenuItemRepository;
import com.personalmetrics.repository.RestaurantRepository;
import com.personalmetrics.repository.SupplierRepository;
import com.personalmetrics.repository.UserRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

  private final RestaurantRepository restaurantRepository;
  private final UserRepository userRepository;
  private final ExpenseRepository expenseRepository;
  private final InventoryItemRepository inventoryItemRepository;
  private final SupplierRepository supplierRepository;
  private final MenuItemRepository menuItemRepository;
  private final AlertRepository alertRepository;
  private final PasswordEncoder passwordEncoder;

  @Override
  public void run(String... args) {
    if (userRepository.count() > 0) {
      return;
    }

    Restaurant restaurant = new Restaurant();
    restaurant.setName("Bistro Norte");
    restaurant.setAddress("1200 Market Street");
    restaurantRepository.save(restaurant);

    User owner = new User();
    owner.setEmail("owner@demo.local");
    owner.setPasswordHash(passwordEncoder.encode("password"));
    owner.setFirstName("Avery");
    owner.setLastName("Nguyen");
    owner.setRole(Role.OWNER);
    owner.setRestaurant(restaurant);
    userRepository.save(owner);

    User manager = new User();
    manager.setEmail("manager@demo.local");
    manager.setPasswordHash(passwordEncoder.encode("password"));
    manager.setFirstName("Morgan");
    manager.setLastName("Patel");
    manager.setRole(Role.MANAGER);
    manager.setRestaurant(restaurant);
    userRepository.save(manager);

    seedExpenses(restaurant);
    seedInventory(restaurant);
    seedSuppliers(restaurant);
    seedMenu(restaurant);
    seedAlerts(restaurant);
  }

  private void seedExpenses(Restaurant restaurant) {
    addExpense(restaurant, "Entrega semanal de productos", Expense.Category.INGREDIENTS, 1840, LocalDate.of(2026, 5, 8));
    addExpense(restaurant, "Gas y electricidad", Expense.Category.UTILITIES, 920, LocalDate.of(2026, 5, 6));
    addExpense(restaurant, "Nómina — sala", Expense.Category.SALARIES, 12400, LocalDate.of(2026, 5, 1));
    addExpense(restaurant, "Limpieza de campana", Expense.Category.MAINTENANCE, 650, LocalDate.of(2026, 5, 3));
    addExpense(restaurant, "Suscripción POS", Expense.Category.SUBSCRIPTIONS, 189, LocalDate.of(2026, 5, 1));
  }

  private void addExpense(
      Restaurant restaurant, String label, Expense.Category category, long amount, LocalDate date) {
    Expense expense = new Expense();
    expense.setRestaurant(restaurant);
    expense.setLabel(label);
    expense.setCategory(category);
    expense.setAmount(BigDecimal.valueOf(amount));
    expense.setRecordedOn(date);
    expenseRepository.save(expense);
  }

  private void seedInventory(Restaurant restaurant) {
    addInventory(restaurant, "Aceite de oliva (extra virgen)", 18, "L", 14.2, LocalDate.of(2026, 11, 1), 10);
    addInventory(restaurant, "Arroz arborio", 22, "kg", 3.8, LocalDate.of(2027, 1, 15), 15);
    addInventory(restaurant, "Parmigiano Reggiano", 5, "kg", 38.5, LocalDate.of(2026, 6, 20), 8);
    addInventory(restaurant, "Crema espesa", 2, "L", 4.1, LocalDate.of(2026, 5, 14), 6);
  }

  private void addInventory(
      Restaurant restaurant,
      String name,
      int qty,
      String unit,
      double unitCost,
      LocalDate expires,
      int reorder) {
    InventoryItem item = new InventoryItem();
    item.setRestaurant(restaurant);
    item.setName(name);
    item.setQuantity(qty);
    item.setUnit(unit);
    item.setUnitCost(BigDecimal.valueOf(unitCost));
    item.setExpiresOn(expires);
    item.setReorderAt(reorder);
    inventoryItemRepository.save(item);
  }

  private void seedSuppliers(Restaurant restaurant) {
    addSupplier(
        restaurant,
        "Mariscos Costa",
        "pedidos@mariscoscosta.example",
        "+1 (555) 201-4490",
        "Pescado, mariscos",
        LocalDate.of(2026, 5, 2),
        4200,
        LocalDate.of(2026, 5, 18));
    addSupplier(
        restaurant,
        "Productos del Valle",
        "ventas@productosdelvalle.example",
        "+1 (555) 330-8821",
        "Verduras, hierbas",
        LocalDate.of(2026, 5, 9),
        1850,
        LocalDate.of(2026, 5, 22));
    addSupplier(
        restaurant,
        "Suministros Panadería Artesanal",
        "hola@panaderiaartesanal.example",
        "+1 (555) 771-0093",
        "Harina, levadura, mantequilla",
        LocalDate.of(2026, 4, 28),
        960,
        LocalDate.of(2026, 5, 28));
  }

  private void addSupplier(
      Restaurant restaurant,
      String name,
      String email,
      String phone,
      String products,
      LocalDate lastPurchase,
      long lastTotal,
      LocalDate paymentDue) {
    Supplier supplier = new Supplier();
    supplier.setRestaurant(restaurant);
    supplier.setName(name);
    supplier.setEmail(email);
    supplier.setPhone(phone);
    supplier.setProducts(products);
    supplier.setLastPurchaseOn(lastPurchase);
    supplier.setLastTotal(BigDecimal.valueOf(lastTotal));
    supplier.setPaymentDueOn(paymentDue);
    supplierRepository.save(supplier);
  }

  private void seedMenu(Restaurant restaurant) {
    addMenuItem(restaurant, "Risotto de hongos silvestres", 26, 7.2, 88);
    addMenuItem(restaurant, "Branzino a la parrilla", 34, 12.4, 76);
    addMenuItem(restaurant, "Burrata y tomate heirloom", 18, 6.1, 92);
    addMenuItem(restaurant, "Tarta de chocolate", 12, 4.8, 54);
  }

  private void addMenuItem(
      Restaurant restaurant, String name, double price, double ingredientCost, int popularity) {
    MenuItem item = new MenuItem();
    item.setRestaurant(restaurant);
    item.setName(name);
    item.setPrice(BigDecimal.valueOf(price));
    item.setIngredientCost(BigDecimal.valueOf(ingredientCost));
    item.setPopularity(popularity);
    menuItemRepository.save(item);
  }

  private void seedAlerts(Restaurant restaurant) {
    addAlert(restaurant, Alert.AlertType.INVENTORY, Alert.Severity.warning, "La crema espesa está por debajo del nivel mínimo.");
    addAlert(
        restaurant,
        Alert.AlertType.SUPPLIER,
        Alert.Severity.info,
        "Pago a Mariscos Costa vence en 6 días.");
    addAlert(
        restaurant,
        Alert.AlertType.EXPENSE,
        Alert.Severity.warning,
        "El gasto en servicios supera en 14% el promedio de los últimos 3 meses.");
    addAlert(
        restaurant,
        Alert.AlertType.PROFIT,
        Alert.Severity.critical,
        "Margen neto proyectado 3 pts por debajo del trimestre anterior.");
  }

  private void addAlert(Restaurant restaurant, Alert.AlertType type, Alert.Severity severity, String message) {
    Alert alert = new Alert();
    alert.setRestaurant(restaurant);
    alert.setType(type);
    alert.setSeverity(severity);
    alert.setMessage(message);
    alert.setCreatedAt(Instant.now());
    alertRepository.save(alert);
  }
}
