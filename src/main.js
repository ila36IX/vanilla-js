import Store from './services/Store.js';
import API from './services/API.js';
import Route from './services/Router.js';

// @Critical: the module needs to be imported in order for the code to run and
// make the components available
import ProjectsPage from './components/ProjectsPage.js';
import ProjectPage from './components/ProjectPage.js';
import QuizQuestion from './components/Quiz.js';
import DesignSystem from './components/DesignSystem.js';

// you can do it also like this: window.onDOMContentLoaded = main
window.addEventListener('DOMContentLoaded', main);

async function loadData() {
  window.app = {};
  app.Store = Store;
}


async function main() {
  // // set up the global data state and initialise it
  loadData();
  Route.init();
  setInterval(() => {
    Store.time = new Date();
  }, 2000);
}
