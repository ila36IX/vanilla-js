import Store from './services/Store.js';
import API from './services/API.js';
import Route from './services/Router.js';

import './components/DesignSystem.js';

import { createDerived, createSignal } from './services/signals.js';

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

  var counter = createSignal(0);
  var der = createDerived(() => counter.value * 10);

  counter.subscribe((v) => console.log(v));

  setInterval(() => {
    // Store.time = new Date();
    counter.value = (v) => v + 1;
    console.log("Derived", der.value);
  }, 2000);
}
