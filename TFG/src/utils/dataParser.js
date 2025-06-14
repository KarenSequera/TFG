import Papa from 'papaparse';
import Honeypot from '../models/honeypot.js';
import Question from '../models/question.js';
import Answer from '../models/answer.js';
/**
 * This funtion parses the TAGS to lists of lists according the pattern used in the CSV: "[TAG1,TAG2],[TAG3,TAG4]"
 * @param {string} tags - string containing the TAGS data
 * @returns {string[]}- returns a list of lists of strings with the tags content
 */
const parseTags = (tags) => {
    if (!tags) return []; // If tags are empty, return an empty array
  
    try {
      // Separate each of the TAGS groups via REGEX (delimited by [] in the string)
      const matches = tags.match(/\[.*?\]/g);
  
      // For each of the matches, we replace the [] and split the tags by commas, trim and lowercase the tags
      return matches.map((group) =>
        group.replace(/[\[\]]/g, '').split(',').map( tag => tag.trim().toLowerCase()) 
      );

    } catch (error) {
      console.error('Error parsing tags:', error);
      return []; // If tags error, return an empty array
    }
};

/**
 * This function parses que questions from a csv.
 * @param {string} sector - The sector that is going to be parsed.
 * @returns {Question[]} - A list containing the questions
 */
export const parseQuestions = async (sector) => {
  const csvFilePath = `./questionnaires/${sector} - questions.csv`;
  const response = await fetch(csvFilePath);
  const csvContent = await response.text();

  const questions = []; // Stores all the questions that are parsed
  let currentQuestion = null; // Stores the current question that is being parsed

  Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
          const data = result.data;

          data.forEach((row) => {
              // If the row contains content in the question column, we are in a new question
              if (row.Questions) {
                  // The old question has been filled and needs to be pushed
                  if (currentQuestion) {
                      questions.push(currentQuestion);
                  }

                  // New Question Object created
                  currentQuestion = new Question({
                      tags: row.Tags ? parseTags(row.Tags) : [],
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
                      tagsSubtract: row.SubtractPointsHoneypotTags ? parseTags(row.SubtractPointsHoneypotTags) : [],
                      pointsToSubtract: row.PointsToSubtract ? parseInt(row.PointsToSubtract, 10) : 0,
                      tagsQuestion: row.EnableQuestionTags ? parseTags(row.EnableQuestionTags) : [],
                  });
                  currentQuestion.answers.push(answer);
              }
          });

          // Push the last question to the list
          if (currentQuestion) {
              questions.push(currentQuestion);
          }
      },
      error: (error) => {
          console.error("Error parsing CSV:", error);
      },
  });

  return questions;
};

/**
 * This function parses the honeypots from a csv. 
 * @param {string} sector - The sector that is going to be parsed. 
 * @returns {Honeypot[]} - A list of honeypots. 
 */
export const parseHoneypots = async (sector) => {
  const csvFilePath = `./honeypots/${sector} - honeypots.csv`;
  const response = await fetch(csvFilePath);
  const csvContent = await response.text();

  const honeypots = []; // Stores all the honeypots that are parsed
  let currentHoneypot = null; // Stores the current honeypot that is being parsed

  Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
          const data = result.data;

          data.forEach((row) => {
              // Create a new Honeypot object for each row
              currentHoneypot = new Honeypot({
                  tags: parseTags(row.Tags),
                  type: row.Type,
                  objective: row.Objective,
                  location: row.Location,
                  description: row.Description,
                  mitreTactic: row.Mitre,
                  initialScore: parseInt(row.InitialScore, 10),
                  currentScore: parseInt(row.InitialScore, 10),
              });

              if (currentHoneypot) {
                  honeypots.push(currentHoneypot);
              }
          });
      },
      error: (error) => {
          console.error("Error parsing CSV:", error);
      },
  });

  return honeypots;
};