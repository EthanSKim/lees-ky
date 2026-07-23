import { useEffect, useState } from 'react';

/**
 * Fetches once on mount. Returns { data, status, error } where status is
 * 'loading' | 'success' | 'error'. Kept deliberately simple - no caching or
 * refetching, since this is public menu/hours data that changes rarely and
 * each page load is already a fresh fetch.
 */
export function useFetchOnMount(fetchFn) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    setStatus('loading');
    fetchFn()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setStatus('success');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, status, error };
}
