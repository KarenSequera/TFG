/**
 * Represents an answer of a question. 
 */
class Answer {
  /**
   * Creates a new Answer instance.
   * @param {Object} params - The parameters for the Answer.
   * @param {string} [params.text=''] - The text of the answer.
   * @param {string[]} [params.tagsAdd=[]] - Tags to add when this answer is selected.
   * @param {number} [params.pointsToAdd=0] - Points to add when this answer is selected.
   * @param {string[]} [params.tagsSubtract=[]] - Tags to subtract when this answer is selected.
   * @param {number} [params.pointsToSubstract=0] - Points to subtract when this answer is selected.
   * @param {string[]} [params.tagsQuestion=[]] - Tags associated with the question this answer activates.
   */
  constructor({
    text = '',
    tagsAdd = [],
    pointsToAdd = 0,
    tagsSubstract = [],
    pointsToSubstract = 0,
    tagsQuestion = [],
  }) {
    this.text = text;
    this.tagsAdd = tagsAdd;
    this.pointsToAdd = pointsToAdd;
    this.tagsSubstract = tagsSubstract;
    this.pointsToSubstract = pointsToSubstract;
    this.tagsQuestion = tagsQuestion;
  }
  
  /**
   * This function returns the attributes of the instace. 
   */
    getAnswer() {
      return {
        text: this.text,
        tagsAdd: this.tagsAdd,
        pointsToAdd: this.pointsToAdd,
        tagsSubstract: this.tagsSubstract,
        pointsToSubstract: this.pointsToSubstract,
        tagsQuestion: this.tagsQuestion,
      };
    } 
}  
  
  export default Answer;