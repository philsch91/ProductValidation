import React from 'react';
import { AuthProvider } from './AuthProvider';

export type AuthContextProps = {
  isAuth: boolean;
  username?: string;
  token?: string;
  login?: () => void;
  logout?: () => void;
};

const userInfo: AuthContextProps = {
  isAuth: false,
  username: '',
  token: ''
}

//const AuthContext = React.createContext({});
//const AuthContext = React.createContext(userInfo);
const AuthContext = React.createContext<Partial<AuthContextProps>>(userInfo);
const AuthConsumer = AuthContext.Consumer;

export { AuthContext, AuthConsumer }
