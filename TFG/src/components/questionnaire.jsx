import React, { Component } from 'react';
import { parseHoneypots, parseQuestions } from '../utils/dataParser';

class Questionnaire extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentQuestion: 0, // Tracks the current question index
            isFinished: false, // Tracks if the questionnaire is finished
            currentAnswer: null, // Tracks the current selected answer for a question
            
        };
        this.questions = props.questions;
        this.honeypots = props.honeypots;
    }

    handleAnswerChange = (index) => {
        this.setState({ currentAnswer: index }); // Update the selected answer
    };

    handleAnswerSubmit = () => {
        // Code to execute current answer actions
        // answer = this.questions[].answer[]
        //addpoints(answer.tags, answer.points);
        //substractpoints(answer.tags, answer.points);
        //activate questions(answer.tags);

       // To make sure the questionnaire is not finished.
       // Not all the questions are active, so we need to find the next active question
        let nextQuestion = this.state.currentQuestion + 1;
        while( nextQuestion < this.questions.length && !this.questions[nextQuestion].active){
            nextQuestion++;
        }
        
        if( nextQuestion >= this.questions.length){
            console.log('Questionnaire completed');
            this.setState({isFinished : true})
            this.props.onComplete();
        }
        else{
            this.setState({
                currentQuestion: nextQuestion,
                currentAnswer: null,
            })
        }
        

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
            <button
                onClick={this.handleAnswerSubmit}
                disabled={this.state.currentAnswer === null} // Disable the button if no answer is selected
            >
                Next
            </button>
        </div>
        )
    }

}

export default Questionnaire;