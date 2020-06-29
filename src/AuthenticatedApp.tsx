import React from 'react';
import {Route, NavLink, HashRouter} from "react-router-dom";
import Web3 from 'web3';
import {Contract, ContractSendMethod, SendOptions, DeployOptions} from 'web3-eth-contract';

import {HomeComponent} from './components/HomeComponent';
import {LoginComponent} from './components/LoginComponent';
import {TransactionComponent} from './components/TransactionComponent';
import {ProductComponent} from './components/ProductComponent';
import {DealComponent} from './components/DealComponent';

import {Transaction} from './models/transaction';
import {Product} from './models/product';
import {Deal} from './models/deal';

import {Web3NodeManager} from './helpers/Web3NodeManager';
import {AccountDelegate} from './lib/interfaces/AccountDelegate';
import * as dealContract from './static/DealContract.json';
import * as productContract from './static/ProductContract.json'
import * as productContractJson from './static/Product.json'
import {PRODUCT_CONTRACT_ADDRESS, OWNER_ADDRESS} from './static/constants'

import './App.css';

interface State {
    account: string | null;
    accounts: string[];
    newTransaction: Transaction;
    transactions: Transaction[];
    newDeal: Deal;
    deals: Deal[];
    newProduct: Product;
    products: Product[];
    loading: boolean;
}


class AuthenticatedApp extends React.Component<{}, State, AccountDelegate> {
    //web3: Web3;

    state = {
        account: null,
        accounts: [],
        newTransaction: {
            from: "",
            id: 0,
            name: ""
        },
        transactions: [],
        newDeal: {
            id: 0,
            name: "",
            buyer: "",
            courier: ""
        },
        deals: [],
        newProduct: {
            id: 0,
            name: "",
            company: ""
        },
        products: [],
        loading: false
    };


    constructor(props: any) {
        super(props);
        //8546
        this.addProduct = this.addProduct.bind(this);
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
                                this.state.account == null || (OWNER_ADDRESS != this.state.account) ? "" : <NavLink to="/products">Products</NavLink>
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
                                                  transaction={this.state.newTransaction}
                                                  onChange={this.handleTransactionChange}
                                                  onChangeTo={this.handleTransactionChangeTo}
                                                  onChangeValue={this.handleTransactionChangeValue}
                                                  onAdd={this.addTransaction}
                                                  transactions={this.state.transactions}
                                                  onDelete={this.deleteTransaction}
                            />} /*component={TransactionComponent}*/ />
                        <Route path="/deals" render={props =>
                            <DealComponent {...props}
                                           deal={this.state.newDeal}
                                           deals={this.state.deals}
                                           onChangeBuyer={this.handleNewProductChangeBuyer}
                                           onAdd={this.addProductDeal}
                            />}/>
                        <Route path="/products" render={props =>
                            <ProductComponent {...props}
                                              account={this.state.account}
                                              product={this.state.newProduct}
                                              products={this.state.products}
                                              onChangeProductName={this.changeProductName}
                                              onChangeProductCompany={this.changeProductCompany}
                                              onAdd={this.addProduct}
                                              onDeploy={this.deployProduct}
                                              loading={this.state.loading}
                            />
                        }/>
                    </div>
                </div>
            </HashRouter>
        );
    }

    private loadContract(): Contract{
        return new (Web3NodeManager.getInstance().eth.Contract)(JSON.parse(JSON.stringify(productContractJson.abi)), PRODUCT_CONTRACT_ADDRESS)
    }

    private handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            account: event.target.value
            /*
            address: {
              ...this.state.address,
              name: event.target.value
            } */
        });
    };

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


    private addTransaction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        var transaction = this.state.newTransaction;

        const web3Manager = Web3NodeManager.getInstance();
        var receipt = web3Manager.eth.sendTransaction(transaction);
        console.log(receipt);

        this.setState(previousState => ({
            newTransaction: {
                id: previousState.newTransaction.id + 1,
                name: "",
                from: ""
            },
            transactions: [...previousState.transactions, previousState.newTransaction]
        }));
    };

    private handleTransactionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newTransaction: {
                ...this.state.newTransaction,
                name: event.target.value
            }
        });
    };

    private handleTransactionChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newTransaction: {
                ...this.state.newTransaction,
                to: event.target.value
            }
        });
    };

    private handleTransactionChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newTransaction: {
                ...this.state.newTransaction,
                value: event.target.value
            }
        });
    };

    private deleteTransaction = (transactionToDelete: Transaction) => {
        this.setState(previousState => ({
            transactions: [
                //...previousState.transactions.filter(transaction => transaction.id !== transactionToDelete.id)
                ...previousState.transactions.filter(transaction => transaction.id !== transactionToDelete.id)
            ]
        }));
    };

    /* private handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       this.setState({
         account: {
           ...this.state.account,
           name: event.target.value
         }
       });
     };*/


    /*public balanceDidChange(manager: Web3Manager, updatedAccount: String) {
      console.log(updatedAccount);
      var account: String = this.state.account;
      account.balance = updatedAccount.balance;
      this.setState(previousState => ({
        //account: updatedAccount
        account: account
      }));
    }*/

    /*private getAccounts = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const web3Manager = Web3NodeManager.getInstance();

      web3Manager.eth.getAccounts((error: Error, accounts: string[]) => {
        var accountList:Account[] = new Array(accounts.length)
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
    };*/

    private handleNewProductChangeBuyer = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newDeal: {
                ...this.state.newDeal,
                buyer: event.target.value
            }
        });
    };

    private addProductDeal = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        var product = this.state.newDeal;

        /**
         * It is not possible to use node.js 'fs' in the browser
         * and have it directly affect the file system on the server.
         * https://stackoverflow.com/questions/29762282/using-node-jss-file-system-functions-from-a-browser
         */

        //const abiPath = path.resolve(__dirname, "contracts", "Deal_sol_Deal.abi");
        //const abiPath = path.join("./", "contracts", "Deal_sol_Deal.abi");
        //console.log(abiPath);
        //const str = fs.readFileSync(path.join(__dirname, "filename.txt"), "utf-8");
        //const contractAbi = fs.readFileSync(abiPath, "utf-8");

        /*
        const fs = require('fs');

        let file = './static/DealContract.json';
        let fileStats = false;

        try {
          let fileStats = fs.statSync(file);
        } catch (error) {
          console.log(error.message);
          return false;
        }

        let dealContractJson = fs.readFileSync(file, 'utf8');
        let contract = JSON.parse(dealContractJson);
        */

        //print static import
        console.log(dealContract);

        const web3Manager = Web3NodeManager.getInstance();
        /*web3Manager.unlockAccountSync(this.state.account.address, this.state.account.privateKey, 600, (status: boolean) => {
          console.log("unlocked: " + status);
        });*/

        //workaround for compile time warning
        let json = JSON.stringify(dealContract.abi);
        let abi = JSON.parse(json);

        //var contract = new web3Manager.eth.Contract(dealContract.abi);
        //var contract = new web3Manager.eth.Contract(deal.abi);
        var contract = new web3Manager.eth.Contract(abi);
        //var contract = new Contract(dealContract.abi);  //no connection
        let byteCode = dealContract.bin

        var code = {
            data: byteCode,
            arguments: [this.state.newDeal.buyer]
        } as DeployOptions

        console.log(code.arguments)

        //TODO: combine ContractSendMethod.estimateGas() and .send() in web3Manager.send(gasPrice?: string)

        var sendMethod: ContractSendMethod = contract.deploy(code);

        sendMethod.estimateGas().then((estimatedGas: number) => {
            console.log("estimated gas: " + estimatedGas);
        });

        var options = {
            from: web3Manager.eth.defaultAccount,
            gas: 1625814,
            gasPrice: web3Manager.utils.toWei('0.000003', 'ether')
        } as SendOptions;

        console.log(options);

        var promise = sendMethod.send(options, (error: Error, transactionHash: string) => {
            if (error != null) {
                console.log(error);
                return;
            }
            console.log(transactionHash);
        });

        promise.then((newContract: Contract) => {
            contract.options.address = newContract.options.address;
            console.log(contract);
        });

        //var receipt = web3Manager.eth.sendTransaction(transaction);
        //console.log(receipt);

        this.setState(previousState => ({
            newDeal: {
                id: previousState.newDeal.id + 1,
                name: "",
                buyer: "",
                courier: ""
            },
            deals: [...previousState.deals, previousState.newDeal]
        }));
    };

    private changeProductName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newProduct: {
                ...this.state.newProduct,
                name: event.target.value
            }
        });
    };

    private changeProductCompany = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newProduct: {
                ...this.state.newProduct,
                company: event.target.value
            }
        });
    }

    /**
     *
     */
    private deployProduct = () => {
        console.log("deployProduct");

        const web3Manager = Web3NodeManager.getInstance();
        /*web3Manager.unlockAccountSync(this.state.account.address, this.state.account.privateKey, 600, (status: boolean) => {
          console.log("unlocked: " + status);
        });*/

        //workaround for compile time warning
        let json = JSON.stringify(productContract.abi);
        let abi = JSON.parse(json);

        var contract = new web3Manager.eth.Contract(abi);
        let byteCode = productContract.bin

        var deployOpts = {
            data: byteCode,
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

    /**
     * Adds a product to the blockchain
     */
    private addProduct = async () => {
        console.log("addProduct");

        var product = this.state.newProduct;

        const contract = this.loadContract();
        this.setState({loading: true});

        contract.methods.addProduct(product.name, product.company).send({from: this.state.account}).once('receipt', (receipt: any) => {
            this.setState({loading: false})
        }).catch((err: string) => {
            console.log("Failed with error: " + err);
            alert("Transaction has been reverted due to an error!")
            this.setState({loading: false})
        });
    };
}

export default AuthenticatedApp;