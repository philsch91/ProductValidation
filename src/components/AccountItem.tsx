import React, { FunctionComponent } from "react";
import { Account } from "../lib/interfaces/account";

interface Props {
  account: Account;
  onChange: (account: Account) => void;
}

export const AccountItem: FunctionComponent<Props> = ({ account, onChange }) => {
  const onClick = () => {
    onChange(account);
  };

  return (
    <li>{account.name} {account.address} <button onClick={onClick}>Change</button></li>
  );
};