import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook used to create an event callback that depends on any local component state,
 * when used and the callback needs to use any variable in the local state, will get the latest value.
 *
 * @param fn Callback function
 * @param dependencies Array of dependencies
 */

function useEventCallback(fn, dependencies) {
  const ref = useRef((..._) => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useEffect(() => {
    ref.current = fn;
  }, [fn, ...dependencies]);

  return useCallback(
    (...args) => {
      const fn = ref.current;
      return fn(...args);
    },
    [ref]
  );
}

export default useEventCallback;
