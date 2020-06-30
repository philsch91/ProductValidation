import React from 'react';
import { Transaction } from '../models/transaction';

interface Props {
    transaction: Transaction;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeTo: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
}

export class NewTransactionForm extends React.Component<Props, {}> {

    constructor(props: Props){
        super(props);
    }

    render(){
        return (
            <form onSubmit={this.props.onAdd}>
            <p>To:</p>
            <input onChange={this.props.onChangeTo} value={"" + this.props.transaction.to} />
            <p>Value (Wei):</p>
            <input onChange={this.props.onChangeValue} value={"" + String(this.props.transaction.value)} />
            <p>Textnote:</p>
            <input onChange={this.props.onChange} value={"" + this.props.transaction.name} />
            <button type="submit">Send transaction</button>
            </form>
        );
    }
}