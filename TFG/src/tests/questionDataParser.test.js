import { parseQuestions } from '../utils/dataParser.js';
/**
 * Test function. Parses the hardcoded sector questions and displays it in the console.
 */
const testParser = async () => {
  try {
    const sector = 'energy';
    const questions = await parseQuestions(sector);

    console.log(`Parsed ${questions.length} Questions:\n`);

    questions.forEach((question, questionIndex) => {
      console.log(`Question ${questionIndex + 1}:`);
      console.log(`  Text: ${question.text}`);
      console.log(`  Tags: ${JSON.stringify(question.tags)}`);
      console.log(`  Active: ${question.active}`);
      console.log(`  Answers:`);

      question.answers.forEach((answer, answerIndex) => {
        console.log(`    Answer ${answerIndex + 1}:`);
        console.log(`      Text: ${answer.text}`);
        console.log(`      Tags Add: ${JSON.stringify(answer.tagsAdd)}`);
        console.log(`      Points to Add: ${answer.pointsToAdd}`);
        console.log(`      Tags Subtract: ${JSON.stringify(answer.tagsSubtract)}`);
        console.log(`      Points to Subtract: ${answer.pointsToSubstract}`);
        console.log(`      Tags Question: ${JSON.stringify(answer.tagsQuestion)}`);
      });

      console.log('\n'); 
    });
  } catch (error) {
    console.error('Error testing parser:', error);
  }
};

testParser();