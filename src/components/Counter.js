import { BaseComponent } from '../components/Base.js';
import Store from '../services/Store.js';

function incrCounter() {
  Store.counter++;
}

function decrCounter() {
  Store.counter--;
}


class Counter extends BaseComponent {
  static get templateId() {
    return 'template-counter-comp';
  }

  constructor() {
    super();
    if (Store.counter === undefined)
      Store.counter = 0;

    this.fields = {
      nbr: Store.counter || 0,
    }

    this.events = {
      _counter: this.counterChangesHandler.bind(this)
    }

    this.assignListeners();
  }

  counterChangesHandler() {
    this.updateField('nbr', Store.counter);
    this.renderFields();
  }

  async onMount() {
    this.$('[data-incr]').addEventListener('click', incrCounter);
    this.$('[data-decr]').addEventListener('click', decrCounter);
    this.renderFields();
  }
}

customElements.define("counter-comp", Counter);
