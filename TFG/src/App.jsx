import { useState } from 'react'
import { parseHoneypots, parseQuestions } from './utils/dataParser';
import Questionnaire from './components/questionnaire';

function App() {
  const [stage, setStage] = useState('intro'); // The initial Stage is always the intro
  const [sector, setSector] = useState(null); // Stores the selected sector

  const handleIntro = () => setStage('sectorSelection');
  const handleSectorSelected = (selectedSector) => {
    if(selectedSector === 'transport'){
      setStage('transportSelection')
    }
    else{
      setSector(selectedSector);
      setStage('questionnaire');
    }
  };


  return (
    <div
      style={{
        maxWidth: "800px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        margin: "0 auto",
        alignItems:"center",
        justifyContent: "center", // Center content vertically
        height: "100vh" // Full viewport height
      }}
    >

    {stage === 'intro' && (
      <div>
        <h1>Welcome to HoneyForm </h1>
        <div>
          <button onClick={handleIntro}>Start Self-Assessment</button>
        </div>
      </div>
    )}

    {stage === 'sectorSelection' && (
      <div>
        <h1>Sector Selection</h1>
        <button onClick={() => handleSectorSelected('healthcare')}>Healthcare</button>
        <button onClick={() => handleSectorSelected('energy')}>Energy</button>
        <button onClick={() => handleSectorSelected('financial')}>Financial Services</button>
        <button onClick={() => handleSectorSelected('transport')}>Transport</button>
      </div>
    )}

    {stage === 'transportSelection' && (
      <div>
        <h1>Sector Selection</h1>
        <button onClick={() => handleSectorSelected('air')}>Air</button>
        <button onClick={() => handleSectorSelected('road')}>Road</button>
        <button onClick={() => handleSectorSelected('railway')}>Railway</button>
        <button onClick={() => handleSectorSelected('maritime')}>Maritime</button>
      </div>
    )}

    {stage === 'questionnaire' && (
      <div>
        <Questionnaire sector={sector}/>
      </div>   
    )}

  </div>
  )
}

export default App
