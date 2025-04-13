import React, { Component } from 'react';
import '../styles/Questionnaire.css';
import '../styles/Recommendations.css'

class Questionnaire extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentQuestion: 0, // Tracks the current question index
            isFinished: false, // Tracks if the questionnaire is finished
            currentAnswer: null, // Tracks the current selected answer for a question
            showRecomendations: false, // Tracks if the questionnaire needs to show recommendations
            questionCount: 0, // Tracks the question number
            recommendationIndex: 0 // Index variable for the recommendations screen
        };
        this.questions = props.questions;
        this.honeypots = props.honeypots;
    }

    handleAnswerChange = (index) => {
        this.setState({ currentAnswer: index }); // Update the selected answer
    };

    handleAnswerSubmit = () => {
        const { currentQuestion, currentAnswer } = this.state;
        let answer = this.questions[currentQuestion].answers[currentAnswer];
        
        // Add points to Honeypots
        if (answer.tagsAdd) {
            answer.tagsAdd.forEach(tags => {
                let indexes = this.getHoneypotMatchingTags(tags);
                this.addPointsToHoneypots(indexes, answer.pointsToAdd);
            });
        }

        // Substract points to Honeypots
        if (answer.tagsSubstract) {
            answer.tagsSubstract.forEach(tags => {
                let indexes = this.getHoneypotMatchingTags(tags);
                this.substractPointsToHoneypots(indexes, answer.pointsToSubstract);
            });
        }
        
        // Activate other questions
        if (answer.tagsQuestion) {
            answer.tagsQuestion.forEach(tags => {
                let indexes = this.getQuestionsMatchingTags(tags);
                console.log(indexes)
                indexes.forEach(index => {
                    this.questions[index].activateQuestion();
                });
            });
        }

       // To make sure the questionnaire is not finished.
       // Not all the questions are active, so we need to find the next active question
        let nextQuestion = this.state.currentQuestion + 1;
        this.setState((prevState) => ({ questionCount: prevState.questionCount + 1 }));
        while( nextQuestion < this.questions.length && !this.questions[nextQuestion].active){
            nextQuestion++;
        }
        
        if( nextQuestion >= this.questions.length){
            console.log('Questionnaire completed');
            this.setState({showRecomendations : true})
        }
        else{
            this.setState({
                currentQuestion: nextQuestion,
                currentAnswer: null,
            })
        }
        

    };

    handleFinish = () => {
        this.setState({isFinished: true});
        this.props.onComplete();
    }

    handleNextRecommendation = () => {
        this.setState((prevState) => ({
            recommendationIndex: Math.min(prevState.recommendationIndex + 1, 2),
        }));
    };
    
    handlePreviousRecommendation = () => {
        this.setState((prevState) => ({
            recommendationIndex: Math.max(prevState.recommendationIndex - 1, 0),
        }));
    };

    //  * Given an array of tags, this function returns the array indexes of the honeypot that contain all the tags in the array. 
    //  * @param {string[]} - tags to match
    //  * @returns {int[]} - array of integer containing the indexes
    getHoneypotMatchingTags = (tags) => {
        const matchingIndexes = []; // Variable to store the indexes
        //Iterate through the honeypots looking for those that match the tags
        this.honeypots.forEach((honeypot, index) => {
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
        this.questions.forEach((question, index) => {
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
            this.honeypots[index].addPoints(pointsToAdd);
            //console.log(pointsToAdd, 'Points added to', this.honeypots[index].tags)
        });
    }

    //  * Substracts points to the honeypots in the index positions specified
    //  * @param {int[]} indexes - Positions of the honeypots to substract points
    //  * @param {int} pointsToSubstract - Points to substract
    substractPointsToHoneypots = (indexes, pointsToSubstract) => {
        indexes.forEach(index =>{
            this.honeypots[index].substractPoints(pointsToSubstract);
            //console.log(pointsToSubstract, 'Points substracted to', this.honeypots[index].tags)
        });
    }
    
    //FOR TESTING PURPOSE, C CHEAT TO SKIP QUESTIONNAIRE
    componentDidMount() {
        // Add a keydown event listener to skip to recommendations
        document.addEventListener('keydown', this.handleKeyPress);
    }
    
    componentWillUnmount() {
        // Clean up the event listener when the component unmounts
        document.removeEventListener('keydown', this.handleKeyPress);
    }
    
    handleKeyPress = (event) => {
        if (event.key.toLowerCase() === 'c') {
            console.log('Skipping to recommendations stage for testing purposes.');
            this.setState({ showRecomendations: true });
        }
    };

    render() {
        //TODO: If the recommendations are too similar, check that at least, X tags different 
        const topHoneypots = [...this.honeypots].sort((a, b) => b.currentScore - a.currentScore).slice(0, 3);
        const currentRecommendation = topHoneypots[this.state.recommendationIndex];
        return (
            <div className='background'>
                {!this.state.showRecomendations ? (
                    <div className='white-square'>
                        <h1>Question {this.state.questionCount+1}:</h1>
                        <p>{this.questions[this.state.currentQuestion].text}</p>
                        <ul className="answers-list">
                            {this.questions[this.state.currentQuestion].answers.map((answer, index) => (
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
                            disabled={this.state.currentAnswer === null} // Disable the button if no answer is selected
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
                        <button onClick={this.handleFinish} className='finish-button'>Finish</button>
                    </div>
                )}
            </div>
        );
    }

}

export default Questionnaire;