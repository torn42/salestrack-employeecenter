import { FC } from 'react';

import styles from './Profile.module.scss';
import usericon from '@/assets/user_icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { logout } from '@/store/auth/authSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const logoutProfile = () => {
    dispatch(logout());
    localStorage.removeItem('user');
  };

  console.log(user);

  if (user !== null) return (
    <div className={styles.profile}>
      <div className={styles['profile__left']}>
        <img src={usericon} alt="" />
        <button onClick={logoutProfile}>Выйти</button>
      </div>
      <div className={styles['profile__right']}>
        <div>ФИО</div>
        <p>{user.fullName}</p>
        <div>Почта</div>
        <p>{user.email}</p>
        <div>Телефон</div>
        <p>{user.phoneNumber}</p>
      </div>
    </div>
  );
};