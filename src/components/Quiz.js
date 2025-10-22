import api from "../services/api.js";

function BaseComp() {
  return `
  `
}

export default class QuizComp extends HTMLElement { 
  constructor () {
    super();
  }

  connectedCallback() {
    // const template = document.getElementById("quiz-template");
    // const content = template.content.cloneNode(true);
    // this.appendChild(content);
    window.addEventListener('_ProjectQuizChanged', () => console.log("chenged"));
    this.render();
  }
}

customElements.define("quiz-comp", QuizComp);
