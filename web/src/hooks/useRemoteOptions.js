import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Reusable hook to load options from an API with a fallback list.
 * @param {Object} cfg
 * @param {Function} cfg.fetcher async function(signal) -> array
 * @param {Array} [cfg.fallback] optional fallback array when fetch fails
 * @param {boolean} [cfg.enabled=true] whether to run; set false to skip
 * @returns {{ options: any[], loading: boolean, error: string|null, reload: Function }}
 */
export function useRemoteOptions({ fetcher, enabled = true }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  if (!enabled || typeof fetcher !== 'function') return;
    const ac = new AbortController();
    let active = true;
    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(() => fetcher(ac.signal))
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setOptions(data);
          setError(null);
        } else {
          setOptions([]);
          setError(null);
        }
      })
      .catch((err) => {
        if (!active) return;
        if (err?.name === 'AbortError' || err?.message === 'canceled') return; // ignore aborts
        setOptions([]);
        setError('Failed to load data.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => { active = false; ac.abort(); };
  }, [enabled, fetcher]);

  const reload = useCallback(() => {
    // trigger by toggling enabled via state in caller, or re-provide fetcher reference.
    // For simplicity we just call effect again by updating state
    setLoading(true);
    setError(null);
    const ac = new AbortController();
    let active = true;
    Promise.resolve()
      .then(() => fetcher(ac.signal))
      .then((data) => {
        if (!active) return;
        setOptions(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        if (err?.name === 'AbortError' || err?.message === 'canceled') return;
        setOptions([]);
        setError('Failed to load data.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; ac.abort(); };
  }, [fetcher]);

  return useMemo(() => ({ options, loading, error, reload }), [options, loading, error, reload]);
}
