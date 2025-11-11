// RegisterPlayer.js
import React, { useContext, useState } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function RegisterPlayer() {
  const { account, web3 } = useContext(WalletContext);
  const [pseudo, setPseudo] = useState('');
  const [adventureID, setAdventureID] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const contractAddress = "0xb9119B26031E73932FdfAC205D814bb2A73CfcB2";

  const register = async () => {
    if (web3 && account) {
      try {
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Vérifier que l'Adventure ID existe
        const adventureCounter = await contract.methods.adventureCounter().call();
        if (parseInt(adventureID) > parseInt(adventureCounter)) {
          alert('Invalid Adventure ID. This adventure does not exist.');
          return;
        }

        // Vérifier que l'aventure est active
        const adventure = await contract.methods.adventures(adventureID).call();
        if (!adventure.isActive) {
          alert('The adventure is not active yet.');
          return;
        }

        // Vérifier que le pseudo n'est pas vide ou composé uniquement d'espaces blancs
        if (!pseudo.trim()) {
          alert('Please provide a valid pseudo.');
          return;
        }

        // Vérifier si le joueur est déjà enregistré
        const adventurer = await contract.methods.registeredAdventurers(adventureID, account).call();
        if (adventurer.isAlive) {
          alert('You are already registered for this adventure.');
          return;
        }

        // Vérifier si le pseudo est déjà utilisé (méthode alternative)
        const allPlayers = await contract.methods.getAlivePlayersWithPseudo(adventureID).call();
        if (allPlayers[1].includes(pseudo)) {
          alert('This pseudo is already taken. Please choose another one.');
          return;
        }

        setIsRegistering(true);

        // Effectuer l'inscription
        await contract.methods.register(adventureID, pseudo).send({
          from: account,
          gasLimit: '200000', // Modification de la configuration de gas pour les réseaux sans EIP-1559
          gasPrice: await web3.eth.getGasPrice()
        });

        alert('Welcome adventurer 3.0!');
      } catch (error) {
        console.error('Registering error:', error);
        alert('Registering error: ' + (error?.reason || error.message));
      } finally {
        setIsRegistering(false);
      }
    } else {
      alert('Please connect your wallet!');
    }
  };

  return (
    <div className="container centered">
  <h3 className="title-border-h3">Register yourself to a zkT Adventure!</h3>
  <input type="text" placeholder="Adventure ID" value={adventureID} onChange={(e) => setAdventureID(e.target.value)} />
  <input type="text" placeholder="Pseudo" value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
  <button onClick={register} disabled={isRegistering}>
    {isRegistering ? 'Registering...' : 'Register'}
  </button>
</div>

  );
}

export default RegisterPlayer;
