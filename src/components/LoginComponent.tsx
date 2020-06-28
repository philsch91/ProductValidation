import React from 'react';

import { LoginForm } from './LoginForm';
import { AccountForm } from './AccountForm';

import { Account } from '../lib/interfaces/account';

interface State {

}

interface Props {
    address: string;
    onAddressChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: (event: React.FormEvent<HTMLFormElement>) => void;
    //onAccountChange: (account: Account) => void;
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
                <LoginForm address={this.props.address} onAddressChange={this.props.onAddressChange}
                    onClick={this.props.onClick}/>
            </div>
           //<div></div>
        );
    }
}
