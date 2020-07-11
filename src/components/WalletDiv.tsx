import React, { FunctionComponent } from "react";
import { Account } from "../lib/interfaces/account";
import { AccountItem } from "./AccountItem";

interface Props {
  account: string|null;
  //onChange: (account: Account) => void;
  //onSwitch: (event: React.FormEvent<HTMLFormElement>) => void;
  //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WalletDiv: React.FunctionComponent<Props> = ({ account }) => (
  <p>account</p>
  /*
  //<input onChange={onChange} value={transaction.name} />
  <ul>
    {accounts.map(account => (
      <AccountItem account={account} onChange={onChange} />
    ))}
  </ul> */
);