import React, { Component } from 'react';
import { parseHoneypots, parseQuestions } from '../utils/dataParser';

class Questionnaire extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentQuestion: 0, // Tracks the current question index
            isFinished: false, // Tracks if the questionnaire is finished
            currentAnswer: 0, // Tracks the current selected answer for a question
            
        };
        this.questions = props.questions;
        this.honeypots = props.honeypots;
    }

    handleAnswerChange = (index) => {
        this.setState({ currentAnswer: index }); // Update the selected answer
    };

    render() {

        return(
            
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
                            checked={ this.state.currentAnswer === index} 
                            onChange={() => this.handleAnswerChange(index)}
                        />
                        {answer.text}
                    </label>
                </li>
            ))}
            </ul>
        </div>
        )
    }

}

export default Questionnaire;