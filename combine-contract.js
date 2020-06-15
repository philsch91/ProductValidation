import * as fs from 'fs';
import * as path from 'path';

//const abiPath = path.join(__dirname, "contracts", "Deal_sol_Deal.abi");
//console.log(abiPath);

const strBin = fs.readFileSync('/path/to/Contract.bin','utf8');
const strAbi = fs.readFileSync('/path/to/Contract.abi','utf8');
//console.log(strBin);
var abi = JSON.parse(strAbi);

var contract = {}
contract.bin = strBin;
contract.abi = abi;

let strContract = JSON.stringify(contract);
fs.writeFileSync('DealContract.json',strContract);
