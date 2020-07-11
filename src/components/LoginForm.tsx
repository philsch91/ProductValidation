import React from 'react';

interface Props {
    onClick: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoggedIn: boolean;
}

export const LoginForm: React.FunctionComponent<Props> = ({
  onClick, isLoggedIn}) => {
    if(isLoggedIn){
        return(<div>
            You are logged in!!!11one
        </div>)
    }
        return (
    <form onSubmit={onClick}>
        <button type="submit">Connect</button>
    </form>
    );
};