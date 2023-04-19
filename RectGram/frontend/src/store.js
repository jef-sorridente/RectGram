import { configureStore } from "@reduxjs/toolkit";

import auhtReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: auhtReducer,
  },
});
