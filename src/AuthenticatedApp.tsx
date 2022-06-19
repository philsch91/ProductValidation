import React from 'react';
import {Route, NavLink, HashRouter, Redirect} from "react-router-dom";
import Web3 from 'web3';
import {Contract, ContractSendMethod, SendOptions, DeployOptions} from 'web3-eth-contract';

import {HomeComponent} from './components/HomeComponent';
import {LoginComponent} from './components/LoginComponent';
import {TransactionComponent} from './components/TransactionComponent';
import {ProductComponent} from './components/ProductComponent';
import {DealComponent} from './components/DealComponent';
import {ProductValidationComponent} from "./components/ProductValidationComponent";
import {WalletDiv} from './components/WalletDiv';

import {Transaction} from './models/transaction';
import {Deal} from './models/deal';

import {Web3Session} from './lib/Web3Session';
import {Web3NodeManager} from './helpers/Web3NodeManager';
import {Account} from './lib/interfaces/account';
import {AccountDelegate} from './lib/interfaces/AccountDelegate';

import * as dealContract from './static/DealContract.json';
import * as productContract from './static/ProductContract.json'
import {OWNER_ADDRESS} from './static/constants'

import './App.css';
import { Console } from 'console';

interface State {
    //account: string | null;
    account: Account | null;
    //accounts: string[];
    transactions: Transaction[];
    deals: Deal[];
    loading: boolean;
}

class AuthenticatedApp extends React.Component<{}, State, AccountDelegate> {
    //web3: Web3;

    state: State = {
        account: null,
        //accounts: [],
        transactions: [],
        deals: [],
        loading: false
    };

    constructor(props: any) {
        super(props);
        this.onAddTransaction = this.onAddTransaction.bind(this);
        this.onAddDeal = this.onAddDeal.bind(this);
        this.onChangeAccount = this.onChangeAccount.bind(this);
        this.balanceDidChange = this.balanceDidChange.bind(this);
    }

    render() {
        //<button onClick={this.readAccounts}>Change</button>
        return (
            <HashRouter>
                <div>
                    <h1>Product Validation</h1>
                    <ul className="header">
                        <li><NavLink exact to="/">Home</NavLink></li>
                        <li>{this.state.account != null ? <button onClick={() => this.logout()}>Logout</button> : <NavLink to="/login">Login</NavLink>}</li>
                        <li>{this.state.account == null ? "" : <NavLink to="/transactions">Transactions</NavLink>}</li>
                        <li>{this.state.account == null || (OWNER_ADDRESS != this.state.account.address) ? "" : <NavLink to="/products">Add Products</NavLink>}</li>
                        <li>{this.state.account == null ? "" : <NavLink to="/validateProducts">Validate Products</NavLink>}</li>
                        <li>{this.state.account == null ? "" : <NavLink to="/deals">Deals</NavLink>}</li>
                    </ul>
                    <div className="content">
                        <WalletDiv account={this.state.account}/>
                        <Route exact path="/" component={HomeComponent}/>
                        <Route path="/login" render={props =>
                            <LoginComponent {...props}
                            //address={this.state.address}
                            //onAddressChange={this.handleAddressChange}
                            //privateKey={this.state.account.privateKey}
                            //onPrivatKeyChange={this.handlePrivateKeyChange}
                            //onSwitch={this.readAccounts} accounts={this.state.accounts}
                            account={this.state.account}
                            isLoggedIn={false}
                            onChangeAccount={this.onChangeAccount} />}/>
                        <Route path="/transactions" render={props => {
                            if (this.state.account == null) {
                                return ( <Redirect to={{pathname: "/login"}} /> )
                            }

                            return (
                                <TransactionComponent {...props}
                                  transactions={this.state.transactions}
                                  onAddTransaction={this.onAddTransaction}/>
                            )
                        }
                        }/>
                        <Route path="/deals" render={props => {
                            if (this.state.account == null) {
                                return ( <Redirect to={{pathname: "/login"}} /> )
                            }

                            return (
                                <DealComponent {...props}
                                  deals={this.state.deals}
                                  onAddDeal={this.onAddDeal}/>
                            )
                        }
                        }/>
                        <Route path="/products" render={props => {
                            if (this.state.account == null) {
                                return ( <Redirect to={{pathname: "/login"}} /> )
                            }

                            return (
                                <ProductComponent {...props}
                                  account={this.state.account.address}
                                  onDeploy={this.deployProduct}
                                  /*loading={this.state.loading} */ />
                            )
                        }
                        }/>
                        <Route path="/validateProducts" render={props => {
                            if (this.state.account == null) {
                                return (<Redirect to={{pathname: "/login"}} /> )
                            }

                            return (
                                <ProductValidationComponent {...props}
                                  account={this.state.account.address}/>
                            )
                        }
                        }/>
                    </div>
                </div>
            </HashRouter>
        );
    }

    private onAddTransaction(transaction: Transaction): void {
        this.setState(previousState => ({
            transactions: [...previousState.transactions, transaction]
        }));
    }

    private onAddDeal(deal: Deal): void {
        this.setState(previousState => ({
            deals: [...previousState.deals, deal]
        }));
    }

    /**
     *
     */
    private deployProduct = () => {
        console.log("deployProduct");

        const web3Manager = Web3NodeManager.getInstance();
        console.log(web3Manager.eth.defaultAccount);

        //workaround for compile time warning
        let json = JSON.stringify(productContract.abi);
        let abi = JSON.parse(json);

        var contract = new web3Manager.eth.Contract(abi);
        let byteCode = productContract.bin

        var deployOpts = {
            data: '0x' + byteCode,
            arguments: []
        } as DeployOptions

        var sendOpts = {
            //from: web3Manager.eth.defaultAccount, //set by Web3Manager
            //gas: 894198, // estimated by Web3Manager.deploy()
            gasPrice: web3Manager.utils.toWei('0.000003', 'ether')
        } as SendOptions;

        var promise = web3Manager.deploy(contract, deployOpts, sendOpts);

        promise.then((newContract: Contract | Error) => {
            if ((newContract instanceof Error)) {
                console.log(newContract.message);
                return;
            }

            contract.options.address = newContract.options.address;
            console.log("contract:");
            console.log(newContract);
            console.log("contract address: " + newContract.options.address);
        });
    };

    private onChangeAccount = (newAccount: Account) => {
        this.setState(previousState => ({
            account: newAccount
        }));
        const web3Manager = Web3NodeManager.getInstance();
        if (this.state.account != null) {
            web3Manager.account = this.state.account
        }
        web3Manager.accountDelegate = this;
        web3Manager.stopUpdatingAccount();
        web3Manager.startUpdatingAccount();
    };

    private logout() {
        const web3Manager = Web3NodeManager.getInstance();
        this.setState({
            account: null,
            //accounts: []
        });
        web3Manager.setProvider(null);
        return;
    }

    public balanceDidChange(session: Web3Session, updatedAccount: Account) {
        console.log(updatedAccount);
        var account: Account | null = this.state.account;
        if (account === null || account === undefined) {
            return;
        }
        account.balance = updatedAccount.balance;
        this.setState(previousState => ({
          //account: updatedAccount
          account: account
        }));
    }
}

export default AuthenticatedApp;