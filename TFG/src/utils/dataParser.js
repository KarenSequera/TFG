import Papa from 'papaparse';
import fs from 'fs/promises';
//import Honeypot from '../models/Honeypot.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';

const parseTags = (tags) => {
    if (!tags) return []; // If tags are empty, return an empty array
  
    try {
      // Separate each of the TAGS groups via REGEX (delimited by [] in the string)
      const matches = tags.match(/\[.*?\]/g);
  
      // For each of the matches, we replace the [] and split the tags by commas
      return matches.map((group) =>
        group.replace(/[\[\]]/g, '').split(',') 
      );

    } catch (error) {
      console.error('Error parsing tags:', error);
      return []; // If tags error, return an empty array
    }
};

export const parseQuestions = async (sector) => {


    const csvFilePath = `./data/questionnaires/${sector}.csv`;
    const csvContent = await fs.readFile(csvFilePath, 'utf-8');

    return new Promise((resolve, reject) => {
      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
        
          const questions = []; // Stores all the questions that are parsed
          let currentQuestion = null; // Stores the current question that is being parsed
  
          data.forEach((row) => {
            // If the row contains content in the question column, we are in a new question
            if (row.Questions) {
              // The old question has been filled and needs to be pushed
              if (currentQuestion) {
                questions.push(currentQuestion);
              }
  
              // New Question Object created
              currentQuestion = new Question({
                tags: row.TAGS ? parseTags(row.TAGS) : [],
                text: row.Questions,
                answers: [],
                active: row.QuestionActive === 'TRUE',
              });
            }
  
            // We check if the object current question is created and if the answer row contains something
            if (currentQuestion && row.Answer) {
                const answer = new Answer({
                    text: row.Answer,
                    tagsAdd: row.AddPointsHoneypotTags ? parseTags(row.AddPointsHoneypotTags) : [],
                    pointsToAdd: row.PointsToAdd ? parseInt(row.PointsToAdd, 10) : 0,
                    tagsSubtract: row.SubstractPointsHoneypotTags ? parseTags(row.SubstractPointsHoneypotTags) : [],
                    pointsToSubstract: row.PointsToSubstract ? parseInt(row.PointsToSubstract, 10) : 0,
                    tagsQuestion: row.EnableQuestionTags ? parseTags(row.EnableQuestionTags) : [],
                });
              // The new question is pushed
              currentQuestion.answers.push(answer);
            }
          });
  
          // Push the last question to the list
          if (currentQuestion) {
            questions.push(currentQuestion);
          }
          resolve(questions);
        },
        error: (error) => reject(error),
      });
    });
  };

//export const parseHoneypots = async (sector) => {}