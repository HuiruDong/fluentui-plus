import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock clsx - 全局 mock，支持字符串、条件表达式和对象语法
jest.mock('clsx', () =>
  jest.fn((...classes) =>
    classes
      .map(cls => {
        if (typeof cls === 'string') return cls;
        if (typeof cls === 'object' && cls !== null && !Array.isArray(cls)) {
          return Object.keys(cls)
            .filter(key => cls[key])
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ')
  )
);
