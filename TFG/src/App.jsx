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
   * @property {Question[]} questions - Stores the questionnaire questions.
   * @property {Honeypot[]} honeypots - Stores the honeypots
   * @property {bool} loading - To rerender once the data is fetched.
   */
  const [stage, setStage] = useState('intro'); // The initial Stage is always 'intro'.
  const [sector, setSector] = useState(null);
  const [questions, setQuestions] = useState([]); // Stores parsed questions.
  const [honeypots, setHoneypots] = useState([]); // Stores parsed honeypots.
  const [loading, setLoading] = useState(false); 

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
  const handleSectorSelected = async (selectedSector) => {
    setLoading(true); 

    //TODO: Erase this line once all sectors have been implemented 
    selectedSector = 'energy';
    setSector(selectedSector); // Set the selected sector

    try {
        // Fetch data
        const parsedQuestions = await parseQuestions(selectedSector);
        const parsedHoneypots = await parseHoneypots(selectedSector);

        // Set the state
        setQuestions(parsedQuestions);
        setHoneypots(parsedHoneypots);

        console.log('Parsed Questions:', parsedQuestions);
        console.log('Parsed Honeypots:', parsedHoneypots);

        // Move to the questionnaire stage
        setStage('questionnaire');

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };

  const handleQuestionnaireComplete = () =>{
    setStage('recommendations');
  }

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
      */
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
        <Questionnaire
            questions={questions}
            honeypots={honeypots}
            onComplete={handleQuestionnaireComplete}
          />
      </div>   
    )}

    {stage === 'recommendations' && (
      <div>
        <h1>RECOMMENDATIONS STAGE</h1>
      </div>   
    )}

  </div>
  )
}

export default App
