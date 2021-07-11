import React from 'react';
import Web3 from 'web3';
import { Accounts } from 'web3-eth-accounts';

import { Web3NodeManager } from '../helpers/Web3NodeManager';
import { Account } from '../lib/interfaces/account';

interface LoginFormProps {
    //address: string;
    account: Account | null;
    //onAddressChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onClickReadAccounts: (event: React.FormEvent<HTMLFormElement>) => void;
    onClickReadAccounts: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
    onClickPrivateKey: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
}

interface LoginFormState {
    address: string;
    privateKey: string;
    accounts: Account[];
    errors: Error[];
}

export class LoginForm extends React.Component<LoginFormProps, LoginFormState> {

    constructor(props: LoginFormProps){
        super(props);
        this.state = {
            address: "",
            privateKey: "",
            accounts: [],
            errors: []
        }

        this.connect = this.connect.bind(this);
        this.onChangeAddress = this.onChangeAddress.bind(this);
        this.onChangePrivateKey = this.onChangePrivateKey.bind(this);
        this.onClickPrivateKey = this.onClickPrivateKey.bind(this);
        this.loadAccounts = this.loadAccounts.bind(this);
    }

    private onChangeAddress(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        console.log(event.target.value);
        /**
         * Method 1
         */
        this.setState({
          address: event.target.value
        });

        /**
         * Method 2
         * not working with string
        this.setState({
            address: {
              ...this.state.address,
              name: event.target.value
            }
        }); */

        /*
         * Method 3
        this.setState(previousState => ({
            address: event.target.value
        }));
        */
    };

    private onChangePrivateKey(event: React.ChangeEvent<HTMLInputElement>) {
        //event.preventDefault();
        //console.log(event.target.value);
        this.setState({
            privateKey: event.target.value
        });
        /*
        this.setState(
            previousState => ({
                privateKey: event.target.value
        }));
        */
    }

    /**
     *
     * @param event: React.FormEvent<HTMLFormElement>
     * @param event: React.MouseEvent<HTMLInputElement, MouseEvent>
     */
    private onClickPrivateKey = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        if (this.props.account == null) {
            //return;
            // if LoginComponent.onClickReadAccounts() is not called and LoginComponents.accounts is not set
            const web3Manager = Web3NodeManager.getInstance();
            let ethAccount: any = web3Manager.eth.accounts.privateKeyToAccount(this.state.privateKey);
            let account = { address: ethAccount.address, privateKey: ethAccount.privateKey } as Account;
            web3Manager.account = account;
            this.props.onClickPrivateKey(event);
            return;
        }
        this.props.account.privateKey = this.state.privateKey;
        this.props.onClickPrivateKey(event);
    }

    /**
     * Connects to a web3 instance, like Metamask, and sets the wallet adress(es) in the state
     */
    private async connect() {
        const web3Manager = Web3NodeManager.getInstance();

        /**
         * Web3 assigns window.ethereum to Web3.givenProvider property
         * if the provider is ERC1193 compliant (as MetaMask)
         * web3.currentProvider is the provider that web3 was initialized with
         * web3.givenProvider is the provider injected by the environment (like window.ethereum)
         * https://stackoverflow.com/questions/55822581/what-is-the-difference-between-currentprovider-and-givenprovider-in-web3-js
         * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
         */

        if ((web3Manager.currentProvider === null || web3Manager.currentProvider === undefined)
            && this.state.address === "") {
            if ((window as any).ethereum) {
                // use MetaMask as provider
                web3Manager.setProvider((window as any).ethereum);
                (window as any).ethereum.enable();
                console.log("window.ethereum.enable()");
                console.log("Enabled window.ethereum");
            } else if ((window as any).web3) {
                // use Mist as provider
                web3Manager.setProvider((window as any).web3);
                console.log("web3.setProvider(window.web3)");
                console.log('Set injected web3 as provider');
            }

            return;
        }

        console.log(this.state.address);
        //const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        let provider = null;
        if (this.state.address.startsWith("http://")) {
            provider = new Web3.providers.HttpProvider(this.state.address);
        } else if (this.state.address.startsWith('ws://')) {
            provider = new Web3.providers.WebsocketProvider(this.state.address);
        }

        web3Manager.setProvider(provider);

        // if no provider could be set
        if (!web3Manager.currentProvider) {
            //alert("Please install Metamask to continue!");
            return;
        }

        await this.loadAccounts();
    }

    /**
     * Loads accounts from the web3 instance
     * deprecated
     */
    private async loadAccounts() {
        const web3Manager = Web3NodeManager.getInstance();

        web3Manager.eth.getAccounts((error: Error, accounts: string[]) => {
            if (error !== null) {
                console.log(error);
                return;
            }
            var accountList: Account[] = new Array(accounts.length)
            var i = 0
            for(let key in accounts){
              const address: string = accounts[key];
              console.log(address);
              //let account: Account = {id:"0", name:"test"};
              //let account = {id:"0", name: "test"} as Account;
              let account = { name: i.toString(), address: address, privateKey: "", balance: "" } as Account;
              accountList[i] = account
              i++
            }

            //this.state.accounts = accountList
            this.setState(previousState => ({
              //accounts: [...previousState.accounts.filter(account => account.id !== accountToChange.id)]
              accounts: accountList
            }));
        });
    }

    render() {
        return (
            <form onSubmit={this.connect}>
            <label htmlFor="node-address">Address:</label><br />
            <input id="node-address" onChange={this.onChangeAddress} value={this.state.address} /><br />
            <label htmlFor="private-key">Private Key:</label><br />
            <input id="private-key" onChange={this.onChangePrivateKey} value={this.state.privateKey} /><br />
            <input type="button" onClick={this.props.onClickReadAccounts} value="Read Accounts" />
            <input type="button" onClick={this.onClickPrivateKey} value="Save Private Key" /><br />
            <button type="submit">Connect</button>
            </form>
        );
    }
}
