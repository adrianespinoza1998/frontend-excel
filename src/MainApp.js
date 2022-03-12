import { useReducer, useEffect } from 'react'
import { AuthContext } from './components/auth/authContext';
import { AppRouter } from './components/router/AppRouter';
import { authReducer } from './components/auth/authReducer';

const init = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return {
      logged: false
    };
  }

  return user;
}

export const MainApp = () => {

  const [user, dispatch] = useReducer(authReducer, {}, init);

  useEffect(() => {
    if (!user) return;

    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      dispatch
    }}>
      <AppRouter />
    </AuthContext.Provider>
  )
}
