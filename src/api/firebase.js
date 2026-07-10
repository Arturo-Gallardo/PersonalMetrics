import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "lib/firebase";

export function assertFirestoreReady() {
  if (!db) {
    throw new Error("Firebase is not configured. Fill REACT_APP_FIREBASE_* in .env.local.");
  }
}

export function userDoc(uid) {
  assertFirestoreReady();
  return doc(db, "users", uid);
}

export function userCollection(uid, name) {
  assertFirestoreReady();
  return collection(db, "users", uid, name);
}

export async function getUserProfile(uid) {
  const snap = await getDoc(userDoc(uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function upsertUserProfile(uid, profile) {
  await setDoc(
    userDoc(uid),
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function subscribeUserProfile(uid, onNext, onError) {
  return onSnapshot(userDoc(uid), (snap) => {
    onNext(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  }, onError);
}

export function subscribeUserCollection(uid, name, onNext, onError) {
  const q = query(userCollection(uid, name), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => onNext(snap.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError
  );
}

export async function createUserItem(uid, collectionName, payload) {
  const ref = await addDoc(userCollection(uid, collectionName), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateUserItem(uid, collectionName, id, payload) {
  await updateDoc(doc(db, "users", uid, collectionName, id), {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUserItem(uid, collectionName, id) {
  await deleteDoc(doc(db, "users", uid, collectionName, id));
}
