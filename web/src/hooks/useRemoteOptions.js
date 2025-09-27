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
    let active = true;
    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(() => fetcher())
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
      .catch(() => {
        if (!active) return;
        setOptions([]);
        setError('Failed to load data.');
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => { active = false; };
  }, [enabled, fetcher]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    let active = true;
    Promise.resolve()
      .then(() => fetcher())
      .then((data) => {
        if (!active) return;
        setOptions(Array.isArray(data) ? data : []);
        setError(null);
      })
      .catch(() => {
        if (!active) return;
        setOptions([]);
        setError('Failed to load data.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [fetcher]);

  return useMemo(() => ({ options, loading, error, reload }), [options, loading, error, reload]);
}
