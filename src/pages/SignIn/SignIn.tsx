import React, { FC, useEffect, useState } from 'react';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '@/store/auth/authSlice';

import styles from './SignIn.module.scss';
import { User } from '@/store/types';

export const SignIn: FC = () => {
  const { user: stateUser } = useSelector((state: RootState) => state.auth);

  const [loginData, setLoginData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { lastName, firstName, middleName, phoneNumber, email, password } = loginData;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const isValidPhoneNumber = /^\+?[1-9]\d{10}$/.test(phoneNumber);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const isFormComplete = lastName && firstName && middleName && phoneNumber && email && isValidEmail && isValidPhoneNumber && password;
    setIsButtonDisabled(!isFormComplete);
  }, [email, firstName, isValidEmail, isValidPhoneNumber, lastName, loginData, middleName, phoneNumber, password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setIsLoading(true); // Set loading state to true
    const fullName = `${loginData.lastName} ${loginData.firstName} ${loginData.middleName}`;
    const user: User = {
      fullName: fullName,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:8080/signin', { // Adjust the URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'logged in') {
          localStorage.setItem('user', JSON.stringify(stateUser));

          dispatch(login(user));
          navigate('/employees');
        } else {
          alert('Не удалось войти');
        }
      } else {
        alert('Не удалось войти');
      }
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="page">
        <h2 className={styles.title}>Авторизация</h2>
        <div className={styles.fullform}>
          <div className={styles.form}>
            <div>
              <p>Фамилия</p>
              <input value={loginData.lastName}
                     type="text"
                     name="lastName"
                     placeholder="Введите фамилию..."
                     onChange={handleInputChange}
              />
            </div>
            <div>
              <p>Имя</p>
              <input value={loginData.firstName}
                     type="text"
                     name="firstName"
                     placeholder="Введите имя..."
                     onChange={handleInputChange}
              />
            </div>
            <div>
              <p>Отчество</p>
              <input value={loginData.middleName}
                     type="text"
                     name="middleName"
                     placeholder="Введите отчество..."
                     onChange={handleInputChange}
              />
            </div>
          </div>
          <div className={styles.form}>
            <div>
              <p>Номер Телефона</p>
              <input value={loginData.phoneNumber}
                     type="text"
                     name="phoneNumber"
                     placeholder="+7-(777)-777-77-77"
                     onChange={handleInputChange}
              />
              {(!isValidPhoneNumber && phoneNumber) &&
                <div className={styles.form__error}>
                  Неверный формат номера телефона (10 цифр).
                </div>
              }
            </div>
            <div>
              <p>Почта</p>
              <input value={loginData.email}
                     type="text"
                     name="email"
                     placeholder="email@example.com"
                     onChange={handleInputChange}
              />
              {(!isValidEmail && email) &&
                <div className={styles.form__error}>
                  Неверный формат почты.
                </div>
              }
            </div>
            <div>
              <p>Пароль</p>
              <input value={loginData.password}
                     type="text"
                     name="password"
                     placeholder="Пароль"
                     onChange={handleInputChange}
              />
            </div>
            <div>
              <button onClick={handleLogin}
                      disabled={isButtonDisabled || isLoading}>{isLoading ? 'ВХОД...' : 'ВОЙТИ'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};