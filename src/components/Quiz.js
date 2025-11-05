import api from "../services/api.js";
import DOMBuilder from '../services/domBuilder.js';

export class QuizApp extends HTMLElement { 
  constructor () {
    super();
    this.quizData = [];
    this.currentQuestionIndex = 0;
  }

  async connectedCallback() {
    const template = document.getElementById("quiz-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);

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
          correctChoices: [10]
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
      this.setUpButtons();
      this.renderCurrentQuestion();

    } catch (err) {
      this.innerHTML = `<p>Error loading quiz...</p>`;
      console.error(err);
    }
  }

  setUpButtons() 
  {
    const $wrapper = this.querySelector(".quizNav");
    $wrapper.innerHTML = '';
    let i = 0;
    for (const quiz of this.quizData) {
      if (quiz.correctChoices.length) {
        var $btn = `<button class="quizNav__btn quizNav__btn--answered" data-index="${i}"></button>`;
      } else {
        var $btn = `<button class="quizNav__btn" data-index="${i}"></button>`;
      }
      $wrapper.insertAdjacentHTML('beforeend', $btn);
      i++;
    }
    const $btns = this.querySelectorAll(".quizNav__btn");
    for (const $btn of $btns) {
      $btn.addEventListener('click', (e) => {
        this.currentQuestionIndex = Number(e.currentTarget.dataset.index);
        this.renderCurrentQuestion();
      });
    }
  }

  renderCurrentQuestion() {
    const questionEl = document.createElement('quiz-question');
    questionEl.addEventListener('choice-selected', this.correctChoiceSelected.bind(this));
    questionEl.quizData = this.quizData[this.currentQuestionIndex];
    const $container = this.querySelector('.quiz__container')
    $container.innerHTML = '';
    $container.appendChild(questionEl);
  }

  correctChoiceSelected(event) {
    const question = this.quizData.find(quiz => quiz.questionId == event.detail.questionId);
    question.correctChoices = event.detail.correctChoices;
    console.log(this.quizData)
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
      if (this.correctChoices.includes(choice.id)) {
        var choicetemplate = `<button class="quiz__choice quiz__choice--correct" data-choice_id="${choice.id}">
${choice.markup}
</button>`;
      }
      else {
        var choicetemplate = `<button class="quiz__choice" data-choice_id="${choice.id}">
${choice.markup}
</button>`;
      }
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
        this.querySelector(`[data-choice_id="${choice}"]`).classList.add('quiz__choice--correct');
      }
      this.correctChoices = r.correctChoices;
      this.dispatchEvent(new CustomEvent("choice-selected", {
        detail: {
          questionId: this.questionId,
          correctChoices: this.correctChoices,
        },
        bubbles: true
      }));
    } 
    this.activateButtons();
  }

  disableButtons () {
    const ctaChoices = this.$choices.querySelectorAll('.quiz__choice');
    this.buttonActive = false;
    for (const ctaChoice of ctaChoices) {
      ctaChoice.classList.add('quiz__choice--disabled');
      ctaChoice.disabled = true;
    }
  }

  activateButtons () {
    const ctaChoices = this.$choices.querySelectorAll('.quiz__choice');
    this.buttonActive = true;
    for (const ctaChoice of ctaChoices) {
      ctaChoice.classList.remove('quiz__choice--disabled');
      ctaChoice.classList.remove('quiz__choice--selected');
      ctaChoice.disabled = false;
    }
    this.selectedChoices = [];
  }

  buttonClicked(event) {
    const clickedChoiceId = event.currentTarget.dataset.choice_id;
    if (!this.selectedChoices.includes(clickedChoiceId)) {
      this.selectedChoices.push(clickedChoiceId);
      this.querySelector(`[data-choice_id="${clickedChoiceId}"]`).classList.add('quiz__choice--selected');
    } else {
      this.selectedChoices.splice(this.selectedChoices.indexOf(clickedChoiceId), 1); // remove element from array
      this.querySelector(`[data-choice_id="${clickedChoiceId}"]`).classList.remove('quiz__choice--selected');
    }
    if (this.selectedChoices.length == this.manyCorrectAnswers)
      this.submitChoices();
  }
}


customElements.define("quiz-question", QuizQuestion);
customElements.define("quiz-app", QuizApp);
