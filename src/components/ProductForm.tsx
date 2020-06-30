import React from 'react';
import { Contract } from 'web3-eth-contract';

import { Web3NodeManager } from '../helpers/Web3NodeManager';

import { Product } from '../models/product';

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
      product: { productName: "", ownerName: ""},
      loading: false,
    }

    this.changeProductName = this.changeProductName.bind(this);
    this.changeOwnerName = this.changeOwnerName.bind(this);
    this.addProductToSmartContract = this.addProductToSmartContract.bind(this);
  }

  private changeProductName(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      product: {
        ...this.state.product,
        productName: event.target.value
      }
    });
  }

  private changeOwnerName(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      product: {
        ...this.state.product,
        ownerName: event.target.value
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
    this.setState({loading: true})
    contract.methods.addProduct(product.ownerName, product.productName).send({from: this.props.account}).once('receipt', (receipt: any) => {
      this.setState({loading: false})
    }).catch((err: string) => {
      console.log("Failed with error: " + err);
      alert("Transaction has been reverted due to an error!")
      this.setState({loading: false})
    });
  }

  render(){
    return (
        <div>
        { this.state.loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              :
              <form >
                <p>Product Name:</p>
                <input type="text" onChange={this.changeProductName} value={"" + this.state.product.productName}/>
                <p>Owner Name:</p>
                <input type="text" onChange={this.changeOwnerName} value={"" + this.state.product.ownerName}/>

                <button onClick={this.addProductToSmartContract} className="btn btn-primary btn-block">Save Product
                </button>
                <button onClick={this.props.onDeploy} className="btn btn-primary btn-block">Deploy</button>
              </form>
        }
        </div>
    );
  }
}
