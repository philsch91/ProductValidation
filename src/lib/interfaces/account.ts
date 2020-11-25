import { Accounts } from 'web3-eth-accounts';
//import { Account } from 'eth-lib/lib/account';

//export interface Web3Account extends Account {
export interface Account {
    address: string;
    privateKey?: string;
    name?: string;
    balance?: string;
}