const api = {
 url: "/data/menu.js",
  getUser: async function getMenuFromServer () {
    // return await fetch(this.url);
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { 'name': 'ali' }
  }
}

export default api;
