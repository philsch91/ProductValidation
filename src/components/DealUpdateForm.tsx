import React from 'react';
import { Deal } from '../models/deal';

interface Props {
  deal: Deal;
  onChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: (event: React.FormEvent<HTMLFormElement>) => void;
}
  
export const DealUpdateForm: React.FunctionComponent<Props> = ({
  deal,
  onChangeName,
  onSend
  }) => (
    <form onSubmit={onSend}>
      <p>Buyer:</p>
      <input onChange={onChangeName} value={"" + deal.name} />
      <button type="submit">Update Deal</button>
    </form>
);