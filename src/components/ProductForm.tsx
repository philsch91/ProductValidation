import React from 'react';
import { Contract, ContractOptions, ContractSendMethod, SendOptions, DeployOptions } from 'web3-eth-contract';

import { Web3Manager } from '../lib/Web3Manager';
import { Account } from '../lib/interfaces/account';
import { Web3NodeManager } from '../helpers/Web3NodeManager';

import { Product } from '../models/product';

import * as productContract from '../static/ProductContract.json'
//import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

interface ProductFormProps {
  account: Account
  product: Product;
  onChangeProductName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeProductCompany: (event: React.ChangeEvent<HTMLInputElement>) => void;
  //onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
  onAdd: () => void;
  onDeploy: () => void;
}

interface ProductFormState {
  errors: Error[];
  product: Product;
}

export class ProductForm extends React.Component<ProductFormProps, ProductFormState> {

  constructor(props: ProductFormProps){
    super(props);
    this.state={
      errors:[],
      product: {id: 0, name: "", company: ""}
    }

    this.changeProductName = this.changeProductName.bind(this);
    this.changeProductCompany = this.changeProductCompany.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  private changeProductName(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      product: {
        ...this.state.product,
        name: event.target.value
      }
    });
  }

  private changeProductCompany(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      product: {
        ...this.state.product,
        company: event.target.value
      }
    });
  }

  public addProduct(): void {
    console.log("ProductForm addProduct");

    var product = this.state.product;
    console.log(product);

    const web3Manager = Web3NodeManager.getInstance();

    if (this.props.account.privateKey != undefined) {
      console.log("account.privateKey is set");
      
      web3Manager.unlockAccountSync(this.props.account.address, this.props.account.privateKey, 600, (status: boolean) => {
        console.log("unlocked: " + status);
      });
    }

    //workaround for compile time warning
    let json = JSON.stringify(productContract.abi);
    let abi = JSON.parse(json);
    
    // Ganache
    //var contract = new web3Manager.eth.Contract(abi, '0xC7502df1517D540F8f49C367586e32bDB5FFAfa9');
    // Ropsten Testnet
    var contract = new web3Manager.eth.Contract(abi, '0x15Be3530C9f7BE0d7fa55289Bc426e6B5DD47b29');
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

    var transaction = contract.methods.addProduct(product.name, product.company);

    web3Manager.send(transaction)
    .then(function(receipt: Object){
      console.log("received receipt");
      console.log(receipt);
    }).catch(function(error: Error){
      console.log(error);
    });
  }

  render(){
    return (
      <form /*onSubmit={onAdd}*/>
        <p>Name:</p>
        {/*<input type="text" onChange={this.props.onChangeProductName} value={"" + this.state.product.name} />*/}
        <input type="text" onChange={this.changeProductName} value={"" + this.state.product.name} />
        <p>Company:</p>
        {/*<input type="text" onChange={this.props.onChangeProductCompany} value={"" + this.state.product.company} />*/}
        <input type="text" onChange={this.changeProductCompany} value={"" + this.state.product.company} />
        
        {/*<button type="submit">Save Product</button>*/}
        <button onClick={this.addProduct} className="btn btn-primary btn-block">Save Product</button>
        <button onClick={this.props.onDeploy} className="btn btn-primary btn-block">Deploy</button>
      </form>
    );
  }
}
