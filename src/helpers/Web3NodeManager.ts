import { Web3Session } from '../lib/Web3Session';

export class Web3NodeManager extends Web3Session {
    private static instance: Web3Session;

    private constructor(){
        super();
    }

    public static getInstance(): Web3Session {
        if(this.instance == null){
            this.instance = new Web3Session();
        }

        return this.instance;
    }
}