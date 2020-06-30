import { TransactionConfig } from 'web3-eth';

export interface Transaction extends TransactionConfig {
    //from: string | number | undefined;
    //to?: String;
    //value?: String | Number // BN | BigNumber 
    //data?: String;
    //nonce?: Number;
    //chain?: String;
    //hardfork?: String;
    //common?: Object;
    id?: number;
    name?: string;
}