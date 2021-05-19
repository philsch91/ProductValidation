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
export class AuthProvider extends React.Component<{}/*AuthProviderProps*/, {}> {
    state = { isAuth: false, username: "" }

    constructor(props: any /*AuthContextProps*/) {
        super(props);

        this.changeUsername = this.changeUsername.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    public changeUsername(event: React.ChangeEvent<HTMLInputElement>): void {
        console.log("changeUsername");
        this.setState({username: event.target.value});
    }

    public login(event: React.FormEvent<HTMLFormElement>): void {
        console.log("login");
        //setTimeout(() => this.setState({ isAuth: true }), 1000);
        this.setState({isAuth: true});
    }

    public logout(): void {
        this.setState({ isAuth: false });
    }

    render() {
        return (
            <AuthContext.Provider
                value={{
                isAuth: this.state.isAuth,
                username: this.state.username,
                changeUsername: this.changeUsername,
                login: this.login,
                logout: this.logout
                }}
            >
            {this.props.children}
            </AuthContext.Provider>
        );
    }

}