import React from 'react';

interface Props {
    privateKey: string;
    onPrivateKeyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSwitch: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const AccountForm: React.FunctionComponent<Props> = ({ 
    privateKey, onPrivateKeyChange, onSwitch }) => (
    <form onSubmit={onSwitch}>
    <input onChange={onPrivateKeyChange} value={privateKey} />
    <button type="submit">Switch</button>
    </form>
);