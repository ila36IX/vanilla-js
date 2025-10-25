import api from "../services/api.js";
import DOMBuilder from '../services/domBuilder.js';

// export default class QuizComp extends HTMLElement { 
//   constructor () {
//     super();
//     this.handleQuizChange = this.handleQuizChange.bind(this);
//     this.currentQuiz = 0;
//     this.manyQuizes = 0;
//   }
//
//   connectedCallback() {
//     window.addEventListener('_ProjectQuizChanged', this.handleQuizChange);
//     this.$nextQuiz = this.querySelector('#nextQuiz');
//     this.$prevQuiz = this.querySelector('#prevQuiz');
//     this.$progress = this.querySelector('#progress');
//
//     this.$nextQuiz.addEventListener('click', () => this.nextQuiz());
//     this.$prevQuiz.addEventListener('click', () => this.prevQuiz());
//
//     this.render();
//   }
//
//   disconnectedCallback() {
//     window.removeEventListener('_ProjectQuizChanged', this.handleQuizChange);
//   }
//
//   handleQuizChange() {
//     if (app.data.projectQuiz) {
//       this.quizes = app.data.projectQuiz.all;
//       this.manyQuizes = app.data.projectQuiz.all.length;
//       this.currentQuiz = app.data.projectQuiz.currentQuizIndex;
//     }
//     this.render();
//   }
//
//   nextQuiz () {
//     if (this.currentQuiz < this.manyQuizes - 1) {
//       let $toHide = this.querySelector(`#question-${this.currentQuiz}`);
//       let $toShow = this.querySelector(`#question-${this.currentQuiz + 1}`);
//       if ($toHide)
//         $toHide.classList.add('d-none');
//       if ($toShow)
//         $toShow.classList.remove('d-none');
//       this.currentQuiz++;
//       this.updateProgress();
//     }
//   }
//
//   prevQuiz () {
//     if (this.currentQuiz > 0) {
//       let $toHide = this.querySelector(`#question-${this.currentQuiz}`);
//       let $toShow = this.querySelector(`#question-${this.currentQuiz - 1}`);
//       if ($toHide)
//         $toHide.classList.add('d-none');
//       if ($toShow)
//         $toShow.classList.remove('d-none');
//       this.currentQuiz--;
//     }
//     this.updateProgress();
//   }
//
//
//   render() {
//
//   }
// }

function multipleChoices(choices) {
  let i = 0;
  for (let choice of choices) {
    if (choice.is_correct) i++;
  }
  return i > 1;
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
  }

  connectedCallback() {
    const template = document.getElementById("question-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    this.questionMarkup = '<h1>How are you</h1>';
    this.questionId = 2;
    this.choices = [
      {id: 20, markup: '<p>Fine</p>'},
      {id: 21, markup: '<p>Good</p>'},
      {id: 22, markup: '<p>Amazing</p>'},
    ];
    this.$choices = this.querySelector('#choices');
    this.buttonActive = true;
    this.manyCorrectAnswers = 1;
    this.selectedChoices = [];
    this.render();
  }

  render() {
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
      button.style.cursor = 'pointer';
      button.disabled = false;
    }
    this.selectedChoices = [];
  }

  buttonClicked(event) {
    this.selectedChoices.push(event.currentTarget.dataset.choice_id);
    if (this.selectedChoices.length == this.manyCorrectAnswers)
      this.submitChoices();
  }
}


// customElements.define("quiz-comp", QuizComp);
customElements.define("quiz-question", QuizQuestion);
