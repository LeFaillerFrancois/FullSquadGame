import { useState } from 'react';
import { questionPairs } from './questions';

function App() {
  const [playerCount, setPlayerCount] = useState(5);
  const [assignedQuestions, setAssignedQuestions] = useState([]);
  const [currentPair, setCurrentPair] = useState(null);
  const [showAssignments, setShowAssignments] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showMajorityQuestion, setShowMajorityQuestion] = useState(false);

  const handleNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionPairs.length);
    const pair = questionPairs[randomIndex];
    setCurrentPair(pair);

    const players = Array.from({ length: playerCount }, (_, i) => i + 1);
    const liarIndex = Math.floor(Math.random() * playerCount);
    const assignments = players.map((player, i) => ({
      player,
      question: i === liarIndex ? pair.minority : pair.majority
    }));

    setAssignedQuestions(assignments);
    setShowAssignments(true);
    setSelectedPlayer(null);
    setShowMajorityQuestion(false);
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const currentAssignment = assignedQuestions.find(a => a.player === selectedPlayer);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial', maxWidth: 700, margin: 'auto' }}>
      <h1>🎭 Trouve le menteur</h1>

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
          marginBottom: '1rem',
          cursor: 'pointer'
        }}
      >
        🔄 Nouvelle question
      </button>

      {showAssignments && (
        <>
          <button
            onClick={() => setShowMajorityQuestion(!showMajorityQuestion)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              marginBottom: '1rem',
              cursor: 'pointer'
            }}
          >
            📣 {showMajorityQuestion ? 'Cacher' : 'Afficher'} la question majoritaire
          </button>

          {showMajorityQuestion && currentPair && (
            <div style={{ marginBottom: '1rem' }}>
              <h3>Question majoritaire :</h3>
              <p style={{ fontSize: '1.2rem' }}>{currentPair.majority}</p>
            </div>
          )}

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
              <button
                onClick={() => setSelectedPlayer(null)}
                style={{ marginTop: '0.5rem', padding: '0.3rem 0.8rem', cursor: 'pointer' }}
              >
                ❌ Cacher la question
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
