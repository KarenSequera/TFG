class Honeypot {
    constructor({
      tags = [],
      objective = '',
      location = '',
      description = '',
      mitreStage = '',
      initialScore = 0,
      currentScore = 0
    }) {
      this.tags = tags; 
      this.objective = objective;
      this.location = location; 
      this.description = description; 
      this.mitreStage = mitreStage; 
      this.initialScore = initialScore; 
      this.currentScore = currentScore; 
    }

    getHoneypot() {
      return {
        tags: this.tags,
        objective: this.objective,
        location: this.location,
        description: this.description,
        mitreStage: this.mitreStage,
        initialScore: this.initialScore,
        currentScore: this.currentScore,
      };
    }
  
    addPoints(pointsToAdd) {
      this.currentScore = this.currentScore + pointsToAdd ;
    }

    substractPoints(pointsToSubstract) {
        this.currentScore = this.currentScore - pointsToAdd ;
    }

    resetScore(){
        this.currentScore = this.initialScore
    }
}
  
  export default Honeypot;