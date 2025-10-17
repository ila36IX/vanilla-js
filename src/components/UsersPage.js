import DOMBuilder from "../services/domBuilder.js";

export default class UsersPage extends HTMLElement {
  constructor () {
    super();
  }

  connectedCallback() {
    const template = document.getElementById("users-table-template");
    const content = template.content.cloneNode(true);
    this.appendChild(content);
    window.addEventListener('appuserschange', () => this.render());
    this.render();
  }

  render () {
    if (app.data.users) {
      const wrapper = this.querySelector('tr');
      wrapper.innerHTML = '';
      for (let user of app.data.users) {
        if (typeof user.name === 'string')
          wrapper.appendChild(DOMBuilder('th', user.name))
      }
    }
    else {
      const wrapper = this.querySelector('tr');
      wrapper.innerHTML = '<th>loading...</th>';
    }
  }
}

customElements.define("users-page", UsersPage);
