import React from 'react';

import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';

import { Product } from '../models/product';
import { Account } from '../lib/interfaces/account';

interface Props {
    account: Account
    product: Product;
    products: Product[];
    //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeProductName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeProductCompany: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
    onAdd: () => void;
    onDeploy: () => void;
    //onDelete: (Product: Product) => void;
}

export class ProductComponent extends React.Component<Props> {

    constructor(props: Props){
        super(props);
        this.state={
            errors:[]
        }
    }
    
    render(){
        return (
            <div>
                <h2>Products</h2>
                <ProductForm
                    account={this.props.account}
                    product={this.props.product}
                    //onChange={this.props.onChange}
                    onChangeProductName={this.props.onChangeProductName}
                    onChangeProductCompany={this.props.onChangeProductCompany}
                    onAdd={this.props.onAdd}
                    onDeploy={this.props.onDeploy}
                />
                <ProductList products={this.props.products} />
            </div>
        );
    }
}
