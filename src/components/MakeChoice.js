// MakeChoice.js
import React, { useContext, useState } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function MakeChoice() {
  const { account, web3 } = useContext(WalletContext);
  const [adventureID, setAdventureID] = useState('');
  const [stepNumber, setStepNumber] = useState('');
  const [choice, setChoice] = useState('');
  const contractAddress = "0x2Bd681591C62570e4B2940F1B370d28945C14be8";

  const makeChoice = async () => {
    if (web3 && account) {
      try {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        await contract.methods.makeChoice(adventureID, stepNumber, choice).send({
          from: account,
          gasLimit: '200000', // Modification de la configuration de gas pour les réseaux sans EIP-1559
          gasPrice: await web3.eth.getGasPrice()
        });
        alert('Choix enregistré avec succès !');
      } catch (error) {
        console.error('Erreur lors de l interaction avec le contrat:', error);
      }
    } else {
      alert('Connectez d\'abord votre wallet!');
    }
  };

  return (
    <div>
      <h3>Faites votre choix pour l'étape</h3>
      <input
        type="text"
        placeholder="ID de l'aventure"
        value={adventureID}
        onChange={(e) => setAdventureID(e.target.value)}
      />
      <input
        type="text"
        placeholder="Numéro de l'étape"
        value={stepNumber}
        onChange={(e) => setStepNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Votre choix"
        value={choice}
        onChange={(e) => setChoice(e.target.value)}
      />
      <button onClick={makeChoice}>Valider le choix</button>
    </div>
  );
}

export default MakeChoice;