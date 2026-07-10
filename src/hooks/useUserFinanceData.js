import * as React from "react";
import {
  createUserItem,
  deleteUserItem,
  subscribeUserCollection,
  updateUserItem,
} from "api/firebase";
import { useAuth } from "context/AuthContext";

const COLLECTIONS = ["income", "expenses", "assets", "alerts"];
const empty = { income: [], expenses: [], assets: [], alerts: [] };

export function useUserFinanceData() {
  const { user } = useAuth();
  const [data, setData] = React.useState(empty);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!user?.uid) {
      setData(empty);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError("");
    const loaded = new Set();
    const unsubscribes = COLLECTIONS.map((name) =>
      subscribeUserCollection(
        user.uid,
        name,
        (items) => {
          loaded.add(name);
          setData((prev) => ({ ...prev, [name]: items }));
          if (loaded.size === COLLECTIONS.length) setLoading(false);
        },
        (err) => {
          setError(err.message || "No se pudieron cargar tus datos.");
          setLoading(false);
        }
      )
    );

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [user?.uid]);

  const createItem = React.useCallback(
    (collectionName, payload) => createUserItem(user.uid, collectionName, payload),
    [user?.uid]
  );

  const updateItem = React.useCallback(
    (collectionName, id, payload) => updateUserItem(user.uid, collectionName, id, payload),
    [user?.uid]
  );

  const deleteItem = React.useCallback(
    (collectionName, id) => deleteUserItem(user.uid, collectionName, id),
    [user?.uid]
  );

  const createSystemAlert = React.useCallback(
    ({ type, severity = "info", message }) =>
      createUserItem(user.uid, "alerts", {
        type,
        severity,
        message,
        date: new Date().toISOString().slice(0, 10),
        source: "system",
      }),
    [user?.uid]
  );

  return { ...data, loading, error, createItem, updateItem, deleteItem, createSystemAlert };
}
