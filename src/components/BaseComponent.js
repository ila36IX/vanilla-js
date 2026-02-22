/**
 * template: template--dummy_name
 * attrbute: dummy_name--attr_name
 * slot: 'dummy-name--slot' attribute to target the where to render the children
 * tag: dummy-name
 */

export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.events = {}; // overried this with your custom events
  }

  get templateNamePrefix() {
    return 'template--';
  }

  /**
   * Get the id of the template in HTML markup
   */
  get templateId() {
    return this.templateNamePrefix + this.tagName.toLowerCase().replace(/-/g, '_');
  }

  connectedCallback() {
    this.loadTemplate();
    this.renderAttributes();
    this.renderChildren();
    this.onMount();
    this.assignListeners();
  }

  /**
   * Internal method to handle template cloning
   */
  loadTemplate() {
    const template = /** @type {HTMLTemplateElement} */ (document.getElementById(this.templateId));
    /**
     * the body needs to be saved bacause rendering the temiplate will destory
     * the compoenent children
     */
    this.body = Array.from(this.childNodes);
    if (template) {
      this.replaceChildren(template.content.cloneNode(true));
    } else {
      console.error(`[${this.constructor.name}] Template definition not found: #${this.templateId}`);
    }
  }

  /**
   * Suppose to be override by the inherited component
   */
  onMount() {
  }

  assignListeners() {
    for (const [event, handler] of Object.entries(this.events)) {
      window.addEventListener(event, handler);
    }
  }

  renderAttributes() {
    this.getAttributeNames().forEach(name => {
      if (!name.startsWith('data-') && name != 'style') {
        const value = this.getAttribute(name);
        this.renderAttribute(name, value);
      }
    });
  }

  /**
   * @param {string} name
   */
  getAttributeDOM(name) {
    const prefix = this.templateId.replace(this.templateNamePrefix, '');
    const nodeSelector = `[${prefix}--${name}]`;
    const node = this.querySelector(nodeSelector);
    if (!node)
      this.logWarn(`Missing the attribute (${prefix}--${name}) in its template`);
    return node;
  }

  /**
   * Render component attributes
   * eg. if template name is 'template--question-option' this function will
   * target the element with the attribute 'question-option--name' with name
   * here being the name passed to the function
   *
   * @param {string} name
   * @param {string | Node} value
   */
  renderAttribute(name, value) {
    this.getAttributeDOM(name)?.replaceChildren(value);
  }

  logWarn(...msgs) {
    console.warn(`[${this.constructor.name}]`, ...msgs);
  }

  renderChildren() {
    const prefix = this.templateId.replace(this.templateNamePrefix, '');
    const nodeSelector = `[${prefix}--slot]`;
    const container = this.$(nodeSelector);
    if (container && this.body)
      container.replaceChildren(...this.body);
  }

  deleteListeners() {
    for (const [event, handler] of Object.entries(this.events)) {
      window.removeEventListener(event, handler);
    }
  }

  /**
   * hook for child classes
   */
  onUnmount() { }

  /**
   * Select element inside the shadow DOM element
   * Usage: this.$('selctor')
   * @param {string} selector
   */
  $(selector) {
    return this.querySelector(selector);
  }

  disconnectedCallback() {
    this.deleteListeners();
    console.log(this.templateId, "Cleaning up...");
  }
}

