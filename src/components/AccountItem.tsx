import React, { FunctionComponent } from "react";
import { Account } from "../lib/interfaces/account";

interface Props {
  account: '';
  onChange: (account: String) => void;
}

export const AccountItem: FunctionComponent<Props> = ({ account, onChange }) => {
  const onClick = () => {
    onChange(account);
  };

  return (
    <li>account <button onClick={onClick}>Change</button></li>
  );
};