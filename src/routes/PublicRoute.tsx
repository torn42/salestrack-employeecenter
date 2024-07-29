import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Navigate } from 'react-router-dom';

export interface PublicRouteProps {
  children: JSX.Element;
}

export const PublicRoute: FC<PublicRouteProps> = ({ children }) => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return isAuth ? <Navigate to="/employees" /> : children;
};