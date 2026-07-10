import * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateEmail,
  updateProfile,
} from "firebase/auth";
import {
  getUserProfile,
  subscribeUserProfile,
  upsertUserProfile,
} from "api/firebase";
import { auth } from "lib/firebase";

const AuthContext = createContext(null);

function displayNameParts(displayName = "") {
  const [firstName = "", ...lastNameParts] = displayName.trim().split(/\s+/);
  return { firstName, lastName: lastNameParts.join(" ") };
}

function normalizeProfile(firebaseUser, profile = {}) {
  const nameParts = displayNameParts(firebaseUser.displayName);

  return {
    uid: firebaseUser.uid,
    email: profile.email || firebaseUser.email || "",
    firstName: profile.firstName || nameParts.firstName || "Usuario",
    lastName: profile.lastName || nameParts.lastName || "",
    onboardingCompleted: Boolean(profile.onboardingCompleted),
    preferences: {
      currency: "MXN",
      timezone: "America/Hermosillo",
      monthStart: "1",
      paymentReminders: true,
      weeklySummary: true,
      forecastChanges: false,
      ...(profile.preferences || {}),
    },
  };
}

function authErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Correo o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ese correo ya tiene una cuenta.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/invalid-email":
      return "Ingresa un correo válido.";
    default:
      return error?.message || "No se pudo completar la operación.";
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  const refreshProfile = useCallback(async (firebaseUser) => {
    const profile = await getUserProfile(firebaseUser.uid).catch(() => null);
    setUser(normalizeProfile(firebaseUser, profile || {}));
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setAuthError("Firebase no está configurado.");
      return undefined;
    }

    let unsubscribeProfile;
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribeProfile?.();
      unsubscribeProfile = undefined;

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      await refreshProfile(firebaseUser);
      unsubscribeProfile = subscribeUserProfile(
        firebaseUser.uid,
        (profile) => setUser(normalizeProfile(firebaseUser, profile || {})),
        () => {}
      );
      setLoading(false);
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, [refreshProfile]);

  const login = useCallback(
    async ({ email, password }) => {
      setAuthError("");
      try {
        if (!auth) throw new Error("Firebase no está configurado.");
        const credential = await signInWithEmailAndPassword(auth, email, password);
        await refreshProfile(credential.user);
        return { ok: true };
      } catch (error) {
        const message = authErrorMessage(error);
        setAuthError(message);
        return { ok: false, error: message };
      }
    },
    [refreshProfile]
  );

  const signup = useCallback(
    async ({ email, password, firstName, lastName }) => {
      setAuthError("");
      try {
        if (!auth) throw new Error("Firebase no está configurado.");
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = credential.user;
        const displayName = [firstName, lastName].filter(Boolean).join(" ");

        if (displayName) {
          await updateProfile(firebaseUser, { displayName });
        }

        await upsertUserProfile(firebaseUser.uid, {
          email,
          firstName: firstName || "Usuario",
          lastName: lastName || "",
          onboardingCompleted: false,
          preferences: {
            currency: "MXN",
            timezone: "America/Hermosillo",
            monthStart: "1",
            paymentReminders: true,
            weeklySummary: true,
            forecastChanges: false,
          },
          createdAt: new Date().toISOString(),
        });
        await refreshProfile(firebaseUser);
        return { ok: true };
      } catch (error) {
        const message = authErrorMessage(error);
        setAuthError(message);
        return { ok: false, error: message };
      }
    },
    [refreshProfile]
  );

  const updateUserProfile = useCallback(
    async (updates) => {
      if (!auth?.currentUser) throw new Error("No hay sesión activa.");
      const current = auth.currentUser;
      const displayName = [updates.firstName, updates.lastName].filter(Boolean).join(" ");

      if (displayName) await updateProfile(current, { displayName });
      if (updates.email && updates.email !== current.email) await updateEmail(current, updates.email);

      await upsertUserProfile(current.uid, updates);
      await refreshProfile(current);
    },
    [refreshProfile]
  );

  const completeOnboarding = useCallback(async () => {
    if (!auth?.currentUser) return;
    await updateUserProfile({ onboardingCompleted: true });
  }, [updateUserProfile]);

  const resetPassword = useCallback(async (email) => {
    setAuthError("");
    try {
      if (!auth) throw new Error("Firebase no está configurado.");
      await sendPasswordResetEmail(auth, email);
      return { ok: true };
    } catch (error) {
      const message = authErrorMessage(error);
      setAuthError(message);
      return { ok: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    if (auth) firebaseSignOut(auth).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      resetPassword,
      updateUserProfile,
      completeOnboarding,
    }),
    [
      user,
      loading,
      authError,
      login,
      signup,
      logout,
      resetPassword,
      updateUserProfile,
      completeOnboarding,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
