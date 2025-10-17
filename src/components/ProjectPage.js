import DOMBuilder from '../services/domBuilder.js';
import api from '../services/api.js';

export default class ProjectPage extends HTMLElement {
  constructor () {
    super();
  }

  connectedCallback() {
    const template = document.getElementById("quiz-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    window.addEventListener('_ProjectsIndexChange', () => this.render());
    this.render();
  }

  async render () {
    const project = await api.getProjectById(this.dataset.id);
    this.innerHTML = '';
    if (!project) {
      this.innerHTML = '<span>N/A</span>'
      return ;
    }
    const desc = DOMBuilder('div', '', { attr:{"class":"border border-1 p-4 mb-4"} });
    desc.innerHTML = project.desc;

    this.appendChild(desc);
    const quizes = project.quiz;
    for (const quiz of quizes) {
      const question = DOMBuilder('div');
      question.innerHTML = quiz.question;
      this.appendChild(question);
      const choices = DOMBuilder('ul');
      for (const choice of quiz.choices) {
        const liChoice = DOMBuilder('li');
        liChoice.innerHTML = choice.text;
        choices.appendChild(liChoice);
      }
      this.appendChild(choices);
    }
  }
}

customElements.define("project-page", ProjectPage);
