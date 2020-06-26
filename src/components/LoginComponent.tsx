import React from 'react';

import { LoginForm } from './LoginForm';
import { AccountForm } from './AccountForm';
import { AccountList } from './AccountList';

import { Account } from '../lib/interfaces/account';

interface State {

}

interface Props {
    address: string;
    privateKey: string;
    accounts: Account[];
    onAddressChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onPrivatKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: (event: React.FormEvent<HTMLFormElement>) => void;
    onSwitch: (event: React.FormEvent<HTMLFormElement>) => void;
    onAccountChange: (account: Account) => void;
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
                <AccountForm privateKey={this.props.privateKey} 
                    onPrivateKeyChange={this.props.onPrivatKeyChange}
                    onSwitch={this.props.onSwitch} />
                <AccountList accounts={this.props.accounts} onChange={this.props.onAccountChange} />
            </div>
           //<div></div>
        );
    }
}
