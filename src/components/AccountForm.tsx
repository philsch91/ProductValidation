import React from 'react';

import { Web3NodeManager } from '../helpers/Web3NodeManager';
import { Account } from '../lib/interfaces/account';

interface AccountFormProps {
    account: Account | null;
    onSubmitPrivateKey: (event: React.FormEvent<HTMLFormElement>) => void;
}

interface AccountFormState {
    privateKey: string;
    errors: Error[];
}

export class AccountForm extends React.Component<AccountFormProps, AccountFormState> {
    
    constructor(props: AccountFormProps){
        super(props);
        this.state = {
            privateKey: "",
            errors: []
        }
        
        this.onChangePrivateKey = this.onChangePrivateKey.bind(this);
        this.onSubmitPrivateKey = this.onSubmitPrivateKey.bind(this);
    }
    /*
    private updatePrivateKey(account: Account | null) {
        if (account == null || account.privateKey == null) {
            return;
        }

        if (account.privateKey !== undefined) {
            account.p
        }
        this.setState(previousState => ({
            privateKey: account.privateKey
        }));
    } */

    private onChangePrivateKey(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(
            previousState => ({
                privateKey: event.target.value
        }));
        /*
        this.setState({
            privateKey: event.target.value
        }); */
    }

    private onSubmitPrivateKey = (event: React.FormEvent<HTMLFormElement>) => {
        this.props.onSubmitPrivateKey(event);
        if (this.props.account != null) {
            this.props.account.privateKey = this.state.privateKey;
        }
    }

    render() {
        return (
            <form onSubmit={this.onSubmitPrivateKey}>
            <input onChange={this.onChangePrivateKey} value={this.state.privateKey} />
            <button type="submit">Save</button>
            </form>
        );
    }
}
/*
export const AccountForm: React.FunctionComponent<Props> = ({ 
    privateKey, onPrivateKeyChange, onSwitch }) => (
    <form onSubmit={onSwitch}>
    <input onChange={onPrivateKeyChange} value={privateKey} />
    <button type="submit">Switch</button>
    </form>
); */
