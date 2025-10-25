const api = {
  url: "/220.json",

  async getUser () {
    // return await fetch(this.url);
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [
      { 'name': 'ali' },
      { 'name': 'othername' }
    ]
  },

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

  async getProjectQuiz(_id) {
    if (!_id) return null;
    if (!app.data.projects)
      app.data.projects = await api.getProjects();
    const project = Object.values(app.data.projects).find((project) => project.id == _id);
    if (project) {
      return project.quiz;
    } else {
      return null;
    }
  },

  async answerQuestion(questionId, choicesIds) {
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

export default api;
