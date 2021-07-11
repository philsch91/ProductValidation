import React from 'react';

import {LoginForm} from './LoginForm';
import {AccountForm} from './AccountForm';
import {AccountList} from './AccountList';

import {Web3NodeManager} from '../helpers/Web3NodeManager';
import {Account} from '../lib/interfaces/account';

interface Props {
    account: Account | null;
    isLoggedIn: boolean;
    onChangeAccount: (account: Account) => void;
}

interface LoginComponentState {
    account: Account | null;
    accounts: Account[];
    //accounts?: Account[];
    errors: Error[];
}

export class LoginComponent extends React.Component<Props, LoginComponentState> {
    
    constructor(props: Props){
        super(props);
        this.state = {
            account: null,
            accounts: [],
            errors: []
        }

        this.onClickReadAccounts = this.onClickReadAccounts.bind(this);
        this.onChangeAccount = this.onChangeAccount.bind(this);
        this.onClickPrivateKey = this.onClickPrivateKey.bind(this);
    }

    /**
     * Reads accounts and balances from the web3 instance and sets them in the state
     * @param event: React.FormEvent<HTMLFormElement>
     * @param event: React.MouseEvent<HTMLInputElement, MouseEvent>
     */
    private onClickReadAccounts = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        event.preventDefault();
        const web3Manager = Web3NodeManager.getInstance();

        //web3Manager.readAccounts((error: Error, accounts: Account[]) => {
        web3Manager.readAccountsAndBalances((error?: Error, accounts?: Account[]) => {
            if (typeof accounts === "undefined") {
                return;
            }
            this.setState(previousState => ({
                accounts: accounts
            }));
        });
    }

    private onChangeAccount = (newAccount: Account) => {
        if (this.state.account != null) {
            newAccount.privateKey = this.state.account.privateKey;
        }

        this.setState(previousState => ({
            account: newAccount
        }));

        const web3Manager = Web3NodeManager.getInstance();
        web3Manager.eth.defaultAccount = newAccount.address;

        this.props.onChangeAccount(newAccount);
        //web3Manager.accountDelegate = this;
        //web3Manager.stopUpdatingAccount();
        //web3Manager.startUpdatingAccount();
    }

    /**
     *
     * @param event: React.FormEvent<HTMLFormElement>
     * @param event: React.MouseEvent<HTMLInputElement, MouseEvent>
     */
    private onClickPrivateKey = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        console.log("LoginComponent.onSubmitPrivateKey");
        //console.log(this.state.account?.privateKey);
        // if LoginComponent.onClickReadAccounts() is not called and LoginComponents.accounts is not set
        const web3Manager = Web3NodeManager.getInstance();
        if (web3Manager.account !== undefined) {
            this.onChangeAccount(web3Manager.account);
        }

        if (this.state.account == null) {
            return;
        }
        console.log(this.state.account.privateKey);
        this.props.onChangeAccount(this.state.account);
    }

    render(){
        return (
            <div>
                <h2>Login</h2>
                <LoginForm
                    account={this.state.account}
                    onClickReadAccounts={this.onClickReadAccounts}
                    onClickPrivateKey={this.onClickPrivateKey}/>
                {/*
                <AccountForm
                    account={this.state.account}
                onSubmitPrivateKey={this.onClickPrivateKey} /> */}
                <AccountList accounts={this.state.accounts} onChangeAccount={this.onChangeAccount} />
            </div>
        );
    }
}
