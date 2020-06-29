import React from 'react';
import { Contract, ContractOptions, ContractSendMethod, SendOptions, DeployOptions } from 'web3-eth-contract';

import { Web3Manager } from '../lib/Web3Manager';
import { Account } from '../lib/interfaces/account';
import { Web3NodeManager } from '../helpers/Web3NodeManager';

import { Product } from '../models/product';

import * as productContract from '../static/ProductContract.json'
import * as productContractJson from "../static/Product.json";
import {PRODUCT_CONTRACT_ADDRESS} from "../static/constants";
//import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

interface ProductFormProps {
  account: string|null
  onDeploy: () => void;
}

interface ProductFormState {
  errors: Error[];
  product: Product;
  loading: boolean;
}

export class ProductForm extends React.Component<ProductFormProps, ProductFormState> {

  constructor(props: ProductFormProps){
    super(props);
    this.state={
      errors:[],
      product: {name: "", company: ""},
      loading: false
    }

    this.changeProductName = this.changeProductName.bind(this);
    this.changeProductCompany = this.changeProductCompany.bind(this);
    this.addProductToSmartContract = this.addProductToSmartContract.bind(this);
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

  private loadContract(): Contract {
    const web3Manager = Web3NodeManager.getInstance();
    let json = JSON.stringify(productContractJson.abi);
    let abi = JSON.parse(json);
    const contract = new web3Manager.eth.Contract(abi, PRODUCT_CONTRACT_ADDRESS);
    return contract;
  }

  /**
   * Adds a product to the blockchain
   */
  public addProductToSmartContract(): void {
    console.log("ProductForm addProduct");

    const product = this.state.product;
    console.log(product);
    const contract = this.loadContract();

    contract.methods.addProduct(product.name, product.company).send({from: this.props.account}).once('receipt', (receipt: any) => {
      this.setState({loading: false})
    }).catch((err: string) => {
      console.log("Failed with error: " + err);
      alert("Transaction has been reverted due to an error!")
      this.setState({loading: false})
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
        <button onClick={this.addProductToSmartContract} className="btn btn-primary btn-block">Save Product</button>
        <button onClick={this.props.onDeploy} className="btn btn-primary btn-block">Deploy</button>
      </form>
    );
  }
}
