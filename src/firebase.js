// ============================================================
//  Ready Mall Accra — Firebase Client SDK & Firestore Setup
//  Uses Firebase Web SDK v13 (modular / tree-shakeable)
//  Configured for instant local IndexedDB caching & real-time sync
// ============================================================

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
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
export const app = initializeApp(firebaseConfig);

let analyticsInstance = null;
try {
  analyticsInstance = getAnalytics(app);
} catch (e) {
  // Analytics can be blocked by ad-blockers, suppress safely
}
export const analytics = analyticsInstance;

// ── Initialize Firestore with Persistent Multi-Tab Local Cache ──
// This ensures that after the first load, everything loads in single-digit ms
// directly from IndexedDB local cache, providing the fastest experience.
let firestoreDb;
try {
  firestoreDb = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
  });
} catch (e) {
  console.info("Firestore multi-tab persistence fallback to default:", e?.message);
  firestoreDb = getFirestore(app);
}
export const db = firestoreDb;

// ============================================================
//  COLLECTION REFERENCES
// ============================================================
export const districtsRef = collection(db, "districts");
export const storesRef    = collection(db, "stores");
export const productsRef  = collection(db, "products");
export const ordersRef    = collection(db, "orders");

// ============================================================
//  DISTRICTS
// ============================================================
export async function getDistricts() {
  const snap = await getDocs(districtsRef);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================================
//  STORES
// ============================================================
export async function getStores() {
  const snap = await getDocs(storesRef);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      themeColor: data.themeColor ?? (data.hexColor ? parseInt(data.hexColor.replace('#', ''), 16) : 0xef4444)
    };
  });
}

export async function getStoresByDistrict(districtId) {
  const q = query(storesRef, where("districtId", "==", districtId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================================
//  PRODUCTS
// ============================================================
export async function getProducts() {
  const snap = await getDocs(productsRef);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      boxColor: data.boxColor ?? (data.color ? parseInt(data.color.replace('#', ''), 16) : 0xf59e0b)
    };
  });
}

export async function getProductsByStore(storeId) {
  const q = query(productsRef, where("storeId", "==", storeId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProduct(productId) {
  const snap = await getDoc(doc(db, "products", productId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    boxColor: data.boxColor ?? (data.color ? parseInt(data.color.replace('#', ''), 16) : 0xf59e0b)
  };
}

/** Add a new product to Firestore */
export async function addProduct(product) {
  const prodDoc = {
    ...product,
    createdAt: serverTimestamp(),
  };
  await setDoc(doc(db, "products", product.id), prodDoc, { merge: true });
  return prodDoc;
}

/** Decrement or set product stock after a purchase */
export async function updateProductStock(productId, newStock) {
  try {
    await updateDoc(doc(db, "products", productId), { stock: newStock });
  } catch (err) {
    console.warn("Could not update product stock in Firestore:", err);
  }
}

// ============================================================
//  ORDERS
// ============================================================
export async function getOrders() {
  try {
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    // If orderBy createdAt index is building or missing, fetch all docs
    const snap = await getDocs(ordersRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

export async function getOrdersByStore(storeId) {
  try {
    const q = query(
      ordersRef,
      where("storeId", "==", storeId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    const q = query(ordersRef, where("storeId", "==", storeId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

/** Place a new order into Firestore */
export async function placeOrder(orderData) {
  const newOrder = {
    ...orderData,
    status: orderData.status || "paid",
    fulfillment: orderData.fulfillment || "preparing",
    createdAt: serverTimestamp(),
  };
  // Store with explicit custom ID (e.g. ORD-1234) for consistency
  await setDoc(doc(db, "orders", orderData.id), newOrder, { merge: true });
  return newOrder;
}

/** Update order fulfillment status */
export async function updateOrderStatus(orderId, fulfillment) {
  await updateDoc(doc(db, "orders", orderId), { fulfillment });
}

/** Real-time listener for orders */
export function subscribeToOrders(callback) {
  try {
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(orders);
    }, (err) => {
      console.warn("Orders subscription fallback to standard query:", err);
      // Fallback without orderBy if index is pending
      return onSnapshot(ordersRef, (snap) => {
        const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(orders);
      });
    });
  } catch (e) {
    console.warn("subscribeToOrders encountered an issue:", e);
    return () => {};
  }
}

// ============================================================
//  ONE-TIME SEED HELPER (Populates Firestore with initial data)
// ============================================================
export async function seedFirestore() {
  const { DISTRICTS, STORES, PRODUCTS, INITIAL_ORDERS } = await import("./data.js");
  console.log("🌱 Auto-seeding Firestore database with Ready Mall data...");

  const promises = [];

  for (const district of DISTRICTS) {
    promises.push(setDoc(doc(db, "districts", district.id), district, { merge: true }));
  }

  for (const store of STORES) {
    promises.push(setDoc(doc(db, "stores", store.id), store, { merge: true }));
  }

  for (const product of PRODUCTS) {
    promises.push(setDoc(doc(db, "products", product.id), product, { merge: true }));
  }

  for (const order of INITIAL_ORDERS) {
    promises.push(setDoc(doc(db, "orders", order.id), order, { merge: true }));
  }

  await Promise.all(promises);
  console.log(`✅ Seeded ${DISTRICTS.length} districts, ${STORES.length} stores, ${PRODUCTS.length} products, ${INITIAL_ORDERS.length} orders into Firestore!`);

  return {
    districts: DISTRICTS,
    stores: STORES,
    products: PRODUCTS,
    orders: INITIAL_ORDERS,
    source: 'firestore-seeded'
  };
}

// ============================================================
//  MASTER LOADER: Loads all mall data from Database in parallel
// ============================================================
export async function loadMallData(onProgress) {
  if (onProgress) onProgress("Connecting to Firebase Cloud Database...", 20);

  try {
    // Parallel fetch from all collections
    const [districtsSnap, storesSnap, productsSnap, ordersSnap] = await Promise.all([
      getDocs(districtsRef),
      getDocs(storesRef),
      getDocs(productsRef),
      getDocs(ordersRef)
    ]);

    if (onProgress) onProgress("Parsing mall records & stalls...", 60);

    let districts = districtsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    let stores    = storesSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        themeColor: data.themeColor ?? (data.hexColor ? parseInt(data.hexColor.replace('#', ''), 16) : 0xef4444)
      };
    });
    let products  = productsSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        boxColor: data.boxColor ?? (data.color ? parseInt(data.color.replace('#', ''), 16) : 0xf59e0b)
      };
    });
    let orders    = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // If Firestore database has fewer than 20 stores, sync all 20 real vendors & products!
    if (stores.length < 20 || products.length < 20) {
      if (onProgress) onProgress("Syncing 20 real Accra vendors to Cloud Database...", 80);
      const seeded = await seedFirestore();
      if (onProgress) onProgress("Ready Mall Accra ready!", 100);
      return seeded;
    }

    if (onProgress) onProgress("Ready Mall Accra loaded from Database!", 100);
    console.log(`⚡ Loaded from Firestore database: ${stores.length} stores, ${products.length} products, ${orders.length} orders.`);

    return { districts, stores, products, orders, source: 'firestore' };
  } catch (err) {
    console.warn("⚠️ Firestore load error (database not initialized or offline). Falling back to offline dataset:", err);
    if (onProgress) onProgress("Loading Ready Mall offline dataset...", 80);
    const { DISTRICTS, STORES, PRODUCTS, INITIAL_ORDERS } = await import("./data.js");
    if (onProgress) onProgress("Ready Mall loaded!", 100);
    return {
      districts: DISTRICTS,
      stores: STORES,
      products: PRODUCTS,
      orders: INITIAL_ORDERS,
      source: 'offline-fallback'
    };
  }
}
