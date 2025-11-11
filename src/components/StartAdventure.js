// StartAdventure.js
import React, { useState, useContext } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function StartAdventure() {
  const { web3 } = useContext(WalletContext);
  const contractAddress = "0xb9119B26031E73932FdfAC205D814bb2A73CfcB2";
  const [adventureID, setAdventureID] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const startAdventureHandler = async () => {
    if (web3 && adventureID) {
      try {
        setIsStarting(true);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();
        await contract.methods.startAdventure(parseInt(adventureID)).send({ from: accounts[0],
          gasLimit: '200000', // Modification de la configuration de gas pour les réseaux sans EIP-1559
          gasPrice: await web3.eth.getGasPrice(),
         });
        alert('Adventure started successfully!');
      } catch (error) {
        console.error('Error starting adventure:', error);
        alert('Error starting adventure: ' + error.message);
      } finally {
        setIsStarting(false);
      }
    } else {
      alert('Please connect your wallet and enter a valid Adventure ID!');
    }
  };

  return (
    <div className="start-adventure-box">
      <input
        type="text"
        placeholder="Adventure ID"
        value={adventureID}
        onChange={(e) => setAdventureID(e.target.value)}
      />
      <button onClick={startAdventureHandler} disabled={isStarting}>
        {isStarting ? 'Starting Adventure...' : '4- Start Adventure'}
      </button>
    </div>
  );
}

export default StartAdventure;
