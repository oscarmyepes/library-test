import { useEffect, useReducer, useRef } from 'react';
import { GenericObject } from '../../models/generic';
import restFactory from '../../utils/restFactory';

type State<T> = {
  status: 'REJECTED' | 'LOADING' | 'RESOLVED' | 'RESET' | '';
  error: string;
  data: T;
};

type Action<T> =
  | { type: 'ERROR'; error: string }
  | { type: 'SUCCESS'; data: T }
  | { type: 'LOADING' | 'RESET' };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'ERROR': {
      return {
        ...state,
        data: null,
        error: action.error,
        status: 'REJECTED',
      };
    }
    case 'SUCCESS': {
      return {
        ...state,
        data: action.data,
        error: '',
        status: 'RESOLVED',
      };
    }
    case 'LOADING': {
      return {
        ...state,
        error: '',
        status: 'LOADING',
      };
    }
    case 'RESET': {
      return getInitialState();
    }

    default: {
      throw new Error(`Unhandled action type in useFetch.`);
    }
  }
}

function getInitialState<T>(): State<T> {
  return { data: null, error: '', status: '' };
}

function useFetch<T>(): [
  (url: string, query?: GenericObject, signal?: AbortSignal) => Promise<void>,
  State<T>,
  React.Dispatch<Action<unknown>>
] {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  const loadData = async (
    url: string,
    query?: GenericObject,
    signal?: AbortSignal
  ): Promise<void> => {
    try {
      isMounted.current && dispatch({ type: 'LOADING' });
      const response = await restFactory.get<T>(url, query, signal);
      isMounted.current && dispatch({ data: response, type: 'SUCCESS' });
    } catch (error) {
      isMounted.current &&
        dispatch({ error: error.message || 'Unknown error', type: 'ERROR' });
    }
  };

  return [loadData, state as State<T>, dispatch];
}
/**
 * Hook to be used when you need to make multiple requests at the same time
 * and want to control all request in a single state
 */
function useFetchAll<T>(): [
  (
    requests: {
      url: string;
      query?: GenericObject;
      signal?: AbortSignal;
    }[]
  ) => Promise<void>,
  State<T>,
  React.Dispatch<Action<unknown>>
] {
  const [state, dispatch] = useReducer(reducer, getInitialState());
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);

  const loadData = async (
    requests: {
      url: string;
      query?: GenericObject;
      signal?: AbortSignal;
    }[]
  ): Promise<void> => {
    try {
      isMounted.current && dispatch({ type: 'LOADING' });
      const response = await Promise.all(
        requests.map((req) => restFactory.get(req.url, req.query, req.signal))
      );
      isMounted.current && dispatch({ data: response, type: 'SUCCESS' });
    } catch (error) {
      isMounted.current &&
        dispatch({ error: error.message || 'Unknown error', type: 'ERROR' });
    }
  };

  return [loadData, state as State<T>, dispatch];
}
export { useFetchAll };
export default useFetch;
