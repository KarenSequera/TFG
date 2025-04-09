import { useState } from 'react'
import { parseHoneypots, parseQuestions } from './utils/dataParser';
import Questionnaire from './components/questionnaire';
import './styles/App.css';

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
   *   - 'reset': Button to take again the questionnarie
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
    setStage('reset');
  }

  const handleReset = () =>{
    setStage('intro'); 
    setSector(null); 
    setQuestions([]); 
    setHoneypots([]); 
    setLoading(false); 
  };


  return (
    <div
      style={{
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
      <div className="intro-stage">
          <div className="intro-content">
            <img 
              src="/fotos/logo.png" 
              alt="HoneyForm Logo" 
              className="intro-logo" 
            />
            <span>
              <p>Welcome to HoneyForm!</p>
              <p>HoneyForm is a questionnaire designed for critical infrastructure organizations looking to deploy effective Honeypots!</p>

              <p className='last-child'>Do you want to know what type of honeypot best suits your needs and where to deploy it?</p>
            </span>
            <div>
                <button className="intro-button" onClick={handleIntro}>
                  Start Self-Assessment
                </button>
            </div>
          </div>
      </div>
    )}

    {stage === 'sectorSelection' && (
      <div className='intro-stage'>
        <div className='intro-content'> 
        <h1>Sector Selection</h1>
        <button onClick={() => handleSectorSelected('healthcare')}>Healthcare</button>
        <button onClick={() => handleSectorSelected('energy')}>Energy</button>
        <button onClick={() => handleSectorSelected('financial')}>Financial Services</button>
        <button onClick={() => handleSectorSelected('transport')}>Transport</button>
      </div>

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

    {stage === 'reset' && (
      <div>
        <h1>Reset Button</h1>
        <button onClick={() => handleReset()}>Reser Questionnaire</button>
      </div>   
    )}

  </div>
  )
}

export default App
