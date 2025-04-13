import { useState } from 'react'
import { parseHoneypots, parseQuestions } from './utils/dataParser';
import Questionnaire from './components/Questionnaire.jsx';
import './styles/App.css';
import './styles/Finish.css';

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
   */
  const handleIntro = () => setStage('sectorSelection');

  /**
   * Handles the selection of a sector or subsector.
   * @param {string} selectedSector 
   */
  const handleSectorSelected = async (selectedSector) => {
    setLoading(true); 
    
    if (selectedSector === 'transport') {
      return setStage('transportSelection');
    }

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
    }
    catch (error) {
        console.error('Error fetching data:', error);
    }
    finally {
        setLoading(false);
    }
  };

  const handleQuestionnaireComplete = () =>{
    setStage('reset');
  };

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
        justifyContent: "flex-start", // Center content vertically
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
      <div className='sector-selection'>
        <div className='sector-selection-content'> 
          <h1>Sector Selection</h1>
          <p>Please select the sector your organization belongs to: </p>
          <button className="button-sector" onClick={() => handleSectorSelected('healthcare')}>Healthcare</button>
          <button className="button-sector" onClick={() => handleSectorSelected('energy')}>Energy</button>
          <button className="button-sector" onClick={() => handleSectorSelected('financial')}>Financial Services</button>
          <button className="button-sector" onClick={() => handleSectorSelected('transport')}>Transport</button>
          <button className="back-button " onClick={() => handleReset()}>Back</button>
        </div>
        
      </div>
      
    )}

    {stage === 'transportSelection' && (
      <div className="sector-selection">
        <div className="sector-selection-content">
          <h1>Transport Selection</h1>
          <p>Please select the transport subsector your organization belongs to:</p>
          <button className="button-sector" onClick={() => handleSectorSelected('air')}>Air</button>
          <button className="button-sector" onClick={() => handleSectorSelected('road')}>Road</button>
          <button className="button-sector" onClick={() => handleSectorSelected('railway')}>Railway</button>
          <button className="button-sector" onClick={() => handleSectorSelected('maritime')}>Maritime</button>
          <button className="back-button" onClick={() => setStage('sectorSelection')}>Back</button>
        </div>
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
      <div className='finish-background'>
        <div className='finish-white-square'>
          <img 
                src="/fotos/logo.png" 
                alt="HoneyForm Logo" 
                className="finish-logo" 
              />
          <h1>Thank you for taking the questionnaire!</h1>
          <p> Your feedback means a lot! Please take a moment to answer a few short questions to help us improve.</p>
          <div className='finish-button-container'>
            <button 
                onClick={() => window.open('https://forms.gle/cou5Qt99eEJffU4q8', '_blank')} 
                className="finish-button"
              >
                Give Feedback
            </button>
            <button className="finish-button" onClick={() => handleReset()}>Reset Questionnaire</button>
          </div>
        </div>
      </div>   
    )}

  </div>
  )
}

export default App
