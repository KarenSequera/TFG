class Answer {
    constructor({ 
        text = '',
        tagsAdd = [],
        pointsToAdd = 0,
        tagsSubtract = [],
        pointsToSubstract = 0,
        tagsQuestion = []
     }) {
      this.text = text;
      this.tagsAdd = tagsAdd; 
      this.pointsToAdd = pointsToAdd;
      this.tagsSubtract = tagsSubtract;
      this.pointsToSubstract = pointsToSubstract;
      this.tagsQuestion = tagsQuestion; 
    }
  
    getAnswer() {
      return {
        text: this.text,
        tagsAdd: this.tagsAdd,
        pointsToAdd: this.pointsToAdd,
        tagsSubtract: this.tagsSubtract,
        pointsToSubstract: this.pointsToSubstract,
        tagsQuestion: this.tagsQuestion,
      };
    } 
}  
  
  export default Answer;