import React from 'react';
import { Transaction } from '../models/transaction';

interface Props {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeTo: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeValue: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onAdd: (event: React.FormEvent<HTMLFormElement>) => void;
    transaction: Transaction;
}
  
export const NewTransactionForm: React.FunctionComponent<Props> = ({
    onChange,
    onChangeTo,
    onChangeValue,
    onAdd,
    transaction}) => (
    <form onSubmit={onAdd}>
      <p>To:</p>
      <input onChange={onChangeTo} value={"" + transaction.to} />
      <p>Value (Wei):</p>
      <input onChange={onChangeValue} value={"" + new String(transaction.value)} />
      <p>Textnote:</p>
      <input onChange={onChange} value={"" + transaction.name} />
      <button type="submit">Send transaction</button>
    </form>
);