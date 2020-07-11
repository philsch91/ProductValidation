import React from 'react';
import { Contract, ContractSendMethod, SendOptions, DeployOptions } from 'web3-eth-contract';

import { DealForm } from './DealForm';
import { DealList } from './DealList';

import { Deal } from '../models/deal';

import {Web3NodeManager} from '../helpers/Web3NodeManager';
import * as dealContract from '../static/DealContract.json';

interface DealComponentProps {
    //deal: Deal;
    deals: Deal[];
    //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onChangeBuyer: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
    //onDelete: (deal: Deal) => void;
    onAddDeal: (deal: Deal) => void;
}

interface DealComponentState {
    newDeal: Deal;
    deals: Deal[];
}

export class DealComponent extends React.Component<DealComponentProps, DealComponentState> {

    constructor(props: DealComponentProps){
        super(props);
        this.state={
            newDeal: {
                id: 0,
                name: "",
                buyer: "",
                courier: ""
            },
            deals: [],
        }

        this.onProductBuyerChange = this.onProductBuyerChange.bind(this);
        this.deployProductDeal = this.deployProductDeal.bind(this);
    }

    private onProductBuyerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newDeal: {
                ...this.state.newDeal,
                buyer: event.target.value
            }
        });
    };

    private deployProductDeal(): void {
        /**
         * It is not possible to use node.js 'fs' in the browser
         * and have it directly affect the file system on the server.
         * https://stackoverflow.com/questions/29762282/using-node-jss-file-system-functions-from-a-browser
         */

        //print static import
        //console.log(dealContract);
        
        const web3Manager = Web3NodeManager.getInstance();
        console.log(web3Manager.eth.defaultAccount);

        //workaround for compile time warning
        let json = JSON.stringify(dealContract.abi);
        let abi = JSON.parse(json);

        var contract = new web3Manager.eth.Contract(abi);
        let byteCode = dealContract.bin

        var deployOpts = {
            data: '0x' + byteCode,
            arguments: [this.state.newDeal.buyer]
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

            this.setState(previousState => ({
                newDeal: {
                    id: previousState.newDeal.id + 1,
                    name: "",
                    buyer: "",
                    courier: ""
                },
                deals: [...previousState.deals, previousState.newDeal]
            }));

        }).catch((reason: any) => {
            console.log("error");
            console.log(reason);
        });
    }
    
    render(){
        return (
            <div>
                <h2>Deals</h2>
                <DealList deals={this.state.deals} />
                {/*<DealForm
                    deal={this.props.deal}
                    onChangeBuyer={this.onProductBuyerChange}
                    //onChange={this.props.onChange}
                    //onChangeValue={this.props.onChangeValue}
                    onAdd={this.deployProductDeal}
                />*/}
                <form /*onSubmit={onAdd}*/>
                    <p>Buyer:</p>
                    <input onChange={this.onProductBuyerChange} value={"" + this.state.newDeal.buyer} />
                    {/*<button type="submit">Save Deal</button>*/}
                    <button onClick={this.deployProductDeal} className="btn btn-primary btn-block">Save Deal</button>
                </form>
            </div>
        );
    }
}
