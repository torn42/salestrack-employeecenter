import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FC } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

export const PrivateRoute: FC<PrivateRouteProps> = ({ children }: { children: JSX.Element }) => {
  const { isAuth } = useSelector((state: RootState) => state.auth);

  return isAuth ? children : <Navigate to="/signin" />;
};