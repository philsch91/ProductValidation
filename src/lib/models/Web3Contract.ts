import Web3 from 'web3';
import { Contract, ContractOptions, ContractSendMethod, SendOptions, DeployOptions } from 'web3-eth-contract';
import { Personal } from 'web3-eth-personal';
import { Accounts } from 'web3-eth-accounts';
import { AbiItem } from 'web3-utils';

/*
export class Web3Contract extends Contract {
    //private accountUpdateTimerId: number | null = null;
    //private accountUpdateFlag: boolean = false;

    public constructor(jsonInterface: AbiItem[], address?: string, options?: ContractOptions){
        super(jsonInterface, address, options);
    }

    public async estimateGasSync(sendMethod: ContractSendMethod): Promise<Number> {
        const gas: Number = await sendMethod.estimateGas();
        return gas;
    }

    public async sendSync(sendMethod: ContractSendMethod, sendOptions: SendOptions): Promise<Web3Contract> {
        const contract: Web3Contract = await sendMethod.send(sendOptions) as Web3Contract;
        return contract;
    }

    public async install(deployOptions: DeployOptions, sendOptions: SendOptions): Promise<Web3Contract> {
        const sendMethod = super.deploy(deployOptions);
        const gas = await this.estimateGasSync(sendMethod);
        const contract = await this.sendSync(sendMethod, sendOptions);
        return contract;
    }
}

*/