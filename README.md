# ProductValidation

### Setup

1. `npm install -g typescript`
2. `npx create-react-app ProductValidation --typescript`
3. `cd ProductValidation`
4. `npm install web3`
5. `npm install --save react-router-dom`
6. `npm install --save @types/react-router-dom`
7. `npm install axios`

### Truffle Setup
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

### Solc-js Setup
1. `npm install -g solc` [GitHub Solc-js](https://github.com/ethereum/solc-js)
2. Check Solidity compiler version with `solc-js --version`

### Compile and Use Solidity Smart Contracts
1. Compile bytecode and Application Binary Interface (ABI) with `solcjs --bin --abi Contract.sol`
2. Combine both in a single file with the adapted `combine-contract.js`
3. Copy the written file into to source code directory, e.g. /src/static/Contract.json
4. Import the file with the bytecode and ABI in the code, i.e. `import contract from './static/Contract.json'`;
