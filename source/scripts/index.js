class NavigationMenu {
  static States = {
    OPENED: 'page-navigation--menu-opened',
    CLOSED: 'page-navigation--menu-closed',
    NO_JS: 'page-navigation--no-js',
  };

  menuEl = null;
  burgerButtonEl = null;
  isOpened = null;

  constructor() {
    this.menuEl = document.querySelector('.page-navigation');
    if (!this.menuEl) {
      throw new Error('Couldn\'t find .page-navigation element!');
    }

    this.burgerButtonEl = this.menuEl.querySelector('.page-navigation__burger');
    if (!this.burgerButtonEl) {
      throw new Error('Couldn\'t find .page-navigation__burger element!');
    }

    this.isOpened = this.menuEl.classList.contains(NavigationMenu.States.OPENED);
  }

  handleEvents() {
    this.menuEl.classList.remove(NavigationMenu.States.NO_JS);
    this.burgerButtonEl.addEventListener('click', this.onBurgerClickHandle);
  }

  onBurgerClickHandle = () => {
    if (this.isOpened) {
      this.menuEl.classList.replace(
        NavigationMenu.States.OPENED,
        NavigationMenu.States.CLOSED,
      );
    } else {
      this.menuEl.classList.replace(
        NavigationMenu.States.CLOSED,
        NavigationMenu.States.OPENED,
      );
    }

    this.isOpened = !this.isOpened;
  };
}

const navigationMenu = new NavigationMenu();
navigationMenu.handleEvents();
