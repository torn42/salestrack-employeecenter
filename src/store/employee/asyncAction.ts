import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Employee } from '@/store/types.ts';

export const fetchEmployees = createAsyncThunk(
  'employee/fetchEmployees',
  async () => {
    const response = await axios.get('https://d53efea2eafa07e5.mokky.dev/employees');
    return response.data;
  },
);

export const postEmployee = createAsyncThunk(
  'employee/addEmployee',
  async (user: Employee) => {
    const response = await axios.post('https://d53efea2eafa07e5.mokky.dev/employees', user);
    console.log(response.data);
    return response.data;
  },
);