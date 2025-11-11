// CreateAdventure.js
import React, { useState, useContext } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function CreateAdventure({ setAdventureID }) {
  const { web3 } = useContext(WalletContext);
  const contractAddress = "0xb9119B26031E73932FdfAC205D814bb2A73CfcB2";
  const [isCreating, setIsCreating] = useState(false);

  const createAdventure = async () => {
    if (web3) {
      try {
        setIsCreating(true);
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const accounts = await web3.eth.getAccounts();
        const result = await contract.methods.createAdventure().send({
          from: accounts[0],
          gasLimit: '200000',
          gasPrice: await web3.eth.getGasPrice(),
        });

        const newAdventureID = result.events.AdventureCreated.returnValues.adventureID; // Récupérer l'ID depuis l'événement
        setAdventureID(newAdventureID); // Met à jour l'état partagé
        alert(`Adventure created successfully! ID: ${newAdventureID}`);
      } catch (error) {
        console.error('Error creating adventure:', error);
        alert('Error creating adventure: ' + error.message);
      } finally {
        setIsCreating(false);
      }
    } else {
      alert('Please connect your wallet!');
    }
  };

  return (
    <div className="create-adventure-box">
      <button onClick={createAdventure} disabled={isCreating}>
        {isCreating ? 'Creating Adventure...' : '1- Create Adventure'}
      </button>
    </div>
  );
}

export default CreateAdventure;
