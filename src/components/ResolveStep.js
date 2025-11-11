// ResolveStep.js
import React, { useState, useContext } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function ResolveStep() {
  const { web3 } = useContext(WalletContext);
  const contractAddress = "0xb9119B26031E73932FdfAC205D814bb2A73CfcB2";
  const [adventureID, setAdventureID] = useState('');
  const [stepNumber, setStepNumber] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  const resolveStepHandler = async () => {
    if (web3 && adventureID && stepNumber) {
      try {
        setIsResolving(true);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();
        await contract.methods.resolvestep(parseInt(adventureID), parseInt(stepNumber)).send({ from: accounts[0],
          ddgasLimit: '200000', // Modification de la configuration de gas pour les réseaux sans EIP-1559
          gasPrice: await web3.eth.getGasPrice(),
         });
        alert('Step resolved successfully!');
      } catch (error) {
        console.error('Error resolving step:', error);
        alert('Error resolving step: ' + error.message);
      } finally {
        setIsResolving(false);
      }
    } else {
      alert('Please connect your wallet and enter valid inputs!');
    }
  };

  return (
    <div className="resolve-step-box">
      <input
        type="text"
        placeholder="Adventure ID"
        value={adventureID}
        onChange={(e) => setAdventureID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Step Number"
        value={stepNumber}
        onChange={(e) => setStepNumber(e.target.value)}
      />
      <button onClick={resolveStepHandler} disabled={isResolving}>
        {isResolving ? 'Resolving Step...' : 'Resolve Step'}
      </button>
    </div>
  );
}

export default ResolveStep;
