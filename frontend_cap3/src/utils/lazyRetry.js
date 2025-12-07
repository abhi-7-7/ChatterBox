import React from 'react';

// lazyRetry: retries dynamic import a few times before returning a fallback module
export default function lazyRetry(factory, { retries = 3, interval = 500 } = {}) {
  const load = () => {
    let attempt = 0;

    const tryImport = () =>
      factory().catch((err) => {
        attempt += 1;
        if (attempt >= retries) {
          // return a fallback module shape
          return Promise.resolve({
            default: () => (
              React.createElement('div', { className: 'p-4 m-2 rounded-xl bg-yellow-100 text-yellow-800 border border-yellow-300' }, 'Error loading component')
            ),
          });
        }
        return new Promise((res) => setTimeout(res, interval)).then(tryImport);
      });

    return tryImport();
  };

  return React.lazy(load);
}
