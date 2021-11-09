import { ABI } from './const/abi';
import { CONTRACT_ADDRESS } from './const/contractAddress';
import web3 from './web3';

export default new web3.eth.Contract(ABI, CONTRACT_ADDRESS)