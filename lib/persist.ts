// src/lib/persist.ts
import storage from "redux-persist/lib/storage" // uses localStorage
import { persistReducer, persistStore } from "redux-persist"

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["isAuthenticated", "user"], // adjust as per your authSlice
}

export { persistReducer, persistStore, persistConfig }
