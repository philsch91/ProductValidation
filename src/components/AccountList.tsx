import React, { FunctionComponent } from "react";

import { Account } from "../lib/interfaces/account";
import { AccountListItem } from "./AccountListItem";

interface Props {
  accounts: Account[];
  onChangeAccount: (account: Account) => void;
}

export const AccountList: FunctionComponent<Props> = ({ accounts, onChangeAccount }) => (
  <ul>
    {accounts.map(account => (
      <AccountListItem account={account} onChange={onChangeAccount} />
    ))}
  </ul>
);