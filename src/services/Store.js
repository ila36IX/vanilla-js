import API from "./API.js";

const data = [
  {
    questionId: 1,
    questionMarkup: '<p>What is 2 + 2?</p>',
    choices: [
      { id: 10, markup: '<p>3</p>' },
      { id: 11, markup: '<p>4</p>' },
      { id: 12, markup: '<p>5</p>' },
    ],
    manyCorrectAnswers: 1,
    correctChoices: [10]
  },
  {
    questionId: 2,
    questionMarkup: '<p>Which are frontend frameworks?</p>',
    choices: [
      { id: 20, markup: '<p>React</p>' },
      { id: 21, markup: '<p>Django</p>' },
      { id: 22, markup: '<p>Vue</p>' },
      { id: 23, markup: '<p>Hassan</p>' },
    ],
    manyCorrectAnswers: 2,
    correctChoices: []
  }
];

const initState = {
  waitingForSelectedOptionAnswer: false,
  selectedQuizOptions: new Set(),
  currentQuizQuestionId: 1,
  quiz: data,
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
