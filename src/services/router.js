import DOMBuilder from './domBuilder.js';

// router function will take as parameter the path the user tries to go to
// each key is regex for a path, and the value is the factory that will
// generate the markup
const routes = {
  '/': () => DOMBuilder('h1',  'Home Page' ),
  '/users': () => DOMBuilder('users-page'),
  '/projects': () => DOMBuilder('projects-page'),
  '/concepts': () => DOMBuilder('h1', 'Concepts Page'),
};

const Router = {
  init() {
    document.body.addEventListener('click', this._onLinkClicked);

    window.addEventListener('popstate', function handlePopState(e) {
      // in case of getting back, dont't pash to history
      Router.go(e.state.path, false);
    })

    Router.go(location.pathname); // navigate to path typed by user
  },

  go(path, addToHistory=true) {
    if (addToHistory) {
      history.pushState({ path }, '', path);
    }

    if (path.at(-1) == '/' && path.length > 1) {
      path = path.slice(0, path.length - 1);
    }

    Router.renderPage(path);
  },

  renderPage(path) {
    // Get the function that will generate the page markup
    let pageFactory = routes[path];
    if (!pageFactory)
    {
      const rg = new RegExp('/projects/show/([0-9]+)');
      const match = rg.exec(path);
      if (match) {
        pageFactory = () => DOMBuilder('project-page', '', { attr: { "data-id": match[1] } });
      }
      else
        pageFactory = () => DOMBuilder('h1', '404: Page Not Found: '+path);
    }
    const root = document.querySelector('#root');

    root.innerHTML = '';
    root.appendChild(pageFactory(path));
    window.scrollX = 0;
    window.scrollY = 0;
  },

  _onLinkClicked(event) {
    const link = event.target.closest('a');
    if (!link) return;
    event.preventDefault();
    const href = link.getAttribute('href');
    Router.go(href);
  }
}

export default Router;
