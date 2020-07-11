import React from 'react';

import {ProductForm} from './ProductForm';

interface Props {
    account: string | null;
    onDeploy: () => void;
}

export class ProductComponent extends React.Component<Props> {

    constructor(props: Props) {
        super(props);
        this.state = {
            errors: []
        }
    }

    render() {
        return (
            <div>
                <h2>Products</h2>
                <ProductForm
                    account={this.props.account}
                    onDeploy={this.props.onDeploy}
                />
            </div>
        );
    }
}
