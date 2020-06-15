import React from 'react';

import { NewTransactionForm } from './NewTransactionForm';
import { TransactionList } from './TransactionList';

import { Transaction } from '../models/transaction';

interface Props {
    transaction: Transaction;
    transactions: Transaction[];
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeTo: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
    onDelete: (transaction: Transaction) => void;
}

export class TransactionComponent extends React.Component<Props> {

    constructor(props: Props){
        super(props);
        this.state={
            errors:[]
        }
    }
    
    render(){
        return (
            <div>
                <h2>Transactions</h2>
                <NewTransactionForm
                    transaction={this.props.transaction}
                    onChange={this.props.onChange}
                    onChangeTo={this.props.onChangeTo}
                    onChangeValue={this.props.onChangeValue}
                    onAdd={this.props.onAdd}
                />
                <TransactionList transactions={this.props.transactions} onDelete={this.props.onDelete} />
            </div>
        );
    }
}
