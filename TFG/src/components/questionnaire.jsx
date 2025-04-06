import React, {useState} from 'react';
import { parseHoneypots, parseQuestions } from '../utils/dataParser';

const Questionnaire = ( { sector }) => {

    return (
        <div>
            <h1>Questionnaire for  {sector} </h1>
        </div>
    );
};

export default Questionnaire;