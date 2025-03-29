class Answer {
    constructor({ 
        text = '',
        tagsAdd = [],
        tagsSubtract = [],
        tagsQuestion = []
     }) {
      this.text = text;
      this.tagsAdd = tagsAdd; 
      this.tagsSubtract = tagsSubtract;
      this.tagsQuestion = tagsQuestion; 
    }
  
    getAnswer() {
      return {
        text: this.text,
        tagsAdd: this.tagsAdd,
        tagsSubtract: this.tagsSubtract,
        tagsQuestion: this.tagsQuestion,
      };
    } 
}  
  
  export default Answer;