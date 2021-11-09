const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const contract = require('./compile');
require('dotenv').config();

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

const provider = new HDWalletProvider({
    mnemonic: {
        phrase: process.env.MNEMONIC
    },
    providerOrUrl: process.env.RINKEBY_URL
});

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: "0x" + bytecode })
        .send({ from: accounts[0] });

    console.log(abi)
    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
};

deploy();