import api from "../services/api.js";

export default class QuizComp extends HTMLElement { 
  constructor () {
    super();
    this.handleQuizChange = this.handleQuizChange.bind(this);
    this.currentQuiz = 0;
    this.manyQuizes = 0;
  }

  connectedCallback() {
    window.addEventListener('_ProjectQuizChanged', this.handleQuizChange);
    this.render();
  }

  disconnectedCallback() {
    window.removeEventListener('_ProjectQuizChanged', this.handleQuizChange);
  }

  handleQuizChange() {
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
    const quizes = app.data.projectQuiz;

    if (quizes) {
      this.manyQuizes = quizes.all.length;
      this.innerHTML = `
<div>
  <header>
    <div>
      <button>all</button>
    </div>
    <div>
      <span>${this.currentQuiz + 1}/${quizes.all.length}</span>
    </div>
  <header>
  <section>
    <div>${quizes.all[this.currentQuiz].question}</div>
  </section>
  <div>
    <button id='prevQuiz'>Prev</button>
    <button id='nextQuiz'>Next</button>
  </div>
</div>
`;
        document.getElementById('nextQuiz').addEventListener('click', () => this.nextQuiz())
        document.getElementById('prevQuiz').addEventListener('click', () => this.prevQuiz())
    }
  }
}

customElements.define("quiz-comp", QuizComp);
