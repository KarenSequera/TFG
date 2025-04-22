import React, { Component } from 'react';
import '../styles/Questionnaire.css';
import '../styles/Recommendations.css'

class Questionnaire extends Component {
    #questions
    #honeypots
    #topHoneypots
    //  * Questionnaire constructor
    //  * @param {Object} props
    //  * @param {Question[]} props.questions - List of questions for the questionnaire
    //  * @param {Honeypot[]} props.honeypots - List of honeypots used for recommendations
    //  * @param {Function} props.onComplete - Callback function to execute when the questionnaire is completed
    //  * @param {Function} props.onReset - Callback function to reset the questionnaire
    constructor(props){
        super(props);

        //Initial state of the questionnaire
        this.state = {
            currentQuestion: 0, // Tracks the current question index
            isFinished: false, // Tracks if the questionnaire is finished
            currentAnswer: null, // Tracks the current selected answer for a question
            showRecomendations: false, // Tracks if the questionnaire needs to show recommendations
            questionCount: 0, // Tracks the question number
            recommendationIndex: 0 // Index variable for the recommendations screen
        };
        this.#questions = props.questions;
        this.#honeypots = props.honeypots;
        this.#topHoneypots = [];
    }

    // QUESTIONNAIRE HANDLERS ////////////////////////////////////////

    // Updates the selected answer for the current question of the questionnaire
    // @param {int} index - The index of the selected answer
    handleAnswerChange = (index) => {
        this.setState({ currentAnswer: index }); // Update the selected answer
    };

    // Handles the submitted answer:
    // Updates honeypot scores, activates additional questions, and navigates to the next question or recommendations (if last)
    handleAnswerSubmit = () => {
        const { currentQuestion, currentAnswer } = this.state;
        let answer = this.#questions[currentQuestion].answers[currentAnswer];
        
        // Add points to Honeypots
        if (answer.tagsAdd) {
            answer.tagsAdd.forEach(tags => {
                let indexes = this.getHoneypotMatchingTags(tags);
                this.addPointsToHoneypots(indexes, answer.getPointsToAdd());
            });
        }

        // Subtract points to Honeypots
        if (answer.tagsSubtract) {
            answer.tagsSubtract.forEach(tags => {
                let indexes = this.getHoneypotMatchingTags(tags);
                this.subtractPointsToHoneypots(indexes, answer.getPointsToSubtract());
            });
        }
        
        // Activate other questions
        if (answer.tagsQuestion) {
            answer.tagsQuestion.forEach(tags => {
                let indexes = this.getQuestionsMatchingTags(tags);
                console.log(indexes)
                indexes.forEach(index => {
                    this.#questions[index].activateQuestion();
                });
            });
        }

       // Not all the questions are active, so we need to find the next active question
        let nextQuestion = this.state.currentQuestion + 1;
        this.setState((prevState) => ({ questionCount: prevState.questionCount + 1 }));
        while( nextQuestion < this.#questions.length && !this.#questions[nextQuestion].isActive()){
            nextQuestion++;
        }

        // If there are not more questions
        if( nextQuestion >= this.#questions.length){
            //console.log('Questionnaire completed');
            this.setState({showRecomendations : true})
        }
        else{
            this.setState({
                currentQuestion: nextQuestion,
                currentAnswer: null,
            })
        }
        
        //At the end of submit answer, top honeypots are recalculated (in sthis way the questionnaire can be finished at any moment with the cheat)
        const sortedHoneypots = [...this.#honeypots].sort((a, b) => b.currentScore - a.currentScore);
        this.#topHoneypots = [];
        sortedHoneypots.forEach((honeypot) => {
            if (this.#topHoneypots.length < 3) {
                // Iterate through the honeypots that are to be recommended and makes sure that they have at least two different tags, in this way the recommended honeypots are not too similar
                const isDifferent = this.#topHoneypots.every((selectedHoneypot) => {
                    const currentHoneypotTags = honeypot.tags.flat();
                    const selectedHoneypotTags = selectedHoneypot.tags.flat();
                    let differentTags = []
                    differentTags.push(currentHoneypotTags.filter(tag => !selectedHoneypotTags.includes(tag)))
                    differentTags.push(selectedHoneypotTags.filter(tag => !currentHoneypotTags.includes(tag)))
                    differentTags = differentTags.flat()
                    //console.log("Tags in current honeypot", currentHoneypotTags)
                    //console.log("Tags in selected honeypot", selectedHoneypotTags)
                    //console.log("Difference", differentTags)
                    return differentTags.length > 3;
                });
                if (isDifferent) {
                    this.#topHoneypots.push(honeypot);
                }
            }
        });
        this.#topHoneypots = this.#topHoneypots.sort((a, b) => b.currentScore - a.currentScore);
        console.log("Top Honeypots:", this.#topHoneypots);

    };

    // ANSWER OPERATION FUNCTIONS ////////////////////////////////////////

    //  * Given an array of tags, this function returns the array indexes of the honeypot that contain all the tags in the array. 
    //  * @param {string[]} - tags to match
    //  * @returns {int[]} - array of integer containing the indexes
    getHoneypotMatchingTags = (tags) => {
        const matchingIndexes = []; // Variable to store the indexes
        //Iterate through the honeypots looking for those that match the tags
        this.#honeypots.forEach((honeypot, index) => {
            let match = true;
            let honeypotTags = honeypot.tags.flat(); // If flat is not used, include does not work
            tags.forEach(tag => {
                if (!honeypotTags.includes(tag)) {
                    // If  a honeypot does not match the tag it is not pushed
                    match = false; 
                }
            });
            if(match){ matchingIndexes.push(index)}
        });
        return matchingIndexes;
    };

    //  * Given an array of tags, this function returns the array indexes of the questions that contain all the tags in the array. 
    //  * @param {string[]} - tags to match
    //  * @returns {int[]} - array of integer containing the indexes
    getQuestionsMatchingTags = (tags) => {
        const matchingIndexes = []; // Variable to store the indexes
        //Iterate through the honeypots looking for those that match the tags
        this.#questions.forEach((question, index) => {
            let match = true;
            console.log(tags)
            let questionTags = question.tags.flat(); // If flat is not used, include does not work
            console.log(questionTags)
            tags.forEach(tag => {
                if (!questionTags.includes(tag)) {
                    // If  a honeypot does not match the tag it is not pushed
                    match = false; 
                    console.log("Enters in if, not match")
                }
            });
            if(match){ matchingIndexes.push(index)}
        });
        return matchingIndexes;
    };

    //  * Adds points to the honeypots in the index positions specified
    //  * @param {int[]} indexes - Positions of the honeypots to add points
    //  * @param {int} pointsToAdd - Points to add
    addPointsToHoneypots = (indexes, pointsToAdd) => {
        indexes.forEach(index => {
            this.#honeypots[index].addPoints(pointsToAdd);
            //console.log(pointsToAdd, 'Points added to', this.#honeypots[index].tags)
        });
    }

    //  * Subtracts points to the honeypots in the index positions specified
    //  * @param {int[]} indexes - Positions of the honeypots to subtract points
    //  * @param {int} pointsToSubtract - Points to subtract
    subtractPointsToHoneypots = (indexes, pointsToSubtract) => {
        indexes.forEach(index =>{
            this.#honeypots[index].subtractPoints(pointsToSubtract);
            //console.log(pointsToSubtract, 'Points subtracted to', this.#honeypots[index].tags)
        });
    }

    //HONEYPOT RECOMMENDATION STAGE HANDLERS ////////////////////////////////////////

    // Navigates to the next recommendation taking into consideration that index cannot be greater than two (3 recommendations).
    handleNextRecommendation = () => {
        this.setState((prevState) => ({
            recommendationIndex: Math.min(prevState.recommendationIndex + 1, 2),
        }));
    };
    
     // Navigates to the previous recommendation taking into consideration that index cannot be smaller than cero.
    handlePreviousRecommendation = () => {
        this.setState((prevState) => ({
            recommendationIndex: Math.max(prevState.recommendationIndex - 1, 0),
        }));
    };
    
    // Marks the questionnaire as finished and triggers the onComplete callback
    handleFinish = () => {
        this.setState({isFinished: true});
        this.props.onComplete();
    }


    //FOR TESTING PURPOSE, C CHEAT TO SKIP QUESTIONNAIRE ////////////////////////////////////////

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }
    
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    
    handleKeyPress = (event) => {
        if (event.key.toLowerCase() === 'c') {
            console.log('Skipping to recommendations stage for testing purposes.');
            this.setState({ showRecomendations: true });
        }
    };

    //Logging the honeypots
    componentDidUpdate(prevProps, prevState) {
        // Check if the recommendations are now being displayed
        if (!prevState.showRecomendations && this.state.showRecomendations) {
            console.log("All Honeypots:", this.#honeypots);
        }
    }
    // RENDER ////////////////////////////////////////

    render() {
        const currentRecommendation = this.#topHoneypots[this.state.recommendationIndex];
        return (
            <div className='background'> 
                {!this.state.showRecomendations ? (
                    <div className='white-square'>
                        <h1>Question {this.state.questionCount+1}:</h1>
                        <p>{this.#questions[this.state.currentQuestion].text}</p>
                        <ul className="answers-list">
                            {this.#questions[this.state.currentQuestion].answers.map((answer, index) => (
                                <li
                                    key={index}
                                    className={this.state.currentAnswer === index ? 'selected' : ''}
                                    onClick={() => this.handleAnswerChange(index)}
                                >
                                    {answer.text}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={this.handleAnswerSubmit}
                            disabled={this.state.currentAnswer === null} 
                            className='next-button'
                        >
                            Next
                        </button>
                        <button
                            onClick={this.props.onReset}
                            className='reset-button'
                        >
                            Reset
                        </button>
                    </div>
                ) : (
                    <div className= 'recommendations-white-square'>
                        <h1>Recommendations</h1>
                        <div className='recommendation-details'>
                            <h2>Honeypot {this.state.recommendationIndex+1}</h2>
                            <p><strong>Objective:</strong> {currentRecommendation.objective}</p>
                            <p><strong>Type:</strong> {currentRecommendation.type}</p>
                            <p><strong>Location:</strong> {currentRecommendation.location}</p>
                            <p><strong>Description:</strong> {currentRecommendation.description}</p>
                            <p><strong>MITRE ATT&CK Tactics:</strong> {currentRecommendation.mitreTactic}</p>
                            <p><strong>Final Points:</strong> {currentRecommendation.currentScore}</p>
                        
                        </div>
                        <button
                                onClick={this.handlePreviousRecommendation}
                                disabled={this.state.recommendationIndex === 0}
                                className='recommendation-previous-button'
                            >
                        </button>
                        <button
                                onClick={this.handleNextRecommendation}
                                disabled={this.state.recommendationIndex === 2}
                                className='recommendation-next-button'
                            >
                        </button>
                        <button onClick={this.handleFinish} className='recommendation-finish-button'>Finish</button>
                    </div>
                )}
            </div>
        );
    }

}

export default Questionnaire;