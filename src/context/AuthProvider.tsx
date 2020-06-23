import React from 'react';
import { AuthContext, AuthContextProps } from './AuthContext';

/*
export type AuthProviderProps = {
    isAuth: boolean;
    username?: string;
    token?: string;
    login?: () => void;
    logout?: () => void;
};
*/

/**
 * AuthProvider should be always enclosed by a <Router></Router>
 * The AuthProvider should then enclose the <Route path="/" component={Component} />
 */
export class AuthProvider extends React.Component<AuthContextProps, {}> {
    state = { isAuth: false }

    constructor(props: AuthContextProps) {
        super(props);

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login() {
        console.log("login");
        setTimeout(() => this.setState({ isAuth: true }), 1000);
    }

    logout() {
        this.setState({ isAuth: false });
    }

    render() {
        return (
            <AuthContext.Provider
                value={{
                isAuth: this.state.isAuth,
                login: this.login,
                logout: this.logout
                }}
            >
            {this.props.children}
            </AuthContext.Provider>
        );
    }

}