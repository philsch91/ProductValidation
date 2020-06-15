import React, { FunctionComponent } from "react";

import { Account } from "../models/account";
import { AccountItem } from "./AccountItem";

interface Props {
  accounts: Account[];
  onChange: (account: Account) => void;
}

export const AccountList: FunctionComponent<Props> = ({ accounts, onChange }) => (
  <ul>
    {accounts.map(account => (
      <AccountItem account={account} onChange={onChange} />
    ))}
  </ul>
);