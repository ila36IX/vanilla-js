import data from './services/data.js';
import api from './services/api.js';
import Route from './services/router.js';

window.addEventListener('DOMContentLoaded', main);

async function loadData() {
  app.data.user = await api.getUser();
}
  
function main()
{
  // set up the global data state and init it
  window.app = {};
  app.data = data;
  loadData();
  Route.init();
}
