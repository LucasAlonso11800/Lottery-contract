const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const contract = require('./compile');
require('dotenv').config();

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.RINKEBY_URL
);

const web3 = new Web3(provider);

async function deploy() {
    const accounts = await web3.eth.getAccounts();

    await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({
            from: accounts[0],
            gas: 1000000
        });

    provider.engine.stop()
};

deploy()