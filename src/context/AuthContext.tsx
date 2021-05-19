import React, { FormEvent } from 'react';
//import { AuthProvider } from './AuthProvider';

export type AuthContextProps = {
  isAuth: boolean;
  username?: string;
  token?: string;
  changeUsername?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  login?: (event: React.FormEvent<HTMLFormElement>) => void;
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
