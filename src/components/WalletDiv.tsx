import React, { FunctionComponent } from "react";
import { Account } from "../lib/interfaces/account";
import { AccountListItem } from "./AccountListItem";

interface Props {
  account: Account | null;
  //onChange: (account: Account) => void;
  //onSwitch: (event: React.FormEvent<HTMLFormElement>) => void;
  //onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const WalletDiv: React.FunctionComponent<Props> = ({ account }) => {
  if (account == null) {
    return (<p></p>);
  }

  return (
    <div>
      <p>Name: {account.name}</p>
      <p>Address: {account.address}</p>
      <p>Private Key: {account.privateKey}</p>
      <p>Balance: {account.balance}</p>
    </div>
  );

  /*
  //<input onChange={onChange} value={transaction.name} />
  <ul>
    {accounts.map(account => (
      <AccountItem account={account} onChange={onChange} />
    ))}
  </ul> */
};