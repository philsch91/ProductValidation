import React from 'react';
import {Route, NavLink, HashRouter} from "react-router-dom";
import Web3 from 'web3';
import {TransactionConfig} from 'web3-eth';
import {Contract, ContractSendMethod, SendOptions, DeployOptions} from 'web3-eth-contract';

import {HomeComponent} from './components/HomeComponent';
import {LoginComponent} from './components/LoginComponent';
import {TransactionComponent} from './components/TransactionComponent';
import {ProductComponent} from './components/ProductComponent';
import {DealComponent} from './components/DealComponent';

import {Transaction} from './models/transaction';
import {Deal} from './models/deal';

import {Web3NodeManager} from './helpers/Web3NodeManager';
import {AccountDelegate} from './lib/interfaces/AccountDelegate';
import * as dealContract from './static/DealContract.json';
import * as productContract from './static/ProductContract.json'
import {OWNER_ADDRESS} from './static/constants'

import './App.css';

interface State {
    account: string | null;
    accounts: string[];
    transactions: Transaction[];
    deals: Deal[];
    loading: boolean;
}

class AuthenticatedApp extends React.Component<{}, State, AccountDelegate> {
    //web3: Web3;

    state = {
        account: null,
        accounts: [],
        transactions: [],
        deals: [],
        loading: false
    };


    constructor(props: any) {
        super(props);

        this.onAddTransaction = this.onAddTransaction.bind(this);
        this.onAddDeal = this.onAddDeal.bind(this);
    }

    render() {
        //<button onClick={this.readAccounts}>Change</button>
        return (
            <HashRouter>
                <div>
                    <h1>Product Validation</h1>
                    <ul className="header">
                        <li><NavLink exact to="/">Home</NavLink></li>

                        <li>
                            {
                                this.state.account != null ? <NavLink to="/logout">Logout</NavLink> :
                                    <NavLink to="/login">Login</NavLink>
                            }
                        </li>
                        <li>
                            {
                                this.state.account == null ? "" : <NavLink to="/transactions">Transactions</NavLink>
                            }
                        </li>
                        <li>
                            {
                                this.state.account == null || (OWNER_ADDRESS != this.state.account) ? "" :
                                    <NavLink to="/products">Products</NavLink>
                            }
                        </li>
                        <li>
                            {
                                this.state.account == null ? "" : <NavLink to="/deals">Deals</NavLink>
                            }
                        </li>

                    </ul>
                    <div className="content">
                        <Route exact path="/" component={HomeComponent}/>

                        <Route path="/login" render={props => {
                            if (this.state.account == null) {
                                return (
                                    <LoginComponent
                                        onClick={async (event) => {
                                            event.preventDefault();
                                            await this.connect();
                                        }}
                                        isLoggedIn={this.state.account != null}
                                    />
                                );
                            }
                        }
                        }
                        />
                        <Route path="/transactions" render={props =>
                            <TransactionComponent {...props}
                                                  transactions={this.state.transactions}
                                                  onAddTransaction={this.onAddTransaction}
                            />} /*component={TransactionComponent}*/ />
                        <Route path="/deals" render={props =>
                            <DealComponent {...props}
                                           deals={this.state.deals}
                                           onAddDeal={this.onAddDeal}
                            />}/>
                        <Route path="/products" render={props =>
                            <ProductComponent {...props}
                                              account={this.state.account}
                                              onDeploy={this.deployProduct}
                                              loading={this.state.loading}
                            />
                        }/>
                    </div>
                </div>
            </HashRouter>
        );
    }

    /**
     * Connects to a web3 instance, like Metamask, and sets the wallet adress(es) in the state
     */
    private connect = async () => {
        
        const web3Manager = Web3NodeManager.getInstance();

        /**
         * Web3 assigns window.ethereum to Web3.givenProvider property
         * if the provider is ERC1193 compliant (as MetaMask)
         * web3.currentProvider is the provider that web3 was initialized with
         * web3.givenProvider is the provider injected by the environment (like window.ethereum)
         * https://stackoverflow.com/questions/55822581/what-is-the-difference-between-currentprovider-and-givenprovider-in-web3-js
         * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
         */

        if (web3Manager.currentProvider == null) {
            if ((window as any).ethereum) {
                web3Manager.setProvider((window as any).ethereum);
                await (window as any).ethereum.enable();
                console.log("Enabled Metamask Provider");
            } else if ((window as any).web3) {
                // Use Mist/MetaMask's provider.
                await web3Manager.setProvider((window as any).web3);
                console.log('Injected web3 detected.');
            } else { //Only for debugging and should be removed in productive environments
                const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
                await web3Manager.setProvider(provider);
                console.log('No web3 instance injected, using Local web3.');
            }

            //If no provider could be set
            if (!web3Manager.currentProvider) {
                alert("Please install Metamask to continue!");
                return;
            }
            await this.loadAccounts();
            console.log(this.state.account);
            web3Manager.eth.defaultAccount = this.state.account;
        }
    }

    /**
     * Loads accounts from the web3 instance and sets them in the state
     */
    async loadAccounts() {
        const web3Manager = Web3NodeManager.getInstance();
        const accounts = await web3Manager.eth.getAccounts();
        this.setState({
            account: accounts[0],
            accounts: accounts
        });
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

        promise.then((newContract: Contract | null) => {
            if (newContract == null) {
                return;
            }

            contract.options.address = newContract.options.address;
            console.log("contract:");
            console.log(newContract);
            console.log("contract address: " + newContract.options.address);
        });
    };

}

export default AuthenticatedApp;