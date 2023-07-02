import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerEnergy, setPlayerEnergy] = useState(4);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isEnemyDefeated, setIsEnemyDefeated] = useState(false);
  const [isInMap, setIsInMap] = useState(false);

  const cards = [
    { name: 'Strike', cost: 1, damage: 10 },
    { name: 'Defend', cost: 1, heal: 5 },
    { name: 'Fireball', cost: 2, damage: 20 },
    { name: 'Heal', cost: 2, heal: 15 }
  ];

  const handleCardPlay = (card) => {
    if (isPlayerTurn) {
      if (card.damage && playerEnergy >= card.cost) {
        setEnemyHealth(enemyHealth - card.damage);
        setPlayerEnergy(playerEnergy - card.cost);
        if (enemyHealth < 1) {
          handleEnemyDefeat();
        }
      }
      if (card.heal  && playerEnergy >= card.cost) {
        setPlayerHealth(playerHealth + card.heal );
        setPlayerEnergy(playerEnergy - card.cost);
      }
    }
    setIsPlayerTurn(false);
  };

  const handleEnemyTurn = async () => {
    // Lógica del turno del enemigo
    const enemyAttackDamage = 15;
    setPlayerHealth(playerHealth - enemyAttackDamage);
    await delay(1500); // Esperar 4 segundos antes de pasar al turno del jugador
    setIsPlayerTurn(true);
    setPlayerEnergy(4);
  };

  useEffect(() => {
    if (!isPlayerTurn) {
      handleEnemyTurn();
    }
  }, [isPlayerTurn]);

  const handleEnemyDefeat = () => {
    setIsEnemyDefeated(true);
  };

  const handleContinue = () => {
    setIsEnemyDefeated(false);
    setIsInMap(true);
  };

  const delay = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <div className="App">
      <h1>Slay the Spire Clone</h1>
      {!isInMap && !isEnemyDefeated && (
        <div>
          <div className="status">
            <p>Player Health: {playerHealth}</p>
            <p>Enemy Health: {enemyHealth}</p>
            <p>Player Energy: {playerEnergy}</p>
            <p>Turn: {isPlayerTurn ? 'Player' : 'Enemy'}</p>
          </div>
          <div className="cards">
            {cards.map((card, index) => (
              <button
                key={index}
                onClick={() => handleCardPlay(card)}
                disabled={!isPlayerTurn || playerEnergy < card.cost}
              >
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
          {/* Agrega opciones de desafío en el mapa */}
        </div>
      )}
    </div>
  );
}

export default App;
