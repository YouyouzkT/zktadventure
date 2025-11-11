// MakeChoice.js
import React, { useContext, useState, useEffect } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function MakeChoice() {
  const { account, web3 } = useContext(WalletContext);
  const [adventureID, setAdventureID] = useState('');
  const [stepNumber, setStepNumber] = useState('');
  const [choice, setChoice] = useState('');
  const [isMakingChoice, setIsMakingChoice] = useState(false);
  const [availableChoices, setAvailableChoices] = useState([]);
  const [yourChoice, setYourChoice] = useState(null);
  const contractAddress = "0xb9119B26031E73932FdfAC205D814bb2A73CfcB2";

  useEffect(() => {
    if (web3 && account && adventureID && stepNumber) {
      fetchStepChoices();
      fetchYourChoice();
    }
  }, [adventureID, stepNumber]);

  const fetchStepChoices = async () => {
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      // Appeler la fonction getStepChoices pour récupérer les choix disponibles pour une étape
      const choices = await contract.methods.getStepChoices(adventureID, stepNumber).call();
      setAvailableChoices(choices.map(choice => parseInt(choice))); // Conversion explicite en nombre
    } catch (error) {
      console.error('Error fetching step choices:', error);
    }
  };

  const fetchYourChoice = async () => {
    try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      // Appeler la fonction getYourChoice pour récupérer le choix de l'utilisateur pour une étape spécifique
      const choice = await contract.methods.getYourChoice(adventureID, stepNumber).call({ from: account });
      setYourChoice(parseInt(choice)); // Conversion explicite en nombre
    } catch (error) {
      console.error('Error fetching your choice:', error);
    }
  };

  const makeChoice = async () => {
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

        // Vérifier que l'étape précédente est résolue
        if (parseInt(stepNumber) > parseInt(adventure.lastResolvedStep) + 1) {
          alert('Previous step not resolved. You cannot proceed to this step yet.');
          return;
        }

        // Vérifier que le joueur est enregistré et vivant
        const adventurer = await contract.methods.registeredAdventurers(adventureID, account).call();
        if (!adventurer.isAlive) {
          alert('You cannot participate as you are either not registered or are already eliminated.');
          return;
        }

        // Vérifier que le joueur n'a pas déjà fait un choix pour cette étape
        if (yourChoice !== 0) {
          alert('You have already made a choice for this step.');
          return;
        }

        // Vérifier que le choix est parmi les options configurées
        if (!availableChoices.includes(parseInt(choice))) {
          alert('Invalid choice. Please select a valid option.');
          return;
        }

        setIsMakingChoice(true);

        // Effectuer le choix
        await contract.methods.makeChoice(adventureID, stepNumber, choice).send({
          from: account,
          gasLimit: '200000', // Modification de la configuration de gas pour les réseaux sans EIP-1559
          gasPrice: await web3.eth.getGasPrice()
        });

        alert('Your choice is registered!');
        fetchYourChoice(); // Mettre à jour le choix de l'utilisateur après validation
      } catch (error) {
        console.error('Something went wrong:', error);
        alert('Something went wrong: ' + (error?.reason || error.message));
      } finally {
        setIsMakingChoice(false);
      }
    } else {
      alert('Please connect your wallet!');
    }
  };

  return (
    <div className="choice-container">
      <div className="make-choice">
        <h3 className="title-border-h3">Make your choice!</h3>
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
        <input
          type="text"
          placeholder="Your choice"
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
        />
        <button onClick={makeChoice} disabled={isMakingChoice}>
          {isMakingChoice ? 'Validating...' : 'Validate'}
        </button>
      </div>
  
      <div className="step-info">
        <h3 className="title-border-h3">Step Information</h3>
        <h4>Available Choices:</h4>
        {availableChoices.length > 0 ? (
          <ul>
            {availableChoices.map((opt, index) => (
              <li key={index}>{opt}</li>
            ))}
          </ul>
        ) : (
          <p>No choices available for this step.</p>
        )}
        {yourChoice !== null && (
          <>
            <h4>Your Choice:</h4>
            <p>{yourChoice}</p>
          </>
        )}
      </div>
    </div>
  );  
}

export default MakeChoice;
