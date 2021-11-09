// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address[] public players;
    address public lastWinner;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .0000000000001 ether);
        players.push(msg.sender);
    }

    function toBytes(uint256 x) private pure returns (bytes memory b) {
        b = new bytes(32);
        assembly {
            mstore(add(b, 32), x)
        }
    }

    function getRandomNumber() private view returns (uint) {
        uint256 source = block.difficulty + block.timestamp + players.length;
        bytes memory source_b = toBytes(source);
        return uint(keccak256(source_b));
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

    function pickWinner() public restricted payable {
        uint winnerIndex = getRandomNumber() % players.length;
        address winner = players[winnerIndex];
        lastWinner = winner;
        payable(winner).transfer(address(this).balance);
        players = new address[](0);
    }

    function getPlayers() public view returns(address[] memory) {
        return players;
    } 
}