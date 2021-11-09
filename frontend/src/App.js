import { useState, useEffect } from 'react'
import './App.css';
import web3 from './web3';
import lottery from './lottery';

export default function App() {
    const [manager, setManager] = useState('');
    const [players, setPlayers] = useState([]);
    const [balance, setBalance] = useState('');
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            const manager = await lottery.methods.manager().call();
            const players = await lottery.methods.getPlayers().call();
            const balance = await web3.eth.getBalance(lottery.options.address);

            setManager(manager);
            setPlayers(players);
            setBalance(balance);
        }
        if (message !== 'Sorry, an error ocurred') fetchData()
    }, [message]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        setMessage('Waiting on transaction success...')
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei(amount, 'ether')
            });
            setMessage('You have been entered!')
        }
        catch (err) {
            console.log(err)
            setMessage('Sorry, an error ocurred')
        }
    };

    const handleClick = async () => {
        const accounts = await web3.eth.getAccounts();
        setMessage('Waiting on transaction success...')
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
            const winner = await lottery.methods.manager().call();
            console.log(winner)
            setMessage(`The winner is ${winner}`)
        }
        catch (err) {
            console.log(err)
            setMessage('Sorry, an error ocurred')
        }
    };

    return (
        <div>
            <h2>Lottery Contract</h2>
            <p>This contract is managed by {manager}</p>
            <p>There are currently {players.length} people entered, competing to win {web3.utils.fromWei(balance, 'ether')} ether!</p>

            <hr />

            <form onSubmit={(e) => handleSubmit(e)}>
                <h4>Want to try your luck?</h4>
                <div>
                    <label htmlFor="amount">Amount of ether to enter</label>
                    <input type="number" name="amount"
                        value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <button type="submit">Enter</button>
            </form>

            <hr />

            <h4>Ready to pick a winner?</h4>
            <button onClick={() => handleClick()}>Pick a winner</button>

            <hr />

            <h3>{message}</h3>
        </div>
    );
}
