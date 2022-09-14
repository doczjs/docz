import failOnConsole from 'jest-fail-on-console';

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);
global.ResizeObserver = require('resize-observer-polyfill');

if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    enumerable: true,
    configurable: true,
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

failOnConsole({
  shouldFailOnWarn: false,
  silenceMessage: (errorMessage) => {
    if (/Warning: ReactDOM.render is no longer supported in React 18/i.test(errorMessage)) {
      return true;
    }
    return false;
  },
});
