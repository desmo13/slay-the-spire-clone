import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(4);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isEnemyDefeated, setIsEnemyDefeated] = useState(false);
  const [isInMap, setIsInMap] = useState(true);
  const [challengeOptions, setChallengeOptions] = useState([
    { id: 1, type: 'event', name: 'Event Challenge', message: 'You gained +5 attack!', title: 'Event' },
    { id: 2, type: 'enemy', name: 'Enemy Challenge', enemyAttackDamage: 10, enemyHealth: 50, title: 'Enemy Encounter' },
    { id: 3, type: 'event', name: 'Gold Challenge', message: 'You found 20 gold!', gold: 20, healthPenalty: 5, title: 'Gold Event' },
  ]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeMessage, setChallengeMessage] = useState('');
  const [challengeTitle, setChallengeTitle] = useState('');

  const cards = [
    { name: 'Strike', cost: 1, damage: 10 },
    { name: 'Defend', cost: 1, defense: 5 },
    { name: 'Fireball', cost: 2, damage: 20 },
    { name: 'Heal', cost: 2, heal: 15 },
  ];

  const handleCardPlay = (card) => {
    if (isPlayerTurn) {
      if (card.damage && playerEnergy >= card.cost) {
        setEnemyHealth(enemyHealth - card.damage);
        setPlayerEnergy(playerEnergy - card.cost);
        if (enemyHealth - card.damage <= 0) {
          handleEnemyDefeat();
        }
      }
      if (card.heal && playerEnergy >= card.cost) {
        setPlayerHealth(playerHealth + card.heal);
        if (card.name === 'Defend') {
          setPlayerHealth(playerHealth - challengeOptions[selectedChallenge - 1]?.healthPenalty);
        }
      }
    }
    setIsPlayerTurn(false);
  };

  const handleEnemyTurn = () => {
    const enemyAttackDamage = 15;
    setPlayerHealth((prevPlayerHealth) => prevPlayerHealth - enemyAttackDamage);
    setIsPlayerTurn(true);
  };

  useEffect(() => {
    if (!isPlayerTurn) {
      setTimeout(() => {
        handleEnemyTurn();
        setPlayerEnergy(4);
      }, 4000); // Espera de 4 segundos antes de pasar al turno del jugador
    }
  }, [isPlayerTurn]);

  const handleEnemyDefeat = () => {
    setIsEnemyDefeated(true);
    setPlayerHealth(100); // Reiniciar la vida del jugador
    setEnemyHealth(100); // Reiniciar la vida del enemigo
  };

  const handleContinue = () => {
    setIsEnemyDefeated(false);
    setIsInMap(true);
    setSelectedChallenge(null);
  };

  const handleChallengeSelection = (challenge) => {
    setSelectedChallenge(challenge.id);
    if (challenge.type === 'event') {
      setChallengeTitle(challenge.title);
      setChallengeMessage(challenge.message);
      setIsInMap(false);
    } else if (challenge.type === 'enemy') {
      handleEnemyChallenge(challenge);
    }
  };

  const handleEventChallenge = (challenge) => {
    setChallengeTitle(challenge.title);
    setChallengeMessage(challenge.message);
  };

  const handleEnemyChallenge = (challenge) => {
    setEnemyHealth(challenge.enemyHealth);
    setPlayerHealth(100);
    setChallengeTitle(challenge.title);
    setChallengeMessage(`Enemy Attack Damage: ${challenge.enemyAttackDamage}\nEnemy Health: ${challenge.enemyHealth}`);
    setIsInMap(false);
    setIsEnemyDefeated(false);
    setSelectedChallenge(false);
  };

  const handleGoldChallenge = (challenge) => {
    setChallengeTitle(challenge.title);
    setChallengeMessage(`You found ${challenge.gold} gold!\nHealth Penalty: ${challenge.healthPenalty}`);
    setIsInMap(false);
  };

  const handleChallengeComplete = () => {
    setSelectedChallenge(null);
    setIsInMap(true);
  };

  return (
    <div className="App">
      <h1>Slay the Spire Clone</h1>
      {!isInMap && !isEnemyDefeated && !selectedChallenge && (
        <div>
          <div className="status">
            <p>Player Health: {playerHealth}</p>
            <p>Enemy Health: {enemyHealth}</p>
            <p>Player Energy: {playerEnergy}</p>
            <p>Turn: {isPlayerTurn ? 'Player' : 'Enemy'}</p>
          </div>
          <div className="cards">
            {cards.map((card, index) => (
              <button key={index} onClick={() => handleCardPlay(card)} disabled={!isPlayerTurn}>
                {card.name} ({card.cost} Energy)
              </button>
            ))}
          </div>
        </div>
      )}
      {isEnemyDefeated && (
        <div>
          <h2>Enemy Defeated!</h2>
          <button onClick={handleContinue}>Continue to Map</button>
        </div>
      )}
      {isInMap && (
        <div>
          <h2>Map</h2>
          <p>Select Next Challenge:</p>
          {challengeOptions.map((challenge) => (
            <button key={challenge.id} onClick={() => handleChallengeSelection(challenge)}>
              {challenge.name}
            </button>
          ))}
        </div>
      )}
      {selectedChallenge && (
        <div>
          <h2>{challengeTitle}</h2>
          <p>{challengeMessage}</p>
          <button onClick={handleChallengeComplete}>Go to Map</button>
        </div>
      )}
    </div>
  );
}

export default App;
