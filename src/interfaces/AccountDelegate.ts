import { Web3Manager } from "../Web3Manager";
import { Account } from '../models/account';

export interface AccountDelegate {
    balanceDidChange(manager: Web3Manager, account: Account): void;
}