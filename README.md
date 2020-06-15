# ProductValidation

### Setup

1. npm install -g typescript
2. npx create-react-app ProductValidation --typescript
3. cd ProductValidation
4. npm install web3
5. npm install --save react-router-dom
6. npm install --save @types/react-router-dom
7. npm install axios

### Truffle Setup
1. npm install -g truffle
2. npm install --save @types/jest
3. truffle init
4. configure networks in truffle-config.js
5. configure solc compiler in truffle-config.js
6. write contracts in Solidity and place them in ./contracts
7. deploy contracts in the Blockchain with 2_deploy_contracts.js
8. truffle test [Truffle testing documentation](http://truffleframework.com/docs/getting_started/testing)
9. truffle compile
10. truffle migrate [Truffle migrations documentation](http://truffleframework.com/docs/getting_started/migrations)

### Solc-js Setup
1. npm install -g solc [GitHub Solc-js](https://github.com/ethereum/solc-js)
2. check Solidity compiler version with `solc-js --version`

### Compile Solidity Smart Contracts
1. Compile bytecode and Application Binary Interface (ABI) with `solcjs --bin --abi Contract.sol`
2. Combine both in a single file with the adapted `combine-contract.js`
3. Copy the written file into to source code directory
