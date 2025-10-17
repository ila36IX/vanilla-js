import DOMBuilder from '../services/domBuilder.js';
import api from '../services/api.js';

export default class ProjectsPage extends HTMLElement {
  constructor () {
    super();
  }

  connectedCallback() {
    const template = document.getElementById("projects-index-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    window.addEventListener('_ProjectsIndexChange', () => this.render());
    this.render();
  }

  async render () {
    const container = this.querySelector('div'); 
    const projectIds = await api.getAvailbeProjectsIds();

    container.innerHTML = '';
    if (projectIds) {
      projectIds.forEach(function createProjectLink(_id) {
        const options = { attr: {'href': '/projects/show/' +  _id} }
        container.appendChild(DOMBuilder('a', _id, options));
      });
    }
  }
}

customElements.define("projects-page", ProjectsPage);
