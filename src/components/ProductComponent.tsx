import React from 'react';

import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';

import { Product } from '../models/product';

interface Props {
    product: Product;
    products: Product[];
    //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
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
                    product={this.props.product}
                    //onChange={this.props.onChange}
                    onChangeName={this.props.onChangeName}
                    onAdd={this.props.onAdd}
                />
                <ProductList products={this.props.products} />
            </div>
        );
    }
}
