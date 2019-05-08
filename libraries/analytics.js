import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';

const dev = process.env.NODE_ENV !== 'production';

// GOOGLE ANALYTICS ========================================================================

const TRACKING_ID = 'UA-139836521-1';

export const initGA = () => {
  /* eslint-disable no-undef */
  if (!window.GA_INITIALIZED) {
    ReactGA.initialize(TRACKING_ID, {
      debug: dev
    });
    window.GA_INITIALIZED = true;
  }
};

export const logPageView = (
  pageName = window.location.pathname + window.location.search // eslint-disable-line no-undef
) => {
  ReactGA.set({ page: pageName });
  ReactGA.pageview(pageName);
};

export const trackCustomEvent = (category, action) =>
  ReactGA.event({ category, action });

export const { ga } = ReactGA;

// HOTJAR ========================================================================

const HOTJAR_ID = 1312889;
const HOTJAR_SNIPPET_VERSION = 6;

export const initHotjar = () => {
  /* eslint-disable no-undef */
  if (!window.HOTJAR_INITIALIZED) {
    hotjar.initialize(HOTJAR_ID, HOTJAR_SNIPPET_VERSION);
    window.HOTJAR_INITIALIZED = true;
  }
  /* eslint-enable no-undef */
};

// INITIALIZATION =================================================================

export default function initializeAnalytics() {
  initGA();
  logPageView();
  initHotjar();
}
