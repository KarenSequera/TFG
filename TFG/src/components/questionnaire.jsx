import React, { Component } from 'react';
import { parseHoneypots, parseQuestions } from '../utils/dataParser';

class Questionnaire extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentQuestion: 0, // Tracks the current question index
            isFinished: false, // Tracks if the questionnaire is finished
            currentAnswer: null, // Tracks the current selected answer for a question
            showRecomendations: false // Tracks if the questionnaire needs to show recommendations
            
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

    render() {
        //TODO: If the recommendations are too similar, check that at least, X tags different 
        const topHoneypots = [...this.honeypots].sort((a, b) => b.currentScore - a.currentScore).slice(0, 3);
        return (
            <div>
                {!this.state.showRecomendations ? (
                    <div>
                        <h1>Questionnaire phase</h1>
                        <p>{this.questions[this.state.currentQuestion].text}</p>
                        {/* This style gets rid of the bullet points */}
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {this.questions[this.state.currentQuestion].answers.map((answer, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            name="answer"
                                            value={index}
                                            checked={this.state.currentAnswer === index}
                                            onChange={() => this.handleAnswerChange(index)}
                                        />
                                        {answer.text}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={this.handleAnswerSubmit}
                            disabled={this.state.currentAnswer === null} // Disable the button if no answer is selected
                        >
                            Next
                        </button>
                    </div>
                ) : (
                    <div>
                    <h2>Recommended Honeypots</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {topHoneypots.map((honeypot, index) => (
                            <div key={index} style={{ border: '1px solid #ccc', padding: '10px', width: '30%' }}>
                                <p><strong>Objective:</strong> {honeypot.objective}</p>
                                <p><strong>Type:</strong> {honeypot.type}</p>
                                <p><strong>Location:</strong> {honeypot.location}</p>
                                <p><strong>Description:</strong> {honeypot.description}</p>
                                <p><strong>MITRE Tactic:</strong> {honeypot.mitreTactic}</p>
                                <p><strong>Final Points</strong> {honeypot.currentScore}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={this.handleFinish}>Finish</button>
                </div>
                )}
            </div>
        );
    }

}

export default Questionnaire;