import { createElement } from '../services/createElement.js';
import { BaseComponent } from './BaseComponent.js';
import { PascaleToKababCase } from '../services/caseConvertor.js';
import Store from '../services/Store.js';

function getCurrentQuestionData(questionId) {
  return Store.quiz.find((i) => i = questionId);
}



/**
 * @type CustomElementConstructor
 */
class QuestionQuiz extends BaseComponent {
}

function selectQuizOption(optionId) {
  if (Store.selectedQuizOptions.has(optionId)) {
    Store.selectedQuizOptions.delete(optionId);
  } else {
    Store.selectedQuizOptions.add(optionId);
  }
  // console.log(Store.selectedQuizOptions);
}

export class QuestionOption extends BaseComponent {
  constructor() {
    super();
  }

  handleClick() {
    selectQuizOption(this.dataset.id);
    console.log(this.handleClick.bind(this) == this.handleClick.bind(this));
  }

  onMount() {
    this.addEventListener('click', this.handleClick);
    if (this.dataset.selected) {
      this.$('[data-text]').classList.add('quiz__choice--selected');
    }
    if (this.dataset.disabled) {
      this.$('[data-text]').classList.add('quiz__choice--disabled');
    }
  }
}

/**
 * @type CustomElementConstructor
 */
export class DummyComp extends BaseComponent {
  updateTime() {
    this.renderAttribute('time', Store.time.toLocaleTimeString());
  }

  onMount() {
    this.events = {
      '_time': () => this.updateTime(),
    };
    this.renderAttribute('time', Store.time.toLocaleTimeString());
  }
}

customElements.define("dummy-comp", DummyComp);
customElements.define("question-option", QuestionOption);
customElements.define("question-quiz", QuestionQuiz);
