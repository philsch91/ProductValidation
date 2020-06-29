import React from 'react';

import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';

import { Product } from '../models/product';
import { Account } from '../lib/interfaces/account';

interface Props {
    account: string|null;
    product: Product;
    products: Product[];
    onDeploy: () => void;
    loading: boolean;
}

export class ProductComponent extends React.Component<Props> {

    constructor(props: Props){
        super(props);
        this.state={
            errors:[]
        }
    }
    
    render(){
        if(this.props.account == null) {
            return(<div>
                Please login first! TODO: Referal component
            </div>)
        }
        return (
            <div>
                <h2>Products</h2>
                { this.props.loading
                    ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                    : <ProductForm
                        product={this.props.product}
                        onChangeProductName={this.props.onChangeProductName}
                        onChangeProductCompany={this.props.onChangeProductCompany}
                        onAdd={this.props.onAdd}
                        onDeploy={this.props.onDeploy}
                    />

                }
                <ProductList products={this.props.products} />
            </div>
        );
    }
}
