class Question {
    constructor({ 
        tags = [],
        text = '',
        answers = [],
        active = true
    }) {
      this.tags = tags; 
      this.text = text; 
      this.answers = answers; 
      this.active = active;
    }

    activateQuestion(){
        this.active = true;
    }

    getQuestion() {
      return {
        tags: this.tags,
        text: this.text,
        answers: this.answers,
        active: this.active
      };
    }
  }
  
  export default Question;