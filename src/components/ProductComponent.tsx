import React from 'react';

import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';

import { Product } from '../models/product';

interface Props {
    account: string|null;
    product: Product;
    products: Product[];
    //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeProductName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeProductCompany: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
    onAdd: () => void;
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
        const body = <div>Hi!</div>;
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
                        //onChange={this.props.onChange}
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
