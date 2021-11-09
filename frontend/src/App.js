import { useState, useEffect } from 'react'
import './App.css';
import web3 from './web3';

export default function App() {
    const [accounts, setAccounts] = useState([]);
    useEffect(() => {
        (async () => {
            const accounts = await web3.eth.getAccounts()
            setAccounts(accounts);
        })()
    }, [])
    return (
        <div>
            <h1>Whatever</h1>
            {accounts.map((account) => {
                return <p>{account}</p>
            })}
        </div>
    );
}
