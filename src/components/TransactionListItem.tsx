import React, { FunctionComponent } from "react";

import { Transaction } from "../models/transaction";

interface Props {
  transaction: Transaction;
  onDelete: (transaction: Transaction) => void;
}

export const TransactionListItem: FunctionComponent<Props> = ({ transaction, onDelete }) => {
  const onClick = () => {
    onDelete(transaction);
  };

  return (
    <li>
      {transaction.name} <button onClick={onClick}>X</button>
    </li>
  );
};