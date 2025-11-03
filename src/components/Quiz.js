import api from "../services/api.js";
import DOMBuilder from '../services/domBuilder.js';

export class QuizApp extends HTMLElement { 
  constructor () {
    super();
    this.quizData = [];
    this.currentQuestionIndex = 0;
  }

  async connectedCallback() {
    this.innerHTML = `<p>Loading Quiz...</p>`;

    try {
      this.quizData = [
        {
          questionId: 1,
          questionMarkup: '<p>What is 2 + 2?</p>',
          choices: [
            { id: 10, markup: '<p>3</p>' },
            { id: 11, markup: '<p>4</p>' },
            { id: 12, markup: '<p>5</p>' },
          ],
          manyCorrectAnswers: 1,
          correctChoices: []
        },
        {
          questionId: 2,
          questionMarkup: '<p>Which are frontend frameworks?</p>',
          choices: [
            { id: 20, markup: '<p>React</p>' },
            { id: 21, markup: '<p>Django</p>' },
            { id: 22, markup: '<p>Vue</p>' },
          ],
          manyCorrectAnswers: 2,
          correctChoices: []
        }
      ];
      this.renderCurrentQuestion();

    } catch (err) {
      this.innerHTML = `<p>Error loading quiz...</p>`;
      console.error(err);
    }
  }

  renderCurrentQuestion() {
    this.innerHTML = '';
    const questionEl = document.createElement('quiz-question');
    questionEl.quizData = this.quizData[this.currentQuestionIndex];
    this.appendChild(questionEl);
  }
}

// correctAnswersIds: null|array;
// manyCorrectAnswers: 1>
// choices [
//  {id, markup},
//  ....
// ],
// questionMarkup
// questionId
export default class QuizQuestion extends HTMLElement { 
  constructor () {
    super();
    this.choices = [];
  }

  set quizData(data) {
    this.questionId = data.questionId;
    this.questionMarkup = data.questionMarkup;
    this.choices = data.choices;
    this.manyCorrectAnswers = data.manyCorrectAnswers;
    this.correctChoices = data.correctChoices;
  }

  connectedCallback() {
    const template = document.getElementById("question-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);

    this.buttonActive = true;
    this.selectedChoices = [];
    this.render();
  }

  render() {
    this.$choices = this.querySelector('#choices');
    this.$question = this.querySelector('#question');
    this.$question.innerHTML = this.questionMarkup;
    this.$choices.innerHTML = '';
    this.choices.forEach(choice => {
      const choicetemplate = `<li>
  <button 
    class='btn btn-outline-primary border border-primary w-100'
    data-choice_id='${choice.id}'>
${choice.markup}
  </button>
</li>`;
      this.$choices.insertAdjacentHTML('beforeend', choicetemplate);
    });
    const buttons = this.$choices.querySelectorAll('button');
    for (const button of buttons) {
      button.addEventListener('click', this.buttonClicked.bind(this));
    }
  }

  async submitChoices() {
    if (!this.buttonActive)
      return ;
    this.disableButtons();
    const r = await api.answerQuestion(this.questionId, this.selectedChoices);
    console.log(r);
    if (r.correctChoices) {
      for (let choice of r.correctChoices) {
        this.querySelector(`[data-choice_id="${choice}"]`).classList.add('border-warning');
      }
    } 
    this.activateButtons();
  }

  disableButtons () {
    const buttons = this.$choices.querySelectorAll('button');
    this.buttonActive = false;
    for (const button of buttons) {
      button.classList.add('border-secondary');
      button.style.cursor = 'not-allowed';
      button.disabled = true;
    }
  }

  activateButtons () {
    const buttons = this.$choices.querySelectorAll('button');
    this.buttonActive = true;
    for (const button of buttons) {
      button.classList.remove('border-secondary');
      button.classList.remove('border-danger');
      button.style.cursor = 'pointer';
      button.disabled = false;
    }
    this.selectedChoices = [];
  }

  buttonClicked(event) {
    const clickedChoiceId = event.currentTarget.dataset.choice_id;
    if (!this.selectedChoices.includes(clickedChoiceId)) {
      this.selectedChoices.push(clickedChoiceId);
      this.querySelector(`[data-choice_id="${clickedChoiceId}"]`).classList.add('border-danger');
    }
    if (this.selectedChoices.length == this.manyCorrectAnswers)
      this.submitChoices();
  }
}


customElements.define("quiz-question", QuizQuestion);
customElements.define("quiz-app", QuizApp);
