export interface Transaction {
    from: String | Number;
    to?: String;
    value?: String | Number // BN | BigNumber 
    data?: String;
    nonce?: Number;
    chain?: String;
    hardfork?: String;
    common?: Object;
    id: number;
    name: String;
}