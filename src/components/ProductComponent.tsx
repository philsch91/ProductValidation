import React from 'react';

import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';

import { Product } from '../models/product';

interface Props {
    product: Product;
    products: Product[];
    //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeBuyer: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
                    onChangeBuyer={this.props.onChangeBuyer}
                    //onChange={this.props.onChange}
                    //onChangeValue={this.props.onChangeValue}
                    onAdd={this.props.onAdd}
                />
                <ProductList products={this.props.products} />
            </div>
        );
    }
}
