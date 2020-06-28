import React from 'react';
import { Deal } from '../models/deal';

interface Props {
  deal: Deal;
  onChangeBuyer: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
}
  
export const DealForm: React.FunctionComponent<Props> = ({
  deal,
  onChangeBuyer,
  onAdd
  }) => (
    <form onSubmit={onAdd}>
      <p>Buyer:</p>
      <input onChange={onChangeBuyer} value={"" + deal.buyer} />
        <button type="submit">Save Deal</button>
    </form>
);