import Web3 from 'web3';
import { Contract, ContractOptions, ContractSendMethod, SendOptions, DeployOptions, EstimateGasOptions } from 'web3-eth-contract';
import { Personal } from 'web3-eth-personal';
import { Accounts } from 'web3-eth-accounts';
import { Providers, provider, HttpProvider, WebsocketProvider, IpcProvider, SignedTransaction, TransactionReceipt, RLPEncodedTransaction, BlockNumber } from 'web3-core';
import { TransactionConfig, BlockTransactionString, BlockTransactionObject } from 'web3-eth';
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
     * User-defined type guards
     */

    public isTransactionConfig(object: any): object is TransactionConfig {
        return object.gas !== undefined;
    }

    public isContractSendMethod(object: any): object is ContractSendMethod {
        return (object.estimateGas as ContractSendMethod).estimateGas !== undefined;
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
    private async estimateGas(object: TransactionConfig | ContractSendMethod, callback?:(error?: Error, gas?: Number) => void): Promise<Number | Error> {
        var gasPrice: string;
        var gas: Number = 0;
        
        try {
            gasPrice = await this.eth.getGasPrice();
            if (this.isTransactionConfig(object)) {
                // object = {from: "fromAddress", to: "toAddress", value: "000001", gas: "6721975", gasPrice: gasPrice, data: undefined, nonce: undefined, chainId: undefined} as TransactionConfig
                gas = await this.eth.estimateGas(object);
            } else if (this.isContractSendMethod(object)) {
                var from: string | undefined = undefined;
                if (this.eth.defaultAccount != null) {
                    from = this.eth.defaultAccount;
                }
                let estimateGasOptions: EstimateGasOptions = {from: from, gas: undefined, value: undefined}
                gas = await object.estimateGas(estimateGasOptions);
            }
        } catch (error) {
            if (!callback) {
                throw error;
            }
            callback(error);
            //return 0;
            return error;
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
        var transactionHash: String | undefined = undefined;
        var from: string | undefined = undefined;

        if (this.eth.defaultAccount != null) {
            sendOptions.from = this.eth.defaultAccount;
            from = this.eth.defaultAccount;
        }

        sendMethod = contract.deploy(deployOptions);
        
        try {
            //gas = await this.estimateGas(sendMethod);
            let estimateGasOptions: EstimateGasOptions = {from: from, gas: undefined, value: undefined}
            gas = await sendMethod.estimateGas(estimateGasOptions);
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
    public async send(transaction: TransactionConfig, callback?: (error?: Error, receipt?: Object) => void): Promise<any> {
        var gas: Number | Error = 0;
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
     * Gets and sets the gas price for a transaction config.
     * Called by sendSigned(transactionConfig, callback).
     * @param transactionConfig
     * @param callback
     * @returns Promise<TransactionConfig | Error>
     */
    private async getGasPriceIfNeeded(transactionConfig: TransactionConfig, callback?: (error?: Error, gasPrice?: string) => void): Promise<TransactionConfig | Error> {
        if (transactionConfig.gasPrice !== undefined) {
            return transactionConfig;
        }

        var gasPrice: string;
        try {
            gasPrice = await this.eth.getGasPrice((error: Error, gasPrice: string) => {
                if (callback === undefined && error !== undefined) {
                    throw error;
                }
                if (callback !== undefined && error !== undefined) {
                    callback(error);
                    return;
                }
            });
        } catch (error) {
            if (!callback) {
                throw error;
                //return Promise.reject(error);
            }
            //callback(error, undefined);
            callback(error);
            return error;
        }

        transactionConfig.gasPrice = gasPrice;
        return transactionConfig;
    }

    /**
     * Estimates the gas for a transaction config.
     * Called by sendSigned(transactionConfig, callback).
     * @param transactionConfig
     * @param callback
     * @returns Promise<TransactionConfig | Error>
     */
    private async estimateGasIfNeeded(transactionConfig: TransactionConfig, callback?: (error?: Error, gas?: number) => void): Promise <TransactionConfig | Error> {
        if (transactionConfig.gas !== undefined) {
            return transactionConfig;
        }

        var gas: number;
        try {
            //gas = await this.estimateGas(signedTransaction);
            gas = await this.eth.estimateGas(transactionConfig, (error: Error, gas: number) => {
                //console.log("sengSigned gas: " + gas)  //21000
                if (callback === undefined && error !== undefined) {
                    throw error;
                }
                if (callback !== undefined && error !== undefined) {
                    callback(error, undefined);
                    return;
                }
            });
        } catch (error) {
            if (!callback) {
                throw error;
                //return Promise.reject(error);
            }
            //callback(error, undefined);
            callback(error);
            return error;
        }

        transactionConfig.gas = gas;
        return transactionConfig;
    }

    /**
     * sendSigned() is based on eth_accounts
     * and uses the private key set in this._account.privateKey.
     * @param transactionConfig
     * @param callback
     * @returns Promise<TransactionReceipt | Error>
     */
    public async sendSigned(transactionConfig: TransactionConfig, callback?: (error?: Error, receipt?: TransactionReceipt) => void): Promise<TransactionReceipt | Error> {
        var gas: number = 0;
        var receipt: TransactionReceipt;

        if (transactionConfig.from === undefined && this.defaultAccount !== null) {
            //this.eth.defaultAccount
            transactionConfig.from = this.defaultAccount
        }

        if (transactionConfig.from === undefined && this._account !== undefined) {
            transactionConfig.from = this._account.address;
        }

        if (this._account?.privateKey === undefined) {
            if (callback !== undefined) {
                callback(Error("private key not set"));
            }
            return Error("private key not set");
        }

        // get gas price

        var transactionConfigOrError: TransactionConfig | Error = await this.getGasPriceIfNeeded(transactionConfig, (error?: Error, gasPrice?: string) => {
            if (callback === undefined && error !== undefined) {
                throw error;
            }
            if (callback !== undefined && error !== undefined) {
                callback(error);
                return error;
            }
        });
        /*
        if (this.isTransactionConfig(transactionConfigOrError)) {
            console.log(transactionConfigOrError);
            transactionConfig = transactionConfigOrError;
        } */

        // estimate gas

        var transactionConfigOrError: TransactionConfig | Error = await this.estimateGasIfNeeded(transactionConfig, (error?: Error, gas?: number) => {
            if (callback === undefined && error !== undefined) {
                throw error;
            }
            if (callback !== undefined && error !== undefined) {
                //callback(error, undefined);
                callback(error);
                return error;
            }
        });

        if (!(this.isTransactionConfig(transactionConfigOrError))) {
            return transactionConfigOrError;
        }

        transactionConfig = transactionConfigOrError;

        console.log("sendSigned transaction.gasPrice: " + transactionConfig.gasPrice);
        console.log("sendSigned transaction.gas: " + transactionConfig.gas);

        try {
            //const pk: string = this._account.privateKey
            var signedTransaction: SignedTransaction = await this.eth.accounts.signTransaction(transactionConfig, this._account.privateKey);

            if (signedTransaction.rawTransaction === null || signedTransaction.rawTransaction === undefined) {
                if (callback !== undefined) {
                    callback(Error("raw transaction is null or undefined"), undefined);
                }
                return Error("raw transaction is null or undefined");
            }

            receipt = await this.eth.sendSignedTransaction(signedTransaction.rawTransaction, (error: Error, hash: string) => {
                console.log("hash: " + hash)
                if (callback !== undefined && error !== undefined) {
                    //callback(error, undefined);
                    callback(error);
                }
                return error;
            });
        } catch (error) {
            if (!callback) {
                throw error;
                //return Promise.reject(error);
            }
            //callback(error, undefined);
            callback(error);
            return error;
        }

        if (callback) {
            callback(undefined, receipt);
        }

        return receipt;
    }

    /**
     * sendSignedTransaction() is based on personal_signTransaction.
     * Not supported by Ganache.
     * @param transactionConfig
     * @param password
     * @param callback
     * @returns Promise<TransactionReceipt | undefined>
     */
    public async sendSignedTransaction(transactionConfig: TransactionConfig, password: string, callback?: (error?: Error, receipt?: TransactionReceipt) => void): Promise<TransactionReceipt | undefined> {
        if (transactionConfig.from === undefined && this.defaultAccount !== null) {
            transactionConfig.from = this.defaultAccount
        }

        try {
            var gas = await this.eth.estimateGas(transactionConfig, (error: Error, gas: number) => {
                //console.log("sengSigned gas: " + gas)  //21000
                if (callback !== undefined && error !== undefined) {
                    callback(error, undefined);
                }
                return;
            });
            transactionConfig.gas = gas;
            console.log("sendSigned transaction.gas: " + transactionConfig.gas);
            console.log("sendSigned transaction.gasPrice: " + transactionConfig.gasPrice);
            console.log("sendSigned transaction.value: " + transactionConfig.value);

            var transactionConfig = {from: transactionConfig.from,
                to: transactionConfig.to,
                value: transactionConfig.value} as TransactionConfig

            var encodedTransaction: RLPEncodedTransaction = await this.eth.personal.signTransaction(transactionConfig, password);
            var transactionReceipt: TransactionReceipt = await this.eth.sendSignedTransaction(encodedTransaction.raw, (error: Error, hash: string) => {
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
            callback(error);
            return;
        }

        if (callback) {
            callback(undefined, transactionReceipt);
        }
        return transactionReceipt;
    }

    /**
     * Returns the average gas limit for the latest blocks
     * in a specified number.
     * @param blockCount
     * @returns Promise<number>
     */
    public async getLatestAverageGasLimit(blockCount: number): Promise<number> {
        const latestBlockNumber: number = await this.eth.getBlockNumber();
        //const batchRequest = new this.eth.BatchRequest();
        var averageGasLimit: number = 0;

        //let blockNumbers = new Array(blockCount);
        for (var i = latestBlockNumber - blockCount; i <= latestBlockNumber; i++) {
            /*
            batchRequest.add(
                (this.eth.getBlock as any).request(i, function(){})
            ); */
            var block: BlockTransactionString = await this.eth.getBlock(i);
            averageGasLimit += block.gasLimit;
        }

        averageGasLimit /= blockCount;
        return averageGasLimit;
    }

    /**
     * Gets the average gas price for the latest transactions
     * in the given number of blocks.
     * TODO: Median would prevent statistical outlier.
     * @param blockCount
     * @return Promise<number>
     */
    public async getLatestAverageGasPriceAsync(blockCount: number): Promise<number> {
        var latestBlockNumber: number = await this.eth.getBlockNumber();
        var averageGasPrice: number = 0;
        var transactionCount: number = 0;

        var block: BlockTransactionString = await this.eth.getBlock(latestBlockNumber);
        if (block.number === null) {
            latestBlockNumber--;
        }

        //let blockNumbers = new Array(blockCount);
        for (let blockNumber = latestBlockNumber - blockCount + 1; blockNumber <= latestBlockNumber; blockNumber++) {
            /*
            var block: BlockTransactionString = await this.eth.getBlock(blockNumber);
            //const txCount = block.transactions.length;
            //console.log(block.transactions);
            for (let txIndex = 0; txIndex < block.transactions.length; txIndex++) {
                const txHash = block.transactions[txIndex];
                const transaction = await this.eth.getTransaction(txHash);
                //const transaction = await this.eth.getTransactionFromBlock(blockNumber, txIndex);
                console.log(transaction);
                const gasPrice = Number(transaction.gasPrice);
                averageGasPrice += gasPrice;
            } */

            var blockObj: BlockTransactionObject = await this.eth.getBlock(blockNumber, true);
            //console.log(blockObj.transactions);
            for (let txIndex = 0; txIndex < blockObj.transactions.length; txIndex++) {
                const transaction = blockObj.transactions[txIndex];
                //console.log(transaction);
                const gasPrice = Number(transaction.gasPrice);
                averageGasPrice += gasPrice;
            }

            transactionCount += blockObj.transactions.length;
        }

        console.log("transaction count: " + transactionCount);

        return averageGasPrice /= transactionCount;
    }

    public getLatestAverageGasPrice(blockCount: number, callback: (error?: Error, gasPrice?: number) => void) {
        var averageGasPrice: number = 0;
        var transactionCount: number = 0;

        this.eth.getBlockNumber((error: Error, latestBlockNumber: number) => {
            //if (error !== null && error !== undefined) {
            if (error) {
                callback(error);
                return;
            }
            for (let blockNumber = latestBlockNumber - blockCount + 1; blockNumber <= latestBlockNumber; blockNumber++) {
                this.eth.getBlock(blockNumber, true, (error: Error, block: BlockTransactionObject) => {
                    //if (error !== null && error !== undefined) {}
                    if (error) {
                        callback(error);
                        return;
                    }
                    for (let txIndex = 0; txIndex < block.transactions.length; txIndex++) {
                        const transaction = block.transactions[txIndex];
                        console.log(transaction);
                        //console.log(transaction.gasPrice);
                        const gasPrice = Number(transaction.gasPrice);
                        //console.log(gasPrice);
                        averageGasPrice += gasPrice;
                    }

                    transactionCount += block.transactions.length;
                    //console.log(averageGasPrice);
                    //console.log(transactionCount);
                    if (blockNumber == latestBlockNumber) {
                        console.log("transaction count: " + transactionCount);
                        averageGasPrice /= transactionCount;
                        callback(undefined, averageGasPrice);
                    }
                });
            }
        });
    }

    public getAverageGasPrice(blockCount: number, callback?: (error?: Error, gasPrice?: number) => void): Promise<number> {
        const promise = new Promise((resolve: (value: any) => void, reject: (reason?: any) => void) => {
            var averageGasPrice: number = 0;
            var transactionCount: number = 0;

            this.eth.getBlockNumber((error: Error, latestBlockNumber: number) => {
                //if (error !== null && error !== undefined) {
                if (error) {
                    //callback(error);
                    reject(error);
                }
                for (let blockNumber = latestBlockNumber - blockCount + 1; blockNumber <= latestBlockNumber; blockNumber++) {
                    this.eth.getBlock(blockNumber, true, (error: Error, block: BlockTransactionObject) => {
                        //if (error !== null && error !== undefined) {}
                        if (error) {
                            //callback(error);
                            reject(error);
                        }
                        for (let txIndex = 0; txIndex < block.transactions.length; txIndex++) {
                            const transaction = block.transactions[txIndex];
                            //console.log(transaction);
                            const gasPrice = Number(transaction.gasPrice);
                            averageGasPrice += gasPrice;
                        }
                        transactionCount += block.transactions.length;
                        if (blockNumber == latestBlockNumber) {
                            console.log("transaction count: " + transactionCount);
                            averageGasPrice /= transactionCount;
                            resolve(averageGasPrice);
                        }
                    });
                }
                //averageGasPrice /= transactionCount;
                ////callback(undefined, averageGasPrice);
                //resolve(averageGasPrice);
            });
        });

        if (callback) {
            //promise.then(callback.bind(null, null), callback);
            promise.then(callback.bind(undefined, undefined), callback);
        }

        return promise;
    }

    public async call(transaction: any, callback?: (error?: Error, receipt?: Object) => void): Promise<any> {
        var gas: Number | Error = 0;
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