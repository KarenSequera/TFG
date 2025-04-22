/**
 * Represents an answer of a question. 
 */
class Answer {

  #pointsToAdd 
  #pointsToSubtract

  /**
   * Creates a new Answer instance.
   * @param {Object} params - The parameters for the Answer.
   * @param {string} [params.text=''] - The text of the answer.
   * @param {string[]} [params.tagsAdd=[]] - Tags to add when this answer is selected.
   * @param {number} [params.pointsToAdd=0] - Points to add when this answer is selected.
   * @param {string[]} [params.tagsSubtract=[]] - Tags to subtract when this answer is selected.
   * @param {number} [params.pointsToSubtract=0] - Points to subtract when this answer is selected.
   * @param {string[]} [params.tagsQuestion=[]] - Tags associated with the question this answer activates.
   */
  constructor({
    text = '',
    tagsAdd = [],
    pointsToAdd = 0,
    tagsSubtract = [],
    pointsToSubtract = 0,
    tagsQuestion = [],
  }) {
    this.text = text;
    this.tagsAdd = tagsAdd;
    this.#pointsToAdd = pointsToAdd;
    this.tagsSubtract = tagsSubtract;
    this.#pointsToSubtract = pointsToSubtract;
    this.tagsQuestion = tagsQuestion;
  }
  /**
   * Returns the amount of points to add
   * @returns {int} - The amount of points to add
   */
  getPointsToAdd(){
    return this.#pointsToAdd;
  }

 /**
   * Returns the amount of points to subtract
   * @returns {int} - The amount of points to subtract
   */  
  getPointsToSubtract(){
    return this.#pointsToSubtract;
  }
}  
  
  export default Answer;