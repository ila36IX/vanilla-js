import data from './services/data.js';
import api from './services/api.js';
import Route from './services/router.js';

// not used, but it needs to be imported
import ProjectsPage from './components/ProjectsPage.js';
import ProjectPage from './components/ProjectPage.js';
import QuizQuestion from './components/Quiz.js';

window.addEventListener('DOMContentLoaded', main);

async function loadData() {
  app.data.users = null;
  app.data.project = {};
  app.data.users = await api.getUser();
  app.data.projects = await api.getProjects();
}

async function main() {
  // set up the global data state and initialise it
  window.app = {};
  app.data = data;
  loadData();
  Route.init();
}
