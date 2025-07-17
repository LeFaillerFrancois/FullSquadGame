import { useState } from 'react';
import { questionPairs } from './questions';

function App() {
  const [playerCount, setPlayerCount] = useState(5);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [currentPair, setCurrentPair] = useState(null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showMajority, setShowMajority] = useState(false);

  const handleNewQuestion = () => {
    const pair = questionPairs[questionIndex % questionPairs.length];
    setCurrentPair(pair);

    const players = Array.from({ length: playerCount }, (_, i) => i + 1);

    // Déterminer combien de menteurs (1 à tous)
    const random = Math.random();
    let minorityCount = 1;
    if (random < 0.1) {
      minorityCount = Math.min(2, playerCount - 1); // 10% de chance que 2 aient la minoritaire
    } else if (random < 0.13) {
      minorityCount = playerCount; // 3% de chance que tous aient la minoritaire
    }

    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const minorityPlayers = new Set(shuffled.slice(0, minorityCount));

    const assignments = players.map((player) => ({
      player,
      question: minorityPlayers.has(player) ? pair.minority : pair.majority
    }));

    setAssignedQuestions(assignments);
    setShowAssignments(true);
    setSelectedPlayer(null);
    setShowMajority(false);
    setQuestionIndex(prev => prev + 1);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const handleHideQuestion = () => {
    setSelectedPlayer(null);
  };

  const toggleMajority = () => {
    setShowMajority(prev => !prev);
  };

  const currentAssignment = assignedQuestions.find(a => a.player === selectedPlayer);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: 700, margin: 'auto' }}>
      <h1>🎭 Full Squad Gaming Guess The Liar</h1>

      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Nombre de joueurs :
        <input
          type="number"
          value={playerCount}
          onChange={(e) => setPlayerCount(parseInt(e.target.value))}
          min={3}
          max={10}
          style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
        />
      </label>

      <button
        onClick={handleNewQuestion}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          marginBottom: '2rem',
          cursor: 'pointer'
        }}
      >
        🔄 Nouvelle question
      </button>

      {showAssignments && (
        <div>
          <h2>Afficher la question d’un joueur :</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {assignedQuestions.map(({ player }) => (
              <button
                key={player}
                onClick={() => handleSelectPlayer(player)}
                style={{
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  backgroundColor: selectedPlayer === player ? '#ddd' : '#f0f0f0',
                  border: '1px solid #ccc'
                }}
              >
                👤 Joueur {player}
              </button>
            ))}
          </div>

          {selectedPlayer && currentAssignment && (
            <div style={{ marginTop: '1rem' }}>
              <h3>Question pour Joueur {selectedPlayer} :</h3>
              <p style={{ fontSize: '1.2rem' }}>{currentAssignment.question}</p>
              <p style={{ fontStyle: 'italic' }}>Montrez cette question en privé au joueur concerné.</p>
              <button onClick={handleHideQuestion} style={{ marginTop: '1rem', cursor: 'pointer' }}>
                ❌ Cacher la question
              </button>
            </div>
          )}

          <button onClick={toggleMajority} style={{ marginTop: '1rem', cursor: 'pointer' }}>
            📣 {showMajority ? 'Cacher' : 'Afficher'} la question majoritaire
          </button>

          {showMajority && currentPair && (
            <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{currentPair.majority}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
