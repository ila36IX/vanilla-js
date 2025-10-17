import api from "./api.js";

const data = {
  users: null,
  menu: null,
  cart: []
}

const proxiedData = new Proxy(data, {
  set(target, property, value) {
    target[property] = value;

    switch (property) {
      case 'users': window.dispatchEvent(new Event("appuserschange")); break;
      case 'projects': window.dispatchEvent(new Event("_ProjectsIndexChange")); break;
      default: break;
    }
    return (true);
  }
});

export default proxiedData;
