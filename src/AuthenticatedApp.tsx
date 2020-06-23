import React from 'react';
import logo from './logo.svg';
import { Route, NavLink, HashRouter } from "react-router-dom";
import Web3 from 'web3';
import { Contract, ContractOptions, ContractSendMethod, SendOptions, DeployOptions } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
//import * as fs from 'fs';
import * as path from 'path';

import { NewTransactionForm } from './components/NewTransactionForm';
import { TransactionList } from './components/TransactionList';
import { AccountList } from './components/AccountList';
import { WalletDiv } from './components/WalletDiv';
import { AccountForm } from './components/AccountForm';
import { LoginForm } from './components/LoginForm';
import { HomeComponent } from './components/HomeComponent';
import { LoginComponent } from './components/LoginComponent';
import { TransactionComponent } from './components/TransactionComponent';
import { ProductComponent } from './components/ProductComponent';
import { DealComponent } from './components/DealComponent';

import { Transaction } from './models/transaction';
import { Account } from './models/account';
import { Product } from './models/product';
import { Deal } from './models/deal';

import { Web3Manager } from './Web3Manager';
import { Web3NodeManager } from './helpers/Web3NodeManager';
import { AccountDelegate } from './interfaces/AccountDelegate';

import * as dealContract from './static/DealContract.json';
import deal from './static/DealContract.json';
import * as productContract from './static/ProductContract.json'

import './App.css';

interface State {
  address: String;
  account: Account
  accounts: Account[];
  newTransaction: Transaction;
  transactions: Transaction[];
  newDeal: Deal;
  deals: Deal[];
  newProduct: Product;
  products: Product[];
}

class AuthenticatedApp extends React.Component<{}, State, AccountDelegate> {
  //web3: Web3;
  state = {
    address: "",
    account: {
      name: "test",
      address: "",
      privateKey: "",
      balance: ""
    },
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
      name: ""
    },
    products: []
  };

  constructor(props: any){
    super(props);
    //8546
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
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/transactions">Transactions</NavLink></li>
            <li><NavLink to="/products">Products</NavLink></li>
            <li><NavLink to="/deals">Deals</NavLink></li>
          </ul>
          <div className="content">
            <WalletDiv account={this.state.account} />
            <Route exact path="/" component={HomeComponent} />
            <Route path="/login" render={props => 
              <LoginComponent {...props}
              address={this.state.address}
              onAddressChange={this.handleAddressChange}
              onClick={this.connect}
              privateKey={this.state.account.privateKey}
              onPrivatKeyChange={this.handlePrivateKeyChange}
              onSwitch={this.readAccounts} accounts={this.state.accounts}
              onAccountChange={this.changeAccount} />} />
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
              />} />
            <Route path="/products" render={props =>
              <ProductComponent {...props}
              product={this.state.newProduct}
              products={this.state.products}
              onChangeName={this.changeProductName}
              onAdd={this.addProduct} />
            } />
          </div>
        </div>
      </HashRouter>
    );
  }

  private handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      address: event.target.value
      /*
      address: {
        ...this.state.address,
        name: event.target.value
      } */
    });
  };

  private handlePrivateKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    var account: Account = this.state.account;
    account.privateKey = event.target.value;
    this.setState({
      account: account
    });
  }

  private connect = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const web3Manager = Web3NodeManager.getInstance();
    const provider = new Web3.providers.WebsocketProvider('ws://' + this.state.address);
    web3Manager.setProvider(provider);
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

  private handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      account: {
        ...this.state.account,
        name: event.target.value
      }
    });
  };

  private changeAccount = (newAccount: Account) => {
    newAccount.privateKey = this.state.account.privateKey;
    this.setState(previousState => ({
      account: newAccount
    }));

    const web3Manager = Web3NodeManager.getInstance();
    web3Manager.eth.defaultAccount = newAccount.address;
    web3Manager.accountDelegate = this;
    web3Manager.stopUpdatingAccount();
    web3Manager.startUpdatingAccount();
  };

  private readAccounts = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const web3Manager = Web3NodeManager.getInstance();
    
    //web3Manager.readAccounts((error: Error, accounts: Account[]) => {
    web3Manager.readAccountsAndBalances((error: Error, accounts: Account[]) => {
      this.setState(previousState => ({
        accounts: accounts
      }));
    }); 
  };

  public balanceDidChange(manager: Web3Manager, updatedAccount: Account) {
    console.log(updatedAccount);
    var account: Account = this.state.account;
    account.balance = updatedAccount.balance;
    this.setState(previousState => ({
      //account: updatedAccount
      account: account
    }));
  }

  private getAccounts = (event: React.FormEvent<HTMLFormElement>) => {
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
  };

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
    web3Manager.unlockAccountSync(this.state.account.address, this.state.account.privateKey, 600, (status: boolean) => {
      console.log("unlocked: " + status);
    });

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

    var promise = sendMethod.send(options,(error: Error, transactionHash: string) => {
      if(error != null){
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

  private addProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("addProduct");

    var product = this.state.newProduct;

    const web3Manager = Web3NodeManager.getInstance();
    web3Manager.unlockAccountSync(this.state.account.address, this.state.account.privateKey, 600, (status: boolean) => {
      console.log("unlocked: " + status);
    });

    //workaround for compile time warning
    let json = JSON.stringify(productContract.abi);
    let abi = JSON.parse(json);

    var contract = new web3Manager.eth.Contract(abi);
    
    let byteCode = productContract.bin

    var code = {
      data: byteCode,
      arguments: []
    } as DeployOptions

    var sendMethod: ContractSendMethod = contract.deploy(code);

    sendMethod.estimateGas().then((estimatedGas: number) => {
      console.log("estimated gas: " + estimatedGas);
    });
    
    var options = {
      from: web3Manager.eth.defaultAccount,
      gas: 894198,
      gasPrice: web3Manager.utils.toWei('0.000003', 'ether')
    } as SendOptions;

    var promise = sendMethod.send(options,(error: Error, transactionHash: string) => {
      if(error != null){
        console.log(error);
        return;
      }
      console.log(transactionHash);
    });

    promise.then((newContract: Contract) => {
      contract.options.address = newContract.options.address;
      console.log(contract);

      newContract.methods.addProduct('Name','Company').estimateGas({from: web3Manager.eth.defaultAccount})
        .then(function(gasAmount: Number){
          console.log("gasAmount for send(): " + gasAmount);
          
          //gasPrice: String
          //gas: Number
          newContract.methods.addProduct('Name','Company').send({from: web3Manager.eth.defaultAccount, gasPrice: gasAmount})
          .then(function(receipt: Object){
            console.log(receipt);
          });
        })
        .catch(function(error: Error){
          console.log(error);
        });
      
    });

  };
}

export default AuthenticatedApp;