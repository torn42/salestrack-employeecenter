import { FC } from 'react';

import styles from './Header.module.scss';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export const Header: FC = () => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return (
    <header className={styles.header}>
      <div className="wrapper">
        <h1>SalesTrack</h1>

        {isAuth &&
          <div className={styles.links}>
            <Link to="/profile">
              профиль
            </Link>
            <Link to="/employees">
              сотрудники
            </Link>
          </div>
        }
      </div>
    </header>
  );
};