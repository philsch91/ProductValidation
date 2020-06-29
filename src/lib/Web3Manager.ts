import Web3 from 'web3';
import { Contract, ContractOptions, ContractSendMethod, SendOptions, DeployOptions } from 'web3-eth-contract';
import { Personal } from 'web3-eth-personal';
import { Accounts } from 'web3-eth-accounts';
import { Account } from './interfaces/account';
import { AccountDelegate } from './interfaces/AccountDelegate';

export class Web3Manager extends Web3 {
    private accountUpdateTimerId: number | null = null;
    private accountUpdateFlag: boolean = false;
    public accountDelegate: AccountDelegate | null = null;

    public constructor(){
        super();
        this.updateAccount = this.updateAccount.bind(this);
    }

    public async getAccountsSync(): Promise<string[]> {
        const addresses: string[] = await this.eth.getAccounts();
        return addresses;
    }

    public async readAccountsAndBalances(callback: (error: Error, accounts: Account[]) => void){
        var error: Error = new Error();
        var addresses: string[];
        var accountList: Account[] = new Array();
        
        try {
            addresses = await this.getAccountsSync();    
        } catch (error) {
            callback(error, accountList);
            return;
        }
        
        console.log(addresses);
        
        accountList = new Array(addresses.length);
        var i = 0;
        
        for(let key in addresses){
            const address: string = addresses[key];
            console.log(address);
            //let account: Account = {id:"0", name:"test"};
            let account = {name: i.toString(), address: address, privateKey: "", balance: ""} as Account;
            var balance: string = "";
            
            try {
                balance = await this.eth.getBalance(address);
            } catch (e) {
                error = e;
            }
            
            account.balance = balance;
            accountList[i] = account;
            i++;
        }
        
        callback(error, accountList);
    }

    public readAccounts(callback: (error: Error, accounts: Account[]) => void ) {
        this.eth.getAccounts((error: Error, accounts: string[]) => {
            console.log(accounts);
            var accountList:Account[] = new Array(accounts.length);
            var i = 0;
            
            for(let key in accounts){
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
        if(this.accountUpdateTimerId == null){
            return;
        }
        clearInterval(this.accountUpdateTimerId);
    }

    private async updateAccount(): Promise<void> {
        const address = this.eth.defaultAccount;
        if(address == null){
            return;
        }

        const balance = await this.eth.getBalance(address);
        let account = {address: address, balance: balance} as Account;
            
        if(this.accountDelegate == null){
            return;
        }
        
        this.accountDelegate.balanceDidChange(this, account);
    }

    private async updateAccountWithTimeout(): Promise<void> {
        const address = this.eth.defaultAccount;
        if(address == null){
            return;
        }
        
        while(this.accountUpdateFlag){
            const balance = await this.eth.getBalance(address);
            let account = {address: address, balance: balance} as Account;
            
            if(this.accountDelegate == null){
                break;
            }
            //var func = function(){};
            //var t = this.accountDelegate.balanceDidChange(this, account);
            setTimeout(this.accountDelegate.balanceDidChange, 5000, this, account);
        }
    }

    public async unlockAccountSync(address: string, password: string, unlockduration: number, callback: (status: boolean) => void){
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
            newContract = await sendMethod.send(sendOptions,(error: Error, txHash: string) => {
                if (error != null) {
                    // TODO: move console.log() into application specific callback
                    console.log(error);
                    throw error;
                }
                // TODO: move console.log() into application specific callback
                console.log(txHash);
                transactionHash = txHash;
              });
        } catch (error) {
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

    public async send(transaction: any, callback?: (error?: Error, receipt?: Object) => void): Promise<any> {
        var gas: Number = 0;
        var receipt: Object;
        
        try {
            //gas = await transaction.estimateGas({from: this.eth.defaultAccount});
            gas = await this.estimateGas(transaction);
            receipt = await transaction.send({from: this.eth.defaultAccount, gas: gas});
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