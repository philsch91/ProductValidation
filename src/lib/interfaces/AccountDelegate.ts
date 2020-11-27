import { Web3Session } from "../Web3Session";
import { Account } from './account';

export interface AccountDelegate {
    balanceDidChange(session: Web3Session, account: Account): void;
}