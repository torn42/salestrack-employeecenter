import './App.scss';
import { Header } from '@/components/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useEffect } from 'react';
import { login } from './store/auth/authSlice';

function App() {
  const { isAuth } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    navigate('/signin');
    const userStorage = localStorage.getItem('user');
    if (userStorage && !isAuth) {
      dispatch(login(JSON.parse(userStorage)));
      navigate('/employees');
    }
  }, [dispatch, isAuth, navigate]);

  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}

export default App;