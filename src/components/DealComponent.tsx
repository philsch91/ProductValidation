import React from 'react';

import { DealForm } from './DealForm';
import { DealList } from './DealList';

import { Deal } from '../models/deal';

interface Props {
    deal: Deal;
    deals: Deal[];
    //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeBuyer: (event: React.ChangeEvent<HTMLInputElement>) => void;
    //onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
    //onDelete: (Product: Product) => void;
}

export class DealComponent extends React.Component<Props> {

    constructor(props: Props){
        super(props);
        this.state={
            errors:[]
        }
    }
    
    render(){
        return (
            <div>
                <h2>Deals</h2>
                <DealForm
                    deal={this.props.deal}
                    onChangeBuyer={this.props.onChangeBuyer}
                    //onChange={this.props.onChange}
                    //onChangeValue={this.props.onChangeValue}
                    onAdd={this.props.onAdd}
                />
                <DealList deals={this.props.deals} />
            </div>
        );
    }
}
