import { FC, useEffect, useState } from 'react';

import styles from './Employees.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { fetchEmployees } from '@/store/employee/asyncAction.ts';
import { Employee } from '@/store/types.ts';
import { EmployeeCard } from '@components/EmployeeCard';
import { Modal } from '@/components/Modal';

export const Employees: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees } = useSelector((state: RootState) => state.employee);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, []);

  return (
    <div className="wrapper">
      <div className="page">
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
        <h1 className={styles.title}>Сотрудники</h1>
        <button
          className={styles.add}
          onClick={() => setIsOpen(!isOpen)}
        >
          Добавить
        </button>
        <div className={styles.cards}>
          {employees.map((employee: Employee, index: number) => <EmployeeCard key={index} {...employee} />)}
        </div>
      </div>
    </div>
  );
};