import DOMBuilder from './domBuilder.js';

const Router = {
  init: function touterInit() {
    const links = document.querySelectorAll('a'); // Not sure if all <a> tags are effecting the route
    links.forEach(function changeLinkHandler(element) {
      element.addEventListener('click', linkHandler)
    });

    Router.go(location.pathname); // navigate to path typed by user
    console.log('Route is initialized');

    /************ helpers *************/
    function linkHandler(event) {
        event.preventDefault();
        const path = event.target.getAttribute('href');
        Router.go(path);
    }
  },
  go: function navigate(path, addToHistory=true) {
    if (addToHistory) {
      history.pushState({ path }, '', path);
    }

    if (path.at(-1) == '/' && path.length > 1) {
      path = path.slice(0, path.length - 1);
    }

    const routes = {
      '/': () => DOMBuilder('h1',  'Home Page' ),
      '/users': () => DOMBuilder('h1', 'Users Page'),
      '/projects': () => DOMBuilder('h1', 'Projects Page'),
      '/concepts': () => DOMBuilder('h1', 'Concepts Page'),
      '*': () => DOMBuilder('h1', '404 - Not Found')
    };
    const pageFactory = routes[path] || routes['*'];
    const root = document.querySelector('#app');
    root.innerHTML = '';
    root.appendChild(pageFactory());
  }
}

export default Router;
