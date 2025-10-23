import api from "../services/api.js";
import DOMBuilder from '../services/domBuilder.js';

export default class QuizComp extends HTMLElement { 
  constructor () {
    super();
    this.handleQuizChange = this.handleQuizChange.bind(this);
    this.currentQuiz = 0;
    this.manyQuizes = 0;
  }

  connectedCallback() {
    window.addEventListener('_ProjectQuizChanged', this.handleQuizChange);
      this.innerHTML = `
<div class="border p-4 d-flex flex-column justify-content-between mb-5" style="min-height: 70vh;">
  <div>
    <header class="d-flex flex-row justify-content-between mb-4">
      <div>
        <button class="btn btn-primary" id='showAll'>Show All</button>
      </div>
      <div>
        <span id='progress' class='border border-info rounded-2 text-success bg-info bg-opacity-10 px-3 py-1'></span>
      </div>
    </header>
    <form id='quiz'>
    </form>
  </div>
  <div class="d-flex justify-content-end gap-2 mt-5">
    <button type="submit" id="formSubmit" form="quiz" class="btn btn-primary">Submit</button>
    <!-- <button type="button" id="prevQuiz" class="btn btn-secondary">Prev</button> -->
    <!-- <button type="button" id="nextQuiz" class="btn btn-primary">Next</button> -->
  </div>
</div>
`;
    this.$nextQuiz = this.querySelector('#nextQuiz');
    this.$prevQuiz = this.querySelector('#prevQuiz');
    this.$progress = this.querySelector('#progress');
    this.$showAll  = this.querySelector('#showAll');
    this.$quizForm = this.querySelector('#quiz');


    // this.$nextQuiz.addEventListener('click', () => this.nextQuiz());
    // this.$prevQuiz.addEventListener('click', () => this.prevQuiz());
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener('_ProjectQuizChanged', this.handleQuizChange);
  }

  handleQuizChange() {
    if (app.data.projectQuiz) {
      this.quizes = app.data.projectQuiz.all;
      this.manyQuizes = app.data.projectQuiz.all.length;
      this.currentQuiz = app.data.projectQuiz.currentQuizIndex;
    }
    this.render();
  }

  nextQuiz () {
    if (this.currentQuiz < this.manyQuizes - 1) {
      this.currentQuiz++;
      // this.render();
    }
  }

  prevQuiz () {
    if (this.currentQuiz > 0) {
      this.currentQuiz--;
      // this.render();
    }
  }

  render() {
    if (!this.quizes) return ;
    this.$progress.textContent = `${this.currentQuiz + 1}/${this.manyQuizes}`;

    this.quizes.forEach((question, questionIndex) => {
      const questionId = `question-${questionIndex}`;
      const inputType = multipleChoices(question.choices) ? 'checkbox' : 'radio';
      let answers = '';
      question.choices.forEach((choice, choiceIndex) => {
        const choiceId = `question-${questionIndex}-answer-${choiceIndex}`;
        answers += `<div class="form-check">
<input class="form-check-input" type="${inputType}" value="${choiceId}" id="${choiceId}" name="${questionId}" />
<label class="form-check-label w-100" for="${choiceId}">${choice.text}</label>
</div>`;
      });
      const $quizQuestion = `<div class='border-bottom border-primary mb-1 p-4'>
<h2 class='text-primary'>Question #${questionIndex}</h2>
<div>${question.question}</div>
<div>${answers}</div>
</div>`
      this.$quizForm.insertAdjacentHTML('beforeend', $quizQuestion)
    });

    this.$quizForm.addEventListener('submit', e => {
      e.preventDefault();
      const formData = new FormData(this.$quizForm);
      let data = {};
      formData.keys().forEach(key => data = {...data, [key]: formData.getAll(key)})
      console.log(data);
    });
  }
}

function multipleChoices(choices) {
  let i = 0;
  for (let choice of choices) {
    if (choice.is_correct) i++;
  }
  return i > 1;
}

customElements.define("quiz-comp", QuizComp);
