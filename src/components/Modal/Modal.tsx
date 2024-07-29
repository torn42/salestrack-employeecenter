import React, { FC, useEffect, useState } from 'react';

import styles from './Modal.module.scss';
import { AppDispatch } from '@/store';
import { useDispatch } from 'react-redux';
import { postEmployee } from '@/store/employee/asyncAction.ts';

export interface ModalProps {
  isOpen: boolean,
  setIsOpen: (bool: boolean) => void;
}

export const Modal: FC<ModalProps> = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [employeeData, setEmployeeData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phoneNumber: '',
    salary: '',
    email: '',
    schedule: '',
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

  const { lastName, firstName, middleName, phoneNumber, email, salary, schedule } = employeeData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    const user = {
      fullName: `${lastName} ${firstName} ${middleName}`,
      phoneNumber,
      email,
      salary: Number(salary),
      schedule,
      added: false,
    };
    dispatch(postEmployee(user));
    setEmployeeData({
      lastName: '',
      firstName: '',
      middleName: '',
      phoneNumber: '',
      salary: '',
      email: '',
      schedule: '',
    });
    setIsOpen(false);
  };

  const isValidPhoneNumber = /^\+?[1-9]\d{10}$/.test(phoneNumber);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const isFormComplete = lastName && firstName && middleName && phoneNumber && email && isValidEmail && isValidPhoneNumber && salary;
    console.log(isFormComplete);
    setIsButtonDisabled(!isFormComplete);
  }, [email, firstName, isValidEmail, isValidPhoneNumber, lastName, middleName, phoneNumber, schedule, salary]);

  return (
    <div className={isOpen ? `${styles.modal} ${styles.active}` : `${styles.modal}`}>
      <div className={styles.content}>
        <h1>Добавить сотрудника</h1>
        <div className={styles.fullform}>
          <div className={styles.form}>
            <div>
              <p>Фамилия</p>
              <input
                type="text"
                name="lastName"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p>Имя</p>
              <input
                type="text"
                name="firstName"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <p>Отчество</p>
              <input
                type="text"
                name="middleName"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.form}>
            <div>
              <p>Номер</p>
              <input
                type="text"
                name="phoneNumber"
                onChange={handleInputChange}
              />
              {(!isValidPhoneNumber && phoneNumber) &&
                <div className={styles.error}>
                  Неверный формат номера телефона (10 цифр).
                </div>
              }
            </div>
            <div>
              <p>Почта</p>
              <input
                type="text"
                name="email"
                onChange={handleInputChange}
              />
              {(!isValidEmail && email) &&
                <div className={styles.error}>
                  Неверный формат почты.
                </div>
              }
            </div>
            <div>
              <p>Оклад (тг.)</p>
              <input
                type="text"
                name="salary"
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.schedule}>
              <p>График работы</p>
              <select name="" id="" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEmployeeData({
                ...employeeData,
                schedule: e.target.value,
              })}>
                <option value="">2/2</option>
                <option value="">5/2</option>
                <option value="">1/1</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.button}>
          <button onClick={() => setIsOpen(false)}>Отмена</button>
          <button className={styles.add} disabled={isButtonDisabled} onClick={handleAdd}>Добавить</button>
        </div>
      </div>
    </div>
  );
};