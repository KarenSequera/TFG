import { useState } from 'react'
import { parseHoneypots, parseQuestions } from './utils/dataParser';
import Questionnaire from './components/questionnaire';
/**
 * The main application component for the HoneyForm questionnaire.
 */
function App() {
/**
   * State Variables:
   * @property {string} stage - Tracks the current stage of the application. Possible values:
   *   - 'intro': The intro screen.
   *   - 'sectorSelection': Screen to select the sector.
   *   - 'transportSelection': Screen to select the transport subsector.
   *   - 'questionnaire': The questionnaire screen.
   *   - 'recommendations': The recommendations screen.
   * 
   * @property {string} sector - Stores the selected sector or subsector. 
   *   - values: 'healthcare', 'energy', 'financial', 'transport', 'air', 'road', 'maritime', 'railway'.
   */
  const [stage, setStage] = useState('intro'); // The initial Stage is always 'intro'.
  const [sector, setSector] = useState(null);

  /**
   *************HANDLERS******************
   */

  /**
   * Handles the transition from 'intro' stage to 'sectorSelection'
   * @returns 
   */
  const handleIntro = () => setStage('sectorSelection');

  /**
   * Handles the selection of a sector or subsector.
   * @param {string} selectedSector 
   */
  const handleSectorSelected = (selectedSector) => {
    // If the selected sector is transport, the stage is set to  'transportSelection'
    if(selectedSector === 'transport'){
      setStage('transportSelection')
    }
    // Any other value sets the stage to 'questionnaire' and sets the sector state variable accordingly.
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

    {
      /**
       *************STAGES MANAGEMENT ******************
      //  */
    }

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
