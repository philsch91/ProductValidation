import { Web3Manager } from '../Web3Manager';

export class Web3NodeManager extends Web3Manager {
    private static instance: Web3Manager;

    private constructor(){
        super();
    }

    public static getInstance(): Web3Manager {
        if(this.instance == null){
            this.instance = new Web3Manager();
        }

        return this.instance;
    }
}