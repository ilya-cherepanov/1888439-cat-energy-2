const Viewport = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1440,
};

class NavigationMenu {
  static State = {
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

    this.isOpened = this.menuEl.classList.contains(NavigationMenu.State.OPENED);
  }

  handleEvents() {
    this.menuEl.classList.remove(NavigationMenu.State.NO_JS);
    this.burgerButtonEl.addEventListener('click', this.onBurgerClickHandle);
  }

  onBurgerClickHandle = () => {
    if (this.isOpened) {
      this.menuEl.classList.replace(
        NavigationMenu.State.OPENED,
        NavigationMenu.State.CLOSED,
      );
    } else {
      this.menuEl.classList.replace(
        NavigationMenu.State.CLOSED,
        NavigationMenu.State.OPENED,
      );
    }

    this.isOpened = !this.isOpened;
  };
}

class Map {
  static PIN_COORDS = [30.323097575388093, 59.93884713117348];
  static Position = {
    MOBILE: {
      center: [30.323054660050616, 59.93910413687607],
      zoom: 14,
    },
    TABLET: {
      center: [30.323058130502318, 59.93952877326669],
      zoom: 14.69,
    },
    DESKTOP: {
      center: [30.320082212218722, 59.939077437002226],
      zoom: 15.78,
    },
  };

  constructor() {
    const viewportWidth = window.innerWidth;
    const mapPosition = this.selectPosition(viewportWidth);
    this.map = new window.maplibregl.Map({
      style: 'https://tiles.openfreemap.org/styles/bright',
      container: 'map',
      ...mapPosition,
    });

    this.marker = this.createPinMarker();
    this.marker.setLngLat(Map.PIN_COORDS);
    this.marker.addTo(this.map);
  }

  createPinMarker() {
    const pinElement = document.createElement('div');
    pinElement.classList.add('contacts__map-pin');
    return new window.maplibregl.Marker({ element: pinElement });
  }

  selectPosition(viewportWidth) {
    if (viewportWidth < Viewport.TABLET) {
      return Map.Position.MOBILE;
    } else if (viewportWidth >= Viewport.TABLET && viewportWidth < Viewport.DESKTOP) {
      return Map.Position.TABLET;
    } else {
      return Map.Position.DESKTOP;
    }
  }
}

const navigationMenu = new NavigationMenu();
navigationMenu.handleEvents();

new Map();
