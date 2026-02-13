import { DOMBuilder } from '../services/DOMBuilder.js';
import { BaseComponent } from '../components/Base.js';
import Store from '../services/Store.js';
import API from '../services/API.js';

export default class DesignSystem extends BaseComponent {
  static get templateId() {
    return 'template-test';
  }

  constructor() {
    console.log("design system");
    super();
    // fields to render used by the template
    this.fields = {
      title: 'Loading...',
      desc: 'selector3',
      time: new Date().toString(),
    }
    this.events = {
        '_time': this.updateTime.bind(this),
    }
    this.assignListeners();
  }

  updateTime(event) {
    this.updateField('time', event.detail.value.toString())
  }

  async onMount() {
    // suppose to udpate this.fields
    this.renderFields();
    this.$('button').addEventListener('click', () => {
      const content = DOMBuilder('button', "testing");
      this.updateField('title', content);
    });
    const name = await API.getName();
    this.fields.title = name;
    this.renderFields();
  }
}

class TimeComp extends BaseComponent {
  static get templateId() {
    return 'template-time';
  }
  constructor() {
    super();
    this.fields = {
      hour: '24',
      minute: '60',
      second: '01' 
    }
    this.events = {
      '_time': this.updateTime.bind(this),
    }
    this.assignListeners();
  }

  updateTime(event) {
    const curr = event.detail.value;
    this.updateField('minute', curr.getMinutes()+"")
    this.updateField('second', curr.getSeconds()+"")
    this.updateField('hour', curr.getHours()+"")
  }

  async onMount() {
    this.renderFields()
  }
}

class QuizOption extends BaseComponent {
  static get templateId() {
    return 'question-quistion-option';
  }

  constructor() {
    super();
    this.fields = {
      text: "How are you doing?",
    }
    this.events = {
      // '_time': this.updateOption.bind(this),
    }
    this.assignListeners();
  }

  updateOption(event) {
    const curr = event.detail.value;
    this.updateField('text', curr.getSeconds()+"");
  }

  async onMount() {
    this.renderFields();
  }
}

class QuistionQuiz extends BaseComponent {
  static get templateId() {
    return 'question-template';
  }

  constructor() {
    super();
    this.fields = {
      questionText: "How are you doing?",
    }
    this.events = {
      // '_time': this.updateOption.bind(this),
    }
    this.assignListeners();
  }

  updateOption(event) {
    const curr = event.detail.value;
    this.updateField('text', curr.getSeconds()+"");
  }

  async onMount() {
    this.renderFields();
  }
}



// customElements.define("design-system", null);
customElements.define("time-comp", TimeComp);
customElements.define("quiz-option", QuizOption);
customElements.define("quiz-question", QuistionQuiz);
