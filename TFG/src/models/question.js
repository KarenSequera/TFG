import Answer from "./Answer.js";

/**
 * Represents a Question in the questionnaire.
 */
class Question {
  /**
   * Creates a new Question instance.
   * @param {Object} params - The parameters for the Question.
   * @param {string[]} [params.tags=[]] - An array of tags(strings) associated with the question.
   * @param {string} [params.text=''] - The text of the question.
   * @param {Answer[]} [params.answers=[]] - An array of possible answers for the question.
   * @param {boolean} [params.active=true] - Indicates whether the question is active.
   */
  constructor({
    tags = [],
    text = '',
    answers = [],
    active = true,
  }) {
    this.tags = tags;
    this.text = text;
    this.answers = answers;
    this.active = active;
  }
  /**
   * Activates the question
  */
    activateQuestion(){
        this.active = true;
    }

  /**
   * Returns all the attributes of the object
  */
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