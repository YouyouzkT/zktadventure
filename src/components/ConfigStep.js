// ConfigStep.js
import React, { useState, useContext } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function ConfigStep() {
  const { web3 } = useContext(WalletContext);
  const contractAddress = "0xb9119B26031E73932FdfAC205D814bb2A73CfcB2";
  const [adventureID, setAdventureID] = useState('');
  const [stepNumber, setStepNumber] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const configStepHandler = async () => {
    if (web3 && adventureID && stepNumber && options.every(opt => opt !== '')) {
      try {
        setIsConfiguring(true);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();
        await contract.methods.configStep(
          parseInt(adventureID),
          parseInt(stepNumber),
          options.map(opt => parseInt(opt))
        ).send({ from: accounts[0],
            gasLimit: '200000', // Modification de la configuration de gas pour les réseaux sans EIP-1559
            gasPrice: await web3.eth.getGasPrice(),
         });
        alert('Step configured successfully!');
      } catch (error) {
        console.error('Error configuring step:', error);
        alert('Error configuring step: ' + error.message);
      } finally {
        setIsConfiguring(false);
      }
    } else {
      alert('Please connect your wallet and enter valid inputs!');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="config-step-box">
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
      {options.map((option, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}
      <button onClick={configStepHandler} disabled={isConfiguring}>
        {isConfiguring ? 'Configuring Step...' : '3- Config Step'}
      </button>
    </div>
  );
}

export default ConfigStep;
