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
    
    public static loadWeb3(){
        /*
        if(window.web3 !== undefined){
            return new Web3(window.web3.currentProvider);
        }
        */
    }

    public async getBalanceSync(address: string): Promise<string> {
        const balance: string = await this.eth.getBalance(address);
        return balance;
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
        //this.accountUpdateFlag = true;
        //this.updateAccountWithTimeout();
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

    public async send(transaction: Object, callback?: (error?: Error, receipt?: Object) => void): Promise<any> {
        return;
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