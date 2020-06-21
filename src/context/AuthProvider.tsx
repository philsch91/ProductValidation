import React from 'react';
import { usePrevious } from './usePrevious';
import { AuthContext } from './AuthContext';

export type AuthProviderProps = {
  defaultAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
};

class AuthProvider extends React.Component<{}, AuthProviderProps> {
    /*
    public static defaultProps: AuthProviderProps = {
        defaultAuthenticated = false,
        onLogout,
        onLogout,
        children,
    }; */

    constructor(props: AuthProviderProps){
        super(props);

        this.state = {
            defaultAuthenticated: props.defaultAuthenticated ?? false, 
            onLogin: props.onLogin, 
            onLogout: props.onLogout
        }

        //this.state = { defaultAuthenticated !== undefined ? defaultA :  false }
        //this.state
        //React.useState()
        //React.useMemo
      }

    return () {
        return (
            <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
        );
    }
}