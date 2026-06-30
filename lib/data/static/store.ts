import * as seed from "./seed";

function deepClone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

let store: typeof seed | null = null;

export function getStaticStore() {
  if (!store) {
    store = deepClone(seed);
  }
  return store;
}

export function resetStaticStore() {
  store = null;
}
