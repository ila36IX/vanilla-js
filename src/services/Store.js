import API from "./API.js";

const initState = {
  quizQuestion: null,
  time: new Date()
}

const Store = new Proxy(initState, {
  set(target, property, value) {
    target[property] = value;

    const eventName = `_${property}`;
    const event = new CustomEvent(eventName, { 
      detail: { value: value, property: property } 
    });
    // console.log(`INFO: The event '${eventName}' has been fired!`);
    window.dispatchEvent(event);

    return (true);
  }
});

export default Store;
