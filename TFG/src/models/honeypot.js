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
   * Returns the attributes of the honeypot.
   */
    getHoneypot() {
      return {
        tags: this.tags,
        type: this.type,
        objective: this.objective,
        location: this.location,
        description: this.description,
        mitreTactic: this.mitreTactic,
        initialScore: this.initialScore,
        currentScore: this.currentScore,
      };
    }

  /**
   * Adds points to add to the current score.
   * @param {int} [pointsToAdd] - Points to add to the current score.
   */
    addPoints(pointsToAdd) {
      this.currentScore = this.currentScore + pointsToAdd ;
    }

  /**
   * Adds points to substract to the current score.
   * @param {int} [pointsToSubstract] - Points to substract to the current score.
   */
    substractPoints(pointsToSubstract) {
        this.currentScore = this.currentScore - pointsToSubstract ;
    }

  /**
   * Sets current score to the initial value. 
   */
    resetScore(){
        this.currentScore = this.initialScore
    }
}
  
export default Honeypot;