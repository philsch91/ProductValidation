import React from 'react';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-eth';

import { NewTransactionForm } from './NewTransactionForm';
import { TransactionList } from './TransactionList';

import { Web3NodeManager } from '../helpers/Web3NodeManager';
import { Transaction } from '../models/transaction';

interface Props {
    //transaction: Transaction;
    transactions: Transaction[];
    //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onChangeTo: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
    //onDelete: (transaction: Transaction) => void;
    onAddTransaction: (transaction: Transaction) => void;
}

interface State {
    newTransaction: Transaction;
    transactions: Transaction[];
}

export class TransactionComponent extends React.Component<Props, State> {

    constructor(props: Props){
        super(props);
        this.state={
            newTransaction: {
                id: 0
                //from: "",
                //name: ""
            },
            transactions: [],
        }
    }

    private addTransaction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        var transaction = this.state.newTransaction;
        console.log(transaction);

        const web3Manager = Web3NodeManager.getInstance();
        
        if (web3Manager.eth.defaultAccount != undefined) {
            transaction.from = web3Manager.eth.defaultAccount;
            console.log(transaction);
        }

        var tx = {from: transaction.from, 
            to: transaction.to, 
            value: transaction.value} as TransactionConfig
        
        var promise = web3Manager.eth.sendTransaction(tx,function(error: Error, hash: string){
            if (error == undefined) {
                console.log("transaction hash: " + hash);
                return;
            }
        });

        var transactionError: any | undefined = undefined;

        promise.then((receipt: any) => {
            console.log(receipt);
        }).catch((reason: any) => {
            console.log("error");
            console.log(reason);
            transactionError = reason;
        });

        if (transactionError != undefined) {
            return;
        }

        if (this.state.newTransaction.id == undefined) {
            this.state.newTransaction.id = 0;
        }

        this.setState(previousState => ({
            newTransaction: {
                id: previousState.newTransaction.id! + 1
            },
            transactions: [...previousState.transactions, previousState.newTransaction]
        }));

        this.props.onAddTransaction(transaction);
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
    
    render(){
        return (
            <div>
                <h2>Transactions</h2>
                <NewTransactionForm
                    transaction={this.state.newTransaction}
                    onChange={this.handleTransactionChange}
                    onChangeTo={this.handleTransactionChangeTo}
                    onChangeValue={this.handleTransactionChangeValue}
                    onAdd={this.addTransaction}
                />
                <TransactionList transactions={this.state.transactions} onDelete={this.deleteTransaction} />
            </div>
        );
    }
}
