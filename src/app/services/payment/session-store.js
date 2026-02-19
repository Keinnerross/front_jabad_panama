const TTL_MS = 2 * 60 * 60 * 1000; // 2 hours
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

const store = new Map();

// Periodic cleanup of expired entries
let cleanupTimer = null;

function ensureCleanup() {
  if (cleanupTimer) return;
  cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now - entry.createdAt > TTL_MS) {
        store.delete(key);
      }
    }
    // Stop interval if store is empty
    if (store.size === 0) {
      clearInterval(cleanupTimer);
      cleanupTimer = null;
    }
  }, CLEANUP_INTERVAL_MS);
  // Allow Node to exit even if interval is active
  if (cleanupTimer.unref) cleanupTimer.unref();
}

export function storeSession(orderId, data) {
  store.set(orderId, { data, createdAt: Date.now() });
  ensureCleanup();
}

export function retrieveSession(orderId) {
  const entry = store.get(orderId);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > TTL_MS) {
    store.delete(orderId);
    return null;
  }
  return entry.data;
}

export function removeSession(orderId) {
  store.delete(orderId);
}
