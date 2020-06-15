import React, { FunctionComponent } from "react";

import { Transaction } from "../models/transaction";
import { TransactionListItem } from "./TransactionListItem";

interface Props {
  transactions: Transaction[];
  onDelete: (transaction: Transaction) => void;
}

export const TransactionList: FunctionComponent<Props> = ({ transactions, onDelete }) => (
  <ul>
    {transactions.map(transaction => (
      <TransactionListItem transaction={transaction} onDelete={onDelete} />
    ))}
  </ul>
);