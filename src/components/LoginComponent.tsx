import React from 'react';

import { LoginForm } from './LoginForm';

interface Props {
    onClick: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoggedIn: boolean;
}

export class LoginComponent extends React.Component<Props> {
    
    constructor(props: Props){
        super(props);
        this.state={
            errors:[]
        }
    }

    render(){
        return (
            <div>
                <h2>Login</h2>
                <LoginForm isLoggedIn={this.props.isLoggedIn} onClick={this.props.onClick}/>
            </div>
           //<div></div>
        );
    }
}
