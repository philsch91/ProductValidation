import React from 'react';
import {Contract} from "web3-eth-contract";
import {Web3NodeManager} from "../helpers/Web3NodeManager";
import * as productContractJson from "../static/Product.json";
import {PRODUCT_CONTRACT_ADDRESS} from "../static/constants";


interface ValidationProps {
    account: string | null;
    //id: number;
}

interface ProductData {
    ownerName: string | null,
    productName: string | null,
    creationDate: string | null
}

interface ValidationState {
    idField: number;
    product: ProductData;
    loading: boolean;
    isProduct: boolean;
    productNameField: string;
    showIsValidMessage: boolean;
}

export class ProductValidationComponent extends React.Component<ValidationProps, ValidationState> {

    constructor(props: ValidationProps) {
        super(props);
        this.state = {
            idField: 0,
            product: {ownerName: null, productName: null, creationDate: null},
            productNameField: "",
            loading: false,
            isProduct: false,
            showIsValidMessage: false
        }

        this.changeId = this.changeId.bind(this);
        this.productValidation = this.productValidation.bind(this);
        this.changeProductName = this.changeProductName.bind(this);
        this.doesProductExist = this.doesProductExist.bind(this);
    }

    public async doesProductExist() {
        if (!Number.isInteger(this.state.idField)) {
            console.log(this.state.idField + " is not a valid integer.");
            alert("You did not enter a valid integer!");
            return;
        }

        const contract = this.loadContract();

        await contract.methods.isProduct(this.state.idField, this.state.productNameField).call({from: this.props.account}).then((value: any) =>
            this.setState({
                isProduct: value,
                showIsValidMessage: true}));

    }

    public async productValidation() {
        console.log("ProductVerificationForm addProduct");

        //console.log(this.state.idField);
        if (!Number.isInteger(this.state.idField)) {
            console.log(this.state.idField + " is not a valid integer.");
            alert("You did not enter a valid integer!");
            return;
        }

        const contract = this.loadContract();
        await contract.methods.getProductFromProductId(this.state.idField).call({from: this.props.account}).then((value: any) =>
            this.setState(prevState => ({
                product: {
                    ...prevState.product,
                    ownerName: value.ownerName,
                    productName: value.productName,
                    creationDate: value.creationDate
                }
            })));
    }

    private changeId(event: React.ChangeEvent<HTMLInputElement>): void {
        try {
            this.setState({
                idField: parseInt(event.target.value)
            });
        } catch (err) {
            console.log("Number Format Problem: " + err);
            alert("Entered value is not a valid int!")
        }
    }

    private changeProductName(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            productNameField: event.target.value
        });
    }

    loadContract(): Contract {
        const web3Manager = Web3NodeManager.getInstance();
        let json = JSON.stringify(productContractJson.abi);
        let abi = JSON.parse(json);
        return new web3Manager.eth.Contract(abi, PRODUCT_CONTRACT_ADDRESS);
    }

    render() {
        let productData;
        let isProduct;
        if (this.state.product.ownerName != null ||
            this.state.product.productName != null ||
            this.state.product.creationDate != null) {
            productData = <div>
                <p>Owner Name: {this.state.product.ownerName}</p>
                <p>Product Name: {this.state.product.productName}</p>
                <p>Creation Date: {this.state.product.creationDate}</p>
            </div>;
        } else {
            productData = "";
        }
        if (this.state.isProduct && this.state.showIsValidMessage) {
            isProduct = <div>The entered product is valid!</div>
        } else if (!this.state.isProduct && this.state.showIsValidMessage) {
            isProduct = <div>The entered product is invalid!</div>
        } else {
            isProduct = "";
        }
        return (
            <div>
                <h2>Product Validation</h2>
                <h3>Get data from ID</h3>
                <form>
                    <p>Product ID to query data (Integer):</p>
                    <input type="text" onChange={this.changeId}/>
                    <button onClick={this.productValidation} className="btn btn-primary btn-block">Show Data
                    </button>
                </form>
                <h3>Check if data of product matches</h3>
                <form>
                    <p>Product ID (Integer):</p>
                    <input type="text" onChange={this.changeId}/>
                    <p>Product Name:</p>
                    <input type="text" onChange={this.changeProductName}/>
                    <button onClick={this.doesProductExist} className="btn btn-primary btn-block">Is Valid?
                    </button>
                </form>
                {productData}
                {isProduct}
            </div>
        );
    }

}

