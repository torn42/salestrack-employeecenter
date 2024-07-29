import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee, EmployeeState, Status } from '../types';
import { fetchEmployees, postEmployee } from '@/store/employee/asyncAction.ts';

const initialState: EmployeeState = {
  status: Status.LOADING,
  employees: [],
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(fetchEmployees.fulfilled, (state, action: PayloadAction<Employee[]>) => {
        state.status = Status.SUCCESS;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.status = Status.ERROR;
        state.employees = [];
      })
      .addCase(postEmployee.pending, (state) => {
        state.status = Status.LOADING;
      })
      .addCase(postEmployee.fulfilled, (state, action: PayloadAction<Employee>) => {
        state.status = Status.SUCCESS;
        state.employees = [...state.employees, action.payload];
      })
      .addCase(postEmployee.rejected, (state) => {
        state.status = Status.ERROR;
      });
  },
});

export default employeeSlice.reducer;