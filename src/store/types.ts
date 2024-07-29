export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface User {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

export interface Employee {
  fullName: string;
  phoneNumber: string;
  email: string;
  salary: number;
  schedule: string;
  added: boolean;
}

export interface AuthState {
  isAuth: boolean;
  user: User | null;
}

export interface EmployeeState {
  status: Status;
  employees: Employee[];
}