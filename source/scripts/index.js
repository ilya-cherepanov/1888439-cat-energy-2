const Viewport = {
  MOBILE: 320,
  TABLET: 768,
  DESKTOP: 1440,
};

function debounce(cb, ms) {
  let id = null;

  return (...args) => {
    if (id !== null) {
      clearTimeout(id);
    }

    id = setTimeout(() => {
      cb(...args);
      id = null;
    }, ms);
  };
}

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

class Slider {
  static DEFAULT_KEY_DOWN_INCREMENT = 5;
  static DEFAULT_SLIDER_STATE = 50;

  keyDownIncrement = Slider.DEFAULT_KEY_DOWN_INCREMENT;

  _thumbElement = null;
  _sliderElement = null;
  _sliderX = 0;
  _percentOfSliderWidth = 0;
  _currentState = 0;
  _rafId = null;

  constructor(sliderElement) {
    this._sliderElement = sliderElement;
    this.currentState = Slider.DEFAULT_SLIDER_STATE;

    const thumb = this._sliderElement.querySelector('.slider__thumb');
    if (!thumb) {
      throw new Error('Couldn\'t find .slider__thumb element!');
    }
    this._thumbElement = thumb;
  }

  get currentState() {
    return this._currentState;
  }

  set currentState(newState) {
    this._currentState = Math.max(0, Math.min(newState, 100));

    if (this._rafId === null) {
      this._rafId = requestAnimationFrame(() => {
        this._sliderElement.style.setProperty('--slider-state', `${this._currentState}%`);
        this._rafId = null;
      });
    }
  }

  handleEvents() {
    window.addEventListener('resize', this.onWindowResize);
    this.setSliderDimensions();
    this._thumbElement.addEventListener('pointerdown', this.onThumbDown);
    this._thumbElement.addEventListener('ondragstart', () => false);
    this._thumbElement.addEventListener('focus', this.onThumbFocus);
  }

  setSliderDimensions = () => {
    const boundingRect = this._sliderElement.getBoundingClientRect();
    this._sliderX = boundingRect.x;
    this._percentOfSliderWidth = boundingRect.width / 100;
  };

  onThumbDown = (evt) => {
    evt.preventDefault();
    this._thumbElement.setPointerCapture(evt.pointerId);
    this._thumbElement.addEventListener('pointerup', this.onThumbUp);
    this._thumbElement.addEventListener('pointermove', this.onThumbMove);
  };

  onThumbUp = () => {
    this._thumbElement.removeEventListener('pointermove', this.onThumbMove);
    this._thumbElement.removeEventListener('pointerup', this.onThumbUp);
  };

  onThumbMove = (evt) => {
    this.currentState = (evt.clientX - this._sliderX) / this._percentOfSliderWidth;
  };

  onThumbFocus = (evt) => {
    evt.preventDefault();
    document.addEventListener('keydown', this.onKeyDown);
    this._thumbElement.addEventListener('blur', this.onThumbBlur);
  };

  onThumbBlur = () => {
    document.removeEventListener('keydown', this.onKeyDown);
    this._thumbElement.removeEventListener('blur', this.onThumbBlur);
  };

  onKeyDown = (evt) => {
    if (evt.code === 'ArrowLeft') {
      this.currentState -= this.keyDownIncrement;
    } else if (evt.code === 'ArrowRight') {
      this.currentState += this.keyDownIncrement;
    }
  };

  onWindowResize = debounce(this.setSliderDimensions, 100);
}

const navigationMenu = new NavigationMenu();
navigationMenu.handleEvents();

new Map();

const sliderEl = document.querySelector('.slider');
if (sliderEl) {
  const slider = new Slider(sliderEl);
  slider.handleEvents();
}
