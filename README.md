# ProductValidation

## Introduction

- Maximum Gas per Block = 3141592
- Total Cost of Transaction = Gas Limit * Gas Price
- Default (minimum) Gas Limit = 21000
- Default Gas Price = 20 GWei = 20.000.000.000 (2e10) Wei = 0,00000002 (2e-8) Ether
- Default Transaction Cost = 21000 * 20 GWei = 0,00042 Ether

#### Gas Limit

Additional, or unused, gas is refunded to your account at the end of the transaction.

##### Normal Transactions

For example, if the gas limit for the transaction, as the maximum gas provided, is set to 100000, the amount of gas returned to the account is determined by the quotation: Gas = 100000 - 21000 * x

##### Contract Calls

Beware: If Ether is sent to a contract and the transaction fails, the entire gas limit is charged.

#### Gas Price

- 40 GWei Gas Price will almost always be mined in the next blockchain block.
- 20 Gwei will usually be mined within the next few blocks.
- 10 Gwei will be calculated within the next few minutes.

### Setup

1. `npm install -g typescript`
2. `npx create-react-app ProductValidation --typescript`
3. `cd ProductValidation`
4. `npm install web3`
5. `npm install --save react-router-dom`
6. `npm install --save @types/react-router-dom`
7. `npm install axios`
8. `npm install sockjs-client`
9. `npm install --save @types/sockjs-client`
10. `npm install stompjs`
11. `npm install --save @types/stompjs`

### Update Dependencies
- `npm outdated`
- `npm update`
- `npm update "react" "react-dom"`
- `npm install <packagename>@latest [<packagename2>@latest]`

### Solc-js Setup
1. `npm install -g solc` [GitHub Solc-js](https://github.com/ethereum/solc-js)
2. Check Solidity compiler version with `solcjs --version`

### Truffle Setup

Truffle includes Mocha and Chai for testing smart contracts in JavaScript. Mocha is used as the testing framework and Chai for assertions.
Instead of the `describe` function, Truffle provides and uses the `contract` function.
In contrast to the `describe`function, the `contract` function should make sure that the contracts are redeployed in the running Ethereum blockchain via the configured client for a clean state in terms of the contracts. In addition to that, the `contract` function is called with a list of accounts that can be used in the contained test case functions.

1. `npm install -g truffle`
2. `npm install --save @types/jest`
3. `truffle init`
4. Configure networks in truffle-config.js
5. Configure installed solc compiler in truffle-config.js, i.e. `solcjs --version`
6. Write contracts in Solidity and place them in ./contracts
7. Add initial deployment script called ./migration/1_initial_migration.js for the Migration contract previously created with `truffle init`
8. Implement additional deployment scripts for Truffle with increasing prefix numbers in the filename, e.g. 2_deploy_contract.js
9. truffle test [Truffle testing documentation](http://truffleframework.com/docs/getting_started/testing)
10. truffle compile
11. truffle migrate [Truffle migrations documentation](http://truffleframework.com/docs/getting_started/migrations)

### Compile and Use Solidity Smart Contracts
1. Compile bytecode and Application Binary Interface (ABI) for your contract with `solcjs --bin --abi Contract.sol`
2. Adapt the template script `combine-contract.js` or `combine-contract.mjs` to combine the bytecode and ABI in a single file.
3. Execute the script with either `node combine-contract.mjs` or `node --experimental-modules combine-contract.mjs`
4. Copy the written file into to source code directory, e.g. /src/static/Contract.json
5. Import the file with the bytecode and ABI in the code, i.e. `import contract from './static/Contract.json'`;
