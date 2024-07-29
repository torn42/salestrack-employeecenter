import { FC } from 'react';

import styles from './EmployeeCard.module.scss';
import user from '@/assets/user_icon.png';

export interface EmployeeCardProps {
  fullName: string;
  phoneNumber: string;
  email: string;
  salary: number;
  schedule: string;
  added: boolean;
}

export const EmployeeCard: FC<EmployeeCardProps> = ({ fullName, phoneNumber, email, salary, schedule, added }) => {
  const lastName = fullName.split(' ')[0];
  const firstName = fullName.split(' ')[1];
  const middleName = fullName.split(' ')[2];

  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={user} alt="" />
      </div>
      <div className={styles.fullname}>
        <p>{lastName}</p>
        <p>{firstName}</p>
        <p>{middleName}</p>
      </div>
      <div>
        Номер: {phoneNumber}
      </div>
      <div>
        Почта: {email}
      </div>
      <div>
        Зарплата: {salary}
      </div>
      <div>
        Смена: {schedule}
      </div>

      {added
        ? <div className={styles.added}>Принято</div>
        : <div className={styles.notAdded}>Не принято</div>
      }
    </div>
  );
};