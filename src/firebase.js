// ============================================================
//  Ready Mall Accra — Firebase Client SDK Setup
//  Uses Firebase Web SDK v9+ (modular / tree-shakeable)
// ============================================================

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ── Firebase project config ──────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyA4QAlEx17iPx0DLyjAPi56-VF3gQPRKhg",
  authDomain: "ready-mall-90f98.firebaseapp.com",
  projectId: "ready-mall-90f98",
  storageBucket: "ready-mall-90f98.firebasestorage.app",
  messagingSenderId: "323761780960",
  appId: "1:323761780960:web:24e8ed49ba9ebafe4cf885",
  measurementId: "G-VW2XK888FL",
};

// ── Initialize Firebase ──────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

// ============================================================
//  COLLECTION REFERENCES
//  Mirror the data.js structure: districts / stores / products / orders
// ============================================================
export const districtsRef = collection(db, "districts");
export const storesRef    = collection(db, "stores");
export const productsRef  = collection(db, "products");
export const ordersRef    = collection(db, "orders");

// ============================================================
//  DISTRICTS
// ============================================================

/** Fetch all districts */
export async function getDistricts() {
  const snap = await getDocs(districtsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================================
//  STORES
// ============================================================

/** Fetch all stores */
export async function getStores() {
  const snap = await getDocs(storesRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Fetch stores filtered by districtId */
export async function getStoresByDistrict(districtId) {
  const q = query(storesRef, where("districtId", "==", districtId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================================
//  PRODUCTS
// ============================================================

/** Fetch all products */
export async function getProducts() {
  const snap = await getDocs(productsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Fetch products for a specific store */
export async function getProductsByStore(storeId) {
  const q = query(productsRef, where("storeId", "==", storeId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Fetch a single product by Firestore doc ID */
export async function getProduct(productId) {
  const snap = await getDoc(doc(db, "products", productId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Decrement product stock after a purchase */
export async function updateProductStock(productId, newStock) {
  await updateDoc(doc(db, "products", productId), { stock: newStock });
}

// ============================================================
//  ORDERS
// ============================================================

/** Fetch all orders, newest first */
export async function getOrders() {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Fetch orders for a specific store */
export async function getOrdersByStore(storeId) {
  const q = query(
    ordersRef,
    where("storeId", "==", storeId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Place a new order.
 * @param {object} orderData  - fields from ui.js checkout form
 * @returns {object} saved order with Firestore id
 */
export async function placeOrder(orderData) {
  const newOrder = {
    ...orderData,
    status: "paid",
    fulfillment: "preparing",
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(ordersRef, newOrder);
  return { id: ref.id, ...newOrder };
}

/** Update order fulfillment status (e.g. "preparing" → "dispatched") */
export async function updateOrderStatus(orderId, fulfillment) {
  await updateDoc(doc(db, "orders", orderId), { fulfillment });
}

/**
 * Real-time listener — fires callback every time orders change in Firestore.
 * Returns an unsubscribe function; call it to stop listening.
 *
 * Usage:
 *   const unsub = subscribeToOrders((orders) => console.log(orders));
 *   // later: unsub();
 */
export function subscribeToOrders(callback) {
  const q = query(ordersRef, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(orders);
  });
}

// ============================================================
//  SEED HELPER  (run ONCE to push data.js mock data → Firestore)
// ============================================================
/**
 * Pushes all local mock data from data.js into Firestore.
 * Safe to re-run — updates existing docs by ID, creates if missing.
 *
 * How to run (browser console, one time only):
 *   import { seedFirestore } from '/src/firebase.js';
 *   seedFirestore();
 */
export async function seedFirestore() {
  const { DISTRICTS, STORES, PRODUCTS, INITIAL_ORDERS } = await import("./data.js");

  console.log("🌱 Seeding Firestore...");

  for (const district of DISTRICTS) {
    await updateDoc(doc(db, "districts", district.id), district).catch(() =>
      addDoc(collection(db, "districts"), district)
    );
  }
  console.log(`✅ ${DISTRICTS.length} districts seeded`);

  // Strip Three.js hex numbers — Firestore only supports standard JS types
  for (const store of STORES) {
    const { themeColor, ...fsStore } = store;
    await updateDoc(doc(db, "stores", store.id), fsStore).catch(() =>
      addDoc(collection(db, "stores"), fsStore)
    );
  }
  console.log(`✅ ${STORES.length} stores seeded`);

  for (const product of PRODUCTS) {
    const { boxColor, ...fsProduct } = product;
    await updateDoc(doc(db, "products", product.id), fsProduct).catch(() =>
      addDoc(collection(db, "products"), fsProduct)
    );
  }
  console.log(`✅ ${PRODUCTS.length} products seeded`);

  for (const order of INITIAL_ORDERS) {
    await updateDoc(doc(db, "orders", order.id), order).catch(() =>
      addDoc(collection(db, "orders"), order)
    );
  }
  console.log(`✅ ${INITIAL_ORDERS.length} orders seeded`);

  console.log("🎉 Firestore seeding complete!");
}
