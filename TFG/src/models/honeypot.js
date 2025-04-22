/**
 * Represents a Honeypot.
 */
class Honeypot {
   /**
   * Creates a new Honeypot instance.
   * @param {string[]} [tags=[]] - An array of tags (strings) associated with the honeypot.
   * @param {string} [objective=''] - The objective of the honeypot.
   * @param {string} [location=''] - The location of the honeypot.
   * @param {string} [description=''] - A description of the honeypot.
   * @param {string} [mitreTactic=''] - The MITRE ATT&CK tactics associated with the honeypot.
   * @param {number} [initialScore=0] - The initial score of the honeypot.
   * @param {number} [currentScore=0] - The current score of the honeypot.
   */
    constructor({
      tags = [],
      type = '',
      objective = '',
      location = '',
      description = '',
      mitreTactic = '',
      initialScore = 0,
      currentScore = 0
    }) {
      this.tags = tags; 
      this.type = type;
      this.objective = objective;
      this.location = location; 
      this.description = description; 
      this.mitreTactic = mitreTactic; 
      this.initialScore = initialScore; 
      this.currentScore = currentScore; 
    }
    
  /**
   * Adds points to add to the current score.
   * @param {int} [pointsToAdd] - Points to add to the current score.
   */
    addPoints(pointsToAdd) {
      this.currentScore = this.currentScore + pointsToAdd ;
    }

  /**
   * Adds points to subtract to the current score.
   * @param {int} [pointsToSubtract] - Points to subtract to the current score.
   */
    subtractPoints(pointsToSubtract) {
        this.currentScore = this.currentScore - pointsToSubtract ;
    }

}
  
export default Honeypot;