import React from 'react';

export type IAuthContext = {
  authenticated: boolean;
  setAuthenticated: (isAuthenticated: boolean) => void;
};

const noop = () => {};

export const AuthContext = React.createContext<IAuthContext>({
  authenticated: false,
  setAuthenticated: noop,
});
