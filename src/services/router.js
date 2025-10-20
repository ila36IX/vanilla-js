import DOMBuilder from './domBuilder.js';
import api from '../services/api.js';

// router function will take as parameter the path the user tries to go to
// each key is regex for a path, and the value is the factory that will
// generate the markup
const routes = {
  '/': () => DOMBuilder('h1',  'Home Page' ),
  '/users': () => DOMBuilder('users-page'),
  '/projects': () => DOMBuilder('projects-page'),
  '/concepts': () => DOMBuilder('h1', 'Concepts Page'),
  '/projects/show/([0-9]+)': showProject,
  '*': () => DOMBuilder('h1', 'Not Found'),
};

await void showProject(path)
{
  const rg = new RegExp('/projects/show/([0-9]+)');
  const match = rg.exec(path);

  return (DOMBuilder('h1', path));
  if (match) {
    const currentProjectId = match[1];
    const quizes = api.getProjectQuiz(currentProjectId);
    app.data.quizes = {
      currentQuiz: 0,
      all: quizes,
      exist: true
    }
  }
  else {
    app.data.quizes = {
      currentQuiz: 0,
      all: null,
      exist: false
    }
  }
  return DOMBuilder('project-page');
}

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
    var pageContent = null;
    for ([pathPattern, callBack] of Object.entries(routes)) {
      const rg = new RegExp(pathPattern);
      const match = rg.exec(path);
      if (match) {
        pageContent = callBack(match);
      }
    }

    const root = document.querySelector('#root');
    root.innerHTML = '';
    root.appendChild(pageContent);
    window.scrollX = 0;
    window.scrollY = 0;
  },

  _onLinkClicked(event) {
    const link = event.target.closest('a');
    if (!link || link.getAttribute('target') == '_blank') return;
    event.preventDefault();
    const href = link.getAttribute('href');
    Router.go(href);
  }
}

export default Router;
