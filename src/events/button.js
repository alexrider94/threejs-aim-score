class ButtonEvent {
  $selector = null;

  constructor() {
    this.setUp();
    this.init();
  }

  setUp = () => {
    this.$selector = document.querySelector('.button');
  };

  init = () => {
    this.$selector.addEventListener('click', () => {
      location.href = '/game.html';
    });
  };
}

export default ButtonEvent;
