const fs = require("fs");
const path = require("path");

function loadEnv(file) {
  const full = path.resolve(file);
  if (!fs.existsSync(full)) throw new Error(`${file} missing`);
  const lines = fs.readFileSync(full, "utf8").split(/\r?\n/);
  for (const line of lines) {
    if (!line || line.trim().startsWith("#") || !line.includes("=")) continue;
    const index = line.indexOf("=");
    process.env[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
}

loadEnv(".env.local");

const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require("firebase/auth");
const { getFirestore, doc, setDoc, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

async function addUserDoc(db, uid) {
  await setDoc(doc(db, "users", uid), {
    email: "test@personalmetrics.com",
    firstName: "Usuario",
    lastName: "Prueba",
    onboardingCompleted: true,
    preferences: {
      currency: "MXN",
      timezone: "America/Hermosillo",
      monthStart: "1",
      paymentReminders: true,
      weeklySummary: true,
      forecastChanges: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: serverTimestamp(),
  });
}

async function addItem(db, uid, name, payload) {
  await addDoc(collection(db, "users", uid, name), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

async function main() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const credential = await createUserWithEmailAndPassword(auth, "test@personalmetrics.com", "Test1234");
  const user = credential.user;
  await updateProfile(user, { displayName: "Usuario Prueba" });
  await addUserDoc(db, user.uid);

  const income = [
    { label: "Sueldo", category: "salary", amount: 28000, date: "2026-07-01" },
    { label: "Freelance landing page", category: "freelance", amount: 6500, date: "2026-07-05" },
    { label: "Rendimientos fondo", category: "investment", amount: 1250, date: "2026-06-28" },
    { label: "Venta de monitor", category: "sale", amount: 3200, date: "2026-06-18" },
  ];
  const expenses = [
    { label: "Renta", category: "housing", amount: 8500, date: "2026-07-02", recurring: true },
    { label: "Supermercado", category: "food", amount: 2750, date: "2026-07-04", recurring: false },
    { label: "Gasolina", category: "transport", amount: 1150, date: "2026-07-06", recurring: false },
    { label: "Luz e internet", category: "utilities", amount: 1450, date: "2026-07-07", recurring: true },
    { label: "Netflix y Spotify", category: "subscriptions", amount: 420, date: "2026-07-08", recurring: true },
    { label: "Consulta médica", category: "health", amount: 900, date: "2026-06-22", recurring: false },
  ];
  const assets = [
    { name: "Fondo de inversión", description: "ETF S&P 500", category: "investment", current: 125000 },
    { name: "Laptop", description: "MacBook Air M1", category: "technology", current: 18500 },
    { name: "Automóvil", description: "Toyota Corolla 2021", category: "vehicle", current: 198000 },
  ];
  const alerts = [
    { type: "income", severity: "info", message: "Se registró ingreso de $28,000.00 por Sueldo.", date: "2026-07-01", source: "system" },
    { type: "expense", severity: "info", message: "Se registró gasto de $8,500.00 en Renta.", date: "2026-07-02", source: "system" },
    { type: "recurring", severity: "warning", message: "Renta quedó como gasto recurrente mensual.", date: "2026-07-02", source: "system" },
    { type: "asset", severity: "info", message: "Se agregó activo Fondo de inversión con valor de $125,000.00.", date: "2026-07-03", source: "system" },
    { type: "forecast", severity: "warning", message: "Pronóstico detecta aumento de gastos recurrentes este mes.", date: "2026-07-08", source: "system" },
  ];

  for (const item of income) await addItem(db, user.uid, "income", item);
  for (const item of expenses) await addItem(db, user.uid, "expenses", item);
  for (const item of assets) await addItem(db, user.uid, "assets", item);
  for (const item of alerts) await addItem(db, user.uid, "alerts", item);
  console.log(`created ${user.uid}`);
}

main().catch((error) => {
  console.error(error.code || error.message);
  process.exit(1);
});
