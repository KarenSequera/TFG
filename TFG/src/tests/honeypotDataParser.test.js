import { parseHoneypots } from '../utils/dataParser.js';
/**
 * Test function. Parses the hardcoded sector honeypots and displays it in the console.
 */
const testHoneypotParser = async () => {
  try {
    const sector = 'energy'; 
    const honeypots = await parseHoneypots(sector);

    console.log(`Parsed ${honeypots.length} Honeypots:\n`);

    honeypots.forEach((honeypot, index) => {
      console.log(`Honeypot ${index + 1}:`);
      console.log(`  Tags: ${JSON.stringify(honeypot.tags)}`);
      console.log(`  Objective: ${honeypot.objective}`);
      console.log(`  Location: ${honeypot.location}`);
      console.log(`  Description: ${honeypot.description}`);
      console.log(`  MITRE Stage: ${honeypot.mitreTactic}`);
      console.log(`  Initial Score: ${honeypot.initialScore}`);
      console.log(`  Current Score: ${honeypot.currentScore}`);
      console.log('\n');
    });
  } catch (error) {
    console.error('Error testing honeypot parser:', error);
  }
};

testHoneypotParser();