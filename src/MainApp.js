import { useReducer, useEffect, useState } from 'react'
import { AuthContext } from './components/auth/authContext';
import { AppRouter } from './components/router/AppRouter';
import { authReducer } from './components/auth/authReducer';
import { modeloReducer } from './components/modelo/modeloReducer';
import { ModeloContext } from './components/modelo/modeloContext';

const init = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    return {
      logged: false
    };
  }

  return user;
}

const initModelo = () => {
  const modelo = JSON.parse(localStorage.getItem('modelo'));
  if (!modelo) {
    return {
      loading: false
    };
  }

  return modelo;
}

export const MainApp = () => {

  const [user, dispatch] = useReducer(authReducer, {}, init);
  const [load, dispatchLoad] = useReducer(modeloReducer, {}, initModelo);

  useEffect(() => {
    if (!user) return;

    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if(!load) return;

    localStorage.setItem('modelo', JSON.stringify(load));
  }, [load]);

  return (
    <AuthContext.Provider value={{
      user,
      dispatch
    }}>
      <ModeloContext.Provider value={{
        load,
        dispatchLoad
      }}>
        <AppRouter />
      </ModeloContext.Provider>
    </AuthContext.Provider>
  )
}
