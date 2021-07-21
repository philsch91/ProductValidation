import * as fs from 'fs';
import * as path from 'path';

//const abiPath = path.join(__dirname, "contracts", "Deal_sol_Deal.abi");
//console.log(abiPath);

//const strBin = fs.readFileSync('/path/to/Contract.bin','utf8');
//const strAbi = fs.readFileSync('/path/to/Contract.abi','utf8');
const strBin = fs.readFileSync('contracts/Product_sol_Product.bin','utf8');
const strAbi = fs.readFileSync('contracts/Product_sol_Product.abi','utf8');
//console.log(strBin);
var abi = JSON.parse(strAbi);

var contract = {}
contract.bin = strBin;
contract.abi = abi;

let strContract = JSON.stringify(contract);
fs.writeFileSync('ProductContract.json',strContract);

const strSaleBin = fs.readFileSync('contracts/ProductSale_sol_ProductSale.bin','utf8');
const strSaleAbi = fs.readFileSync('contracts/ProductSale_sol_ProductSale.abi','utf8');
let saleAbi = JSON.parse(strSaleAbi);

var productSaleContract = {};
productSaleContract.bin = strSaleBin;
productSaleContract.abi = saleAbi;

let strProductSaleContract = JSON.stringify(productSaleContract);
fs.writeFileSync('ProductSaleContract.json',strProductSaleContract);
