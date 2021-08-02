import React from 'react';

import { Web3NodeManager } from '../helpers/Web3NodeManager';
import { Transaction } from '../models/transaction';

interface Props {
    transaction: Transaction;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeTo: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeGasPrice: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
}

interface State {
    transaction: Transaction;
}

export class NewTransactionForm extends React.Component<Props, State> {

    constructor(props: Props){
        super(props);
        this.state = {
            transaction: this.props.transaction
        }
    }

    /**
     *
     * @param event: React.FormEvent<HTMLFormElement>
     * @param event: React.MouseEvent<HTMLInputElement, MouseEvent>
     */
     private onClickCalculateGasPrice = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        console.log("NewTransactionForm.onClickCalculateGasPrice");
        //console.log(this.state.account?.privateKey);
        // if LoginComponent.onClickReadAccounts() is not called and LoginComponents.accounts is not set
        if (this.state.transaction === null) {
            console.log("this.state.transaction === null");
            return;
        }

        const web3Manager = Web3NodeManager.getInstance();
        /*
        const averageGasPricePromise = web3Manager.getLatestAverageGasPriceAsync(10);
        averageGasPricePromise.then((value: number) => {
            console.log("average gas price: " + value);
        }); */

        web3Manager.getLatestAverageGasPrice(10, (error?: Error, gasPrice?: number) => {
            if (error) {
                console.log("error: " + error);
                return;
            }
            console.log("average gas price: " + gasPrice);
            //this.state.transaction.gasPrice = gasPrice;
            this.props.transaction.gasPrice = gasPrice;
        });
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
            <p>Gas Price:</p>
            {/* <input onChange={this.props.onChangeGasPrice} defaultValue={"" + this.state.transaction.gasPrice} /> */}
            <input onChange={this.props.onChangeGasPrice} value={"" + this.props.transaction.gasPrice} />
            <input type="button" onClick={this.onClickCalculateGasPrice} value="Get Average Gas Price" />
            <button type="submit">Send transaction</button>
            </form>
        );
    }
}