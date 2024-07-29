import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import employeeReducer from './employee/employeeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch