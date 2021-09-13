class Router {
  storage = [];

  constructor() {
    this.addEvent();
  }

  addEvent() {
    window.addEventListener('hashchange', () => {});
  }

  pushHistoryRouter = (pathName, element) => {
    window.history.pushState({}, pathName, window.location.origin + pathName);
  };
}
