import Web3 from 'web3';
import { Contract, ContractOptions, ContractSendMethod, SendOptions, DeployOptions } from 'web3-eth-contract';
import { Personal } from 'web3-eth-personal';
import { Accounts } from 'web3-eth-accounts';
import { Providers, provider, HttpProvider, WebsocketProvider, IpcProvider, SignedTransaction, TransactionReceipt } from 'web3-core';
import { Account } from './interfaces/account';
import { AccountDelegate } from './interfaces/AccountDelegate';
import { Transaction } from '../models/transaction';

export class Web3Session extends Web3 {
    private _account?: Account;
    private accountUpdateTimerId: number | null = null;
    private accountUpdateFlag: boolean = false;
    public accountDelegate: AccountDelegate | null = null;

    public constructor(){
        super();
        this.updateAccount = this.updateAccount.bind(this);
    }

    public set account(value : Account | undefined) {
        this._account = value;
    }

    public get account(): Account | undefined {
        return this._account;
    }

    public async getAccounts(): Promise<string[]> {
        const addresses: string[] = await this.eth.getAccounts();
        return addresses;
    }

    /**
     * callback: (error: Error | null, accounts: Account[] | null)
     * callback with optionals
     * callback: (error?: Error, accounts?: Account[])
     * @param callback
     * @returns Promise<Account[] | undefined>
     */
    public async readAccountsAndBalances(callback: (error?: Error, accounts?: Account[]) => void) : Promise<Account[] | undefined>{
        //var error: Error | null = null;
        var error: Error | undefined = undefined;
        var addresses: string[];
        var accountList: Account[] = new Array();
        
        try {
            addresses = await this.getAccounts();
        } catch (error) {
            //callback(error, accountList);
            callback(error);
            return;
        }
        
        console.log(addresses);
        
        accountList = new Array(addresses.length);
        var i = 0;
        
        for (let key in addresses) {
            //const address: string = addresses[key];
            let address: string = addresses[key];
            console.log(address);
            //let account: Account = {id:"0", name:"test"};
            let account = {name: i.toString(), address: address, privateKey: ""} as Account;
            var balance: string = "";
            
            try {
                balance = await this.eth.getBalance(address);
            } catch (e) {
                /*
                if (typeof e === "string") {
                    let str: string = e.toLowerCase();
                } else if (e instanceof Error) {
                    error = e;
                } */
                error = e as Error;
            }
            
            account.balance = balance;
            accountList[i] = account;
            i++;
        }
        
        callback(error, accountList);
        return accountList;
    }

    public readAccounts(callback: (error: Error, accounts: Account[]) => void ) {
        this.eth.getAccounts((error: Error, accounts: string[]) => {
            console.log(accounts);
            var accountList:Account[] = new Array(accounts.length);
            var i = 0;
            
            for (let key in accounts) {
              const address: string = accounts[key];
              console.log(address);
              //let account: Account = {id:"0", name:"test"};
              let account = {name: i.toString(), address: address, privateKey: "", balance: ""} as Account;
              accountList[i] = account;
              i++;
            }
            
            callback(error, accountList);
        });
    }

    public startUpdatingAccount(): void {
        this.accountUpdateTimerId = window.setInterval(this.updateAccount, 5000);
    }

    public stopUpdatingAccount(): void {
        //this.accountUpdateFlag = false;
        if (this.accountUpdateTimerId == null) {
            return;
        }
        clearInterval(this.accountUpdateTimerId);
    }

    private async updateAccount(): Promise<void> {
        const address = this.eth.defaultAccount;
        if (address == null) {
            return;
        }

        const balance = await this.eth.getBalance(address);
        let account = {address: address, balance: balance} as Account;
            
        if (this.accountDelegate == null) {
            return;
        }
        
        this.accountDelegate.balanceDidChange(this, account);
    }

    private async updateAccountWithTimeout(): Promise<void> {
        const address = this.eth.defaultAccount;
        if (address == null) {
            return;
        }
        
        while (this.accountUpdateFlag) {
            const balance = await this.eth.getBalance(address);
            let account = {address: address, balance: balance} as Account;
            
            if (this.accountDelegate == null) {
                break;
            }
            //var func = function(){};
            //var t = this.accountDelegate.balanceDidChange(this, account);
            setTimeout(this.accountDelegate.balanceDidChange, 5000, this, account);
        }
    }

    public async unlockAccountSync(address: string, password: string, unlockduration: number, callback: (status: boolean) => void){
        //console.log(web3Manager.currentProvider);
        // https://docs.metamask.io/guide/ethereum-provider.html#ethereum-provider-api
        if ((this.currentProvider as any).isMetaMask == true) {
            //console.log("MetaMask provider detected");
            return;
        }
        const unlockStatus: boolean = await this.eth.personal.unlockAccount(address, password, unlockduration);
        callback(unlockStatus);
    }
    
    /**
     * estimateGas() estimates gas for either 
     * a ContractSendMethod for deploying a contract or
     * an arbitrary Object for transactions and method calls of a contract
     * TODO: return Promise<number> instead of Promise<Number>
     * @param transaction 
     * @param callback 
     */
    private async estimateGas(transaction: any, callback?:(error?: Error, gas?: Number) => void): Promise<Number> {
        var gas: Number = 0;
        
        try {
            gas = await transaction.estimateGas({from: this.eth.defaultAccount});
        } catch (error) {
            if (!callback) {
                throw error;
            }
            callback(error);
            return 0;
        }

        // TODO: move console.log() into application specific callback
        console.log("estimateGas: " + gas);
        
        if (callback) {
            callback(undefined, gas);
        }
        
        return gas;
    }

    public async deploy(contract: Contract, deployOptions: DeployOptions, sendOptions: SendOptions, callback?: (error?: Error, object?: Object, transactionHash?: String) => void): Promise<Contract|null> {
        var sendMethod: ContractSendMethod;
        var gas: Number = 0;
        var newContract: Contract;
        var transactionHash: String | undefined;

        if (this.eth.defaultAccount != null) {
            sendOptions.from = this.eth.defaultAccount;
        }
        
        try {
            sendMethod = contract.deploy(deployOptions);
            //gas = await transaction.estimateGas({from: this.eth.defaultAccount});
            gas = await this.estimateGas(sendMethod);
            //sendOptions.gas = +gas
            sendOptions.gas = Number(gas + "")  //without 'new' a primitive number is created
            console.log(sendOptions);
            newContract = await sendMethod.send(sendOptions,(error: Error, txHash: string) => {
                if (error != null) {
                    // TODO: move console.log() into application specific callback
                    console.log(error);
                    return;
                }
                // TODO: move console.log() into application specific callback
                console.log(txHash);
                transactionHash = txHash;
              });
        } catch (error) {
            console.log("catch");
            if (!callback) {
                throw error;
            }
            callback(error);
            return null;
        }
        
        if (callback) {
            callback(undefined, newContract, transactionHash);
        }
        
        return newContract;
    }

    /**
     * TODO: change gas to number
     * @param transaction
     * @param callback
     */
    public async send(transaction: any, callback?: (error?: Error, receipt?: Object) => void): Promise<any> {
        var gas: Number = 0;
        var receipt: TransactionReceipt;
        
        try {
            //gas = await transaction.estimateGas({from: this.eth.defaultAccount});
            gas = await this.estimateGas(transaction);
            //receipt = await transaction.send({from: this.eth.defaultAccount, gas: gas});
            receipt = await this.eth.sendTransaction(transaction, (error: Error, hash: string) => {
                console.log("hash: " + hash)
                if (callback !== undefined && error !== undefined) {
                    callback(error, undefined);
                }
                return;
            })
        } catch (error) {
            if (!callback) {
                throw error;
            }
            callback(error, undefined);
            return;
        }
        
        if (callback) {
            callback(undefined, receipt);
        }
        
        return receipt;
    }

    /**
     *
     * @param transaction
     * @param callback
     */
    public async sendSigned(transaction: Transaction, callback?: (error?: Error, receipt?: TransactionReceipt) => void): Promise<TransactionReceipt | undefined> {
        var gas: number = 0;
        var receipt: TransactionReceipt;

        if (transaction.from === undefined && this.defaultAccount !== null) {
            transaction.from = this.defaultAccount
        }

        if (transaction.from === undefined && this._account !== undefined) {
            transaction.from = this._account.address;
        }

        if (this._account?.privateKey === undefined) {
            if (callback !== undefined) {
                callback(Error("private key not set"));
            }
            return;
        }

        try {
            //gas = await this.estimateGas(signedTransaction);
            var gas = await this.eth.estimateGas(transaction, (error: Error, gas: number) => {
                //console.log("sengSigned gas: " + gas)  //21000
                if (callback !== undefined && error !== undefined) {
                    callback(error, undefined);
                }
                return;
            });

            transaction.gas = gas;
            console.log("sendSigned transaction.gas: " + transaction.gas);
            console.log("sendSigned transaction.gasPrice: " + transaction.gasPrice);

            //const pk: string = this._account.privateKey
            var signedTransaction: SignedTransaction = await this.eth.accounts.signTransaction(transaction, this._account.privateKey);

            if (signedTransaction.rawTransaction == null) {
                if (callback !== undefined) {
                    callback(Error("raw transaction is null"), undefined);
                }
                return;
            }

            receipt = await this.eth.sendSignedTransaction(signedTransaction.rawTransaction, (error: Error, hash: string) => {
                console.log("hash: " + hash)
                if (callback !== undefined && error !== undefined) {
                    callback(error, undefined);
                }
                return;
            })
        } catch (error) {
            if (!callback) {
                throw error;
            }
            callback(error, undefined);
            return;
        }

        if (callback) {
            callback(undefined, receipt);
        }

        return receipt;
    }

    public async call(transaction: any, callback?: (error?: Error, receipt?: Object) => void): Promise<any> {
        var gas: Number = 0;
        var receipt: Object;
        
        try {
            //gas = await transaction.estimateGas({from: this.eth.defaultAccount});
            gas = await this.estimateGas(transaction);
            receipt = await transaction.call({from: this.eth.defaultAccount, gas: gas});
        } catch (error) {
            if (!callback) {
                throw error;
            }
            callback(error);
            return;
        }

        if (callback) {
            callback(undefined, receipt);
        }

        return receipt;
    }
}