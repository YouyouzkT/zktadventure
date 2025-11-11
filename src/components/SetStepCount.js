// SetStepCount.js
import React, { useState, useContext } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function SetStepCount({ adventureID, setAdventureID }) {
  const { web3 } = useContext(WalletContext);
  const contractAddress = "0xb9119B26031E73932FdfAC205D814bb2A73CfcB2";
  const [stepCount, setStepCount] = useState('');
  const [isSetting, setIsSetting] = useState(false);

  const setStepCountHandler = async () => {
    if (web3 && adventureID && stepCount) {
      try {
        setIsSetting(true);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();
        await contract.methods.setStepCount(parseInt(adventureID), parseInt(stepCount)).send({
          from: accounts[0],
          gasLimit: '200000',
          gasPrice: await web3.eth.getGasPrice(),
        });
        alert('Step count set successfully!');
      } catch (error) {
        console.error('Error setting step count:', error);
        alert('Error setting step count: ' + error.message);
      } finally {
        setIsSetting(false);
      }
    } else {
      alert('Please connect your wallet and enter valid inputs!');
    }
  };

  return (
    <div className="set-step-count-box">
      <input
        type="text"
        placeholder="Adventure ID"
        value={adventureID} // Prérempli avec l'ID
        onChange={(e) => setAdventureID(e.target.value)} // Permet la modification
      />
      <input
        type="text"
        placeholder="Step Count"
        value={stepCount}
        onChange={(e) => setStepCount(e.target.value)}
      />
      <button onClick={setStepCountHandler} disabled={isSetting}>
        {isSetting ? 'Setting Step Count...' : '2- Set Step Count'}
      </button>
    </div>
  );
}

export default SetStepCount;
