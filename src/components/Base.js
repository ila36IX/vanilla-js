export class BaseComponent extends HTMLElement {
  constructor () {
    super();
    this.fields = {};
  }

  connectedCallback() {
    this._renderTemplate();
    this.onMount();
  }

  assignListeners() {
    if (!this.events)
      return ;
    for (const [event, handler] of Object.entries(this.events)) {
      window.addEventListener(event, handler);
    }
  }

  deleteListeners() {
    if (!this.events)
      return ;
    for (const [event, handler] of Object.entries(this.events)) {
      window.removeEventListener(event, handler);
    }
  }

  /**
   * Internal method to handle template cloning
   */
  _renderTemplate() {
    const templateId = this.constructor.templateId;

    if (templateId) {
      const template = document.getElementById(templateId);
      if (template) {
        this.appendChild(template.content.cloneNode(true));
      } else {
        console.error(`[BaseComponent] Template definition not found: #${templateId}`);
      }
    }
  }

  /**
   * hook for child classes
   */
  onMount() {}

  /**
   * hook for child classes
   */
  onUnmount() {}

  /**
   * Select element inside the shadow DOM element
   * Usage: this.$('selctor')
   */
  $(selector) {
    return this.querySelector(selector);
  }

  replaceInside(selector, child) {
    const node = this.$(selector);
    if (!node) {
      console.warn(selector, "does not select anything");
    } else if (typeof child == 'string') {
      node.replaceChildren(document.createTextNode(child));
    } else if (child instanceof Node) {
      node.replaceChildren(child);
    } else {
      console.error('Expect string|Node got ', child);
    }
  }

  /**
   * Search using data field and repalce the inner childs of the element.
   */
  updateField(name, child) {
    if (child && (typeof child == 'string' || child instanceof Node)) {
      this.fields[name] = child;
      this.renderField(name);
    } else {
      console.error('Expect string|Node got ', child);
    }
  }

  /**
   * Find dataset element and replace its contenet in this DOM.
   */
  renderField(name) {
    const content = this.fields[name];
    if (content) {
      this.replaceInside(`[data-${name}]`, content);
    }
  }

  renderFields() {
    for (const [field, child] of Object.entries(this.fields)) {
      this.updateField(field, child);
    }
  }

  disconnectedCallback() {
    this.deleteListeners();
  }
}

