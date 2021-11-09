const assert = require('assert');
const Web3 = require('web3');
const ganache = require('ganache-core');
const { describe, beforeEach } = require('mocha');
const contract = require('../compile');

const web3 = new Web3(ganache.provider());

const abi = contract.abi;
const bytecode = contract.evm.bytecode.object;

let lottery;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode })
        .send({
            from: accounts[0],
            gas: 1000000
        });
});

describe('Lottery Contract', () => {
    it('Is deployed', () => {
        assert.ok(lottery.options.address);
    });

    it('Adds a player', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('.0000000000002', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[1], players[0]);
        assert.equal(1, players.length);
    });

    it('Adds multiple players', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('.0000000000002', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('.0000000000002', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('.0000000000002', 'ether')
        });


        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[1], players[0]);
        assert.equal(accounts[2], players[1]);
        assert.equal(accounts[3], players[2]);
        assert.equal(3, players.length);
    });

    it('Requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[1],
                value: 0
            });
            assert(false);
        }
        catch (err) {
            assert(err);
        }
    });

    it('Only the manager can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1], // Not the manager
            });
            assert(false)
        }
        catch (err) {
            assert(err)
        }
    });

    it('Sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        assert(finalBalance > initialBalance);

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert.equal(players.length, 0);

        const lotteryBalance = await web3.eth.getBalance(lottery.options.address);
        assert.equal(lotteryBalance, 0);
    });
});