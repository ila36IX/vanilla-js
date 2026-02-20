import { createElement } from '../services/createElement.js';
import { BaseComponent } from '../components/Base.js';
import { PascaleToKababCase } from '../services/caseConvertor.js';
import Store from '../services/Store.js';

// class QuizOption extends BaseComponent {
//   static get templateId() {
//     return 'question-quistion-option';
//   }
//
//   constructor() {
//     super();
//     this.fields = {
//       text: this.dataset.text || "Void",
//     }
//     this.events = {
//       // '_time': this.updateOption.bind(this),
//     }
//     this.assignListeners();
//   }
//
//   updateOption(event) {
//     const curr = event.detail.value;
//     this.updateField('text', curr.getSeconds()+"");
//   }
//
//   async onMount() {
//     this.renderFields();
//   }
// }
//

function getCurrentQuestionData(questionId) {
  return Store.quiz.find((i) =>i=questionId);
}

class QuistionQuiz extends BaseComponent {
  constructor() {
    super();
    this.body = [ 
      createElement('h2', "Fuck1"),
      createElement('h2', "Fuck2"),
      createElement('h2', "Fuck3"),
      createElement('h2', "Fuck4"),
    ]
  }

  initFields() {
    const meta = getCurrentQuestionData(this.dataset.id);
    this.fields = {
      text: meta.questionMarkup,
    }
  }

  async onMount() {
    this.initFields();
    this.ready();
  }
}

function selectQuizOption(optionId) {
  if (quizOptionSelected(optionId)) {
    Store.selectedQuizOptions.delete(optionId);
  } else {
    Store.selectedQuizOptions.add(optionId);
  }
  console.log(Store.selectedQuizOptions);
}

/**
 * Chack if the option was already selected
 *
 * @param {optionId} the clicked option id
 * @return true if already selected
 */
function quizOptionSelected(optionId) {
  return Store.selectedQuizOptions.has(optionId);
}

export class QuestionOption extends BaseComponent {
  handleClick() {
    if (Store.waitingForSelectedOptionResult)
      return ;
    console.log(this.dataset)
    selectQuizOption(this.dataset.id);
  }

  onMount() {
    this.addEventListener('click', this.handleClick.bind(this));
    if (this.dataset.selected) {
      this.$('[data-text]').classList.add('quiz__choice--selected');
    }
    if (this.dataset.disabled) {
      this.$('[data-text]').classList.add('quiz__choice--disabled');
    }
  }
}

export class DummyComp extends BaseComponent {
  updateTime() {
        this.renderAttribute('time', Store.time);
  }

  onMount() {
    this.events = {
      '_time' : () => this.updateTime(),
    };
    this.renderAttribute('time', Store.time);
  }
}


customElements.define("dummy-comp", DummyComp);
customElements.define("question-option", QuestionOption);
