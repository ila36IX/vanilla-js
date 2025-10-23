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
<div class="border p-4 d-flex flex-column justify-content-between" style="min-height: 70vh;">
  <div>
    <header class="d-flex flex-row justify-content-between mb-4">
      <div>
        <button class="btn btn-primary" id='showAll'>Show All</button>
      </div>
      <div>
        <span id='progress' class='border border-info rounded-2 text-success bg-info bg-opacity-10 px-3 py-1'></span>
      </div>
    </header>
    <section>
      <div class="border-bottom border-opacity-75 mb-4 pb-4" id='question'></div>
      <form id='choices'></form>
    </section>
  </div>
  <div class="d-flex justify-content-end gap-2">
    <button type="button" id="prevQuiz" class="btn btn-secondary">Prev</button>
    <button type="button" id="nextQuiz" class="btn btn-primary">Next</button>
  </div>
</div>
`;
    this.$nextQuiz = this.querySelector('#nextQuiz');
    this.$prevQuiz = this.querySelector('#prevQuiz');
    this.$progress = this.querySelector('#progress');
    this.$showAll  = this.querySelector('#showAll');
    this.$question = this.querySelector('#question');
    this.$answers  = this.querySelector('#choices');

    this.$nextQuiz.addEventListener('click', () => this.nextQuiz());
    this.$prevQuiz.addEventListener('click', () => this.prevQuiz());
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
      this.render();
    }
  }

  prevQuiz () {
    if (this.currentQuiz > 0) {
      this.currentQuiz--;
      this.render();
    }
  }

  render() {
    if (!this.quizes) return ;
    this.$progress.textContent = `${this.currentQuiz + 1}/${this.manyQuizes}`;
    this.$question.innerHTML = this.quizes[this.currentQuiz].question;
    this.$answers.innerHTML = '';
    let i = 0;
    for (const choice of this.quizes[this.currentQuiz].choices) {
      const el = `<div class="form-check">
        <input class="form-check-input" type="radio" value="${i}" name="${this.currentQuiz}" />
        <lable class="form-check-label" for='${this.currentQuiz}'>${choice.text}</lable>
      </div>`;
      i++;
      this.$answers.insertAdjacentHTML('beforeend', el);
    }
  }
}

customElements.define("quiz-comp", QuizComp);
