// PlayerStats.js
import React, { useContext, useState } from 'react';
import { WalletContext } from './WalletProvider';
import contractABI from '../contractABI.json';
import Web3 from 'web3';

function PlayerStats() {
  const { web3, account } = useContext(WalletContext);
  const [adventureID, setAdventureID] = useState('');
  const [aliveCount, setAliveCount] = useState(null);
  const [deadCount, setDeadCount] = useState(null);
  const [winnerCount, setWinnerCount] = useState(null);
  const [alivePlayers, setAlivePlayers] = useState([]);
  const [deadPlayers, setDeadPlayers] = useState([]);
  const [winnerPlayers, setWinnerPlayers] = useState([]);
  const [playerStatus, setPlayerStatus] = useState('');
  const contractAddress = "0xb9119B26031E73932FdfAC205D814bb2A73CfcB2";

  const getStats = async () => {
    if (web3 && adventureID) {
      try {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const alive = await contract.methods.getAlivePlayerCount(parseInt(adventureID)).call();
        const { 0: aliveAddresses, 1: alivePseudos } = await contract.methods.getAlivePlayersWithPseudo(parseInt(adventureID)).call();
        console.log("Nombre de joueurs vivants :", alive);
        setAliveCount(alive.toString());
        setAlivePlayers(alivePseudos);

        const dead = await contract.methods.getDeadPlayerCount(parseInt(adventureID)).call();
        const { 0: deadAddresses, 1: deadPseudos } = await contract.methods.getDeadPlayersWithPseudo(parseInt(adventureID)).call();
        console.log("Nombre de joueurs morts :", dead);
        setDeadCount(dead.toString());
        setDeadPlayers(deadPseudos);

        const winners = await contract.methods.getWinnerCount(parseInt(adventureID)).call();
        const { 0: winnerAddresses, 1: winnerPseudos } = await contract.methods.getWinners(parseInt(adventureID)).call();
        console.log("Nombre de gagnants :", winners);
        setWinnerCount(winners.toString());
        setWinnerPlayers(winnerPseudos);

        // Determine player's status
        if (aliveAddresses.includes(account)) {
          setPlayerStatus('🤠Alive🤠');
        } else if (deadAddresses.includes(account)) {
          setPlayerStatus('😵Dead😵');
        } else if (winnerAddresses.includes(account)) {
          setPlayerStatus('🥳Winner🥳');
        } else {
          setPlayerStatus('😟Not Registered😟');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
        alert('Erreur lors de la récupération des statistiques : ' + error.message);
      }
    } else {
      alert('Veuillez entrer un ID d\'aventure valide et connecter votre wallet!');
    }
  };

  return (
    <div className="stats-container">
    <div className="stats-box">
      <h3 className="title-border-h3">Adventure info</h3>
      <input
        type="text"
        placeholder="Adventure ID"
        value={adventureID}
        onChange={(e) => setAdventureID(e.target.value)}
      />
      <button onClick={getStats}>Get Stat</button>
      {aliveCount !== null && (
        <div>
          {playerStatus && (
        <div>
          <p><strong>Your Status:</strong> {playerStatus}</p>
        </div>
      )}
          <p><strong>⚔️Alive Adventurer⚔️ :</strong> {aliveCount}</p>
          <ul>
            {alivePlayers.map((pseudo, index) => (
              <li key={index}>{pseudo}</li>
            ))}
          </ul>
        </div>
      )}
      {deadCount !== null && (
        <div>
          <p><strong>🪦Dead Adventurer🪦 :</strong> {deadCount}</p>
          <ul>
            {deadPlayers.map((pseudo, index) => (
              <li key={index} style={{ textDecoration: 'line-through' }}>{pseudo}</li>
            ))}
          </ul>
        </div>
      )}
      {winnerCount !== null && (
        <div>
          <p><strong>👑Winners👑 :</strong> {winnerCount}</p>
          <ul>
            {winnerPlayers.map((pseudo, index) => (
              <li key={index}>{pseudo}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}

export default PlayerStats;