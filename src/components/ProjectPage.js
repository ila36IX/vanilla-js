import { createElement } from '../services/createElement.js';
import API from '../services/API.js';

export default class ProjectPage extends HTMLElement {
  constructor () {
    super();
  }

  connectedCallback() {
    // const template = document.getElementById("quiz-template");
    // const content = template.content.cloneNode(true);
    // this.appendChild(content);
    window.addEventListener('_ProjectsIndexChange', () => this.render());
    this.render();
  }

  async render () {
    const project = await api.getProjectById(this.dataset.id);
  }
}

customElements.define("project-page", ProjectPage);
