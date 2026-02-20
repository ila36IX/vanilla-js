import Store from './services/Store.js';
import API from './services/API.js';
import Route from './services/Router.js';

import './components/DesignSystem.js';

// you can do it also like this: window.onDOMContentLoaded = main
window.addEventListener('DOMContentLoaded', main);

async function loadData() {
  window.app = {};
  app.Store = Store;
}


async function main() {
  // set up the global data state and initialise it
  loadData();
  Route.init();
  setInterval(() => {
    Store.time = new Date();
  }, 2000);
}
