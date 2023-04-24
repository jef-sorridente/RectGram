import { configureStore } from "@reduxjs/toolkit";

import auhtReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: auhtReducer,
    user: userReducer,
  },
});
