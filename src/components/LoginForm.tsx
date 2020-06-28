import React from 'react';

interface Props {
    address: string;
    onAddressChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClick: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const LoginForm: React.FunctionComponent<Props> = ({
  address,
  onAddressChange,
  onClick}) => (
    <form onSubmit={onClick}>
      <button type="submit">Connect</button>
    </form>
);