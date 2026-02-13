const API = {
  url: "/220.json",

  async getProjects() {
    const data = await fetch(this.url);
    return await data.json();
  },

  async getAvailbeProjectsIds() {
    const ids = [];
    if (app.data.projects) {
      for (const project of Object.values(app.data.projects)) {
        ids.push(project.id);
      }
    }
    return ids;
  },

  async getProjectById(_id) {
    if (!app.data.projects || !_id) return null;
    return Object.values(app.data.projects).find((project) => project.id == _id);
  },

  async getQuizById(_id) {
    if (!_id) return null;
    return {
      quizes: [
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
      ]
    }
  },

  async getName() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return "ALIEN";
  },

  async answerQuizQuestion(questionId, choicesIds) {
    const data = {
      1: ['10'],
      2: ['21'],
      3: ['33', '30']
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (!data[questionId])
      return {message: 'Unknown question'};
    if (data[questionId].length != choicesIds.length)
      return {message: 'Wrong number of choices'};
    for (let choiceId of data[questionId]) {
      if (!choicesIds.includes(choiceId)) {
        return {message: 'Wrong choices'};
      }
    }
    return {message: 'Good job', correctChoices: data[questionId]};
  }
}

export default API;
