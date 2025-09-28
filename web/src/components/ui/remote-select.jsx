import React from 'react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useRemoteOptions } from '@/hooks/useRemoteOptions';

/**
 * Generic remote Select component.
 *
 * Props:
 * - fetcher(signal): Promise<Array<any>>  Required.
 * - fallback: Array<any>  Optional fallback array when fetch fails.
 * - value: string  Controlled value
 * - onChange: (value: string) => void
 * - getValue: (item) => string  Defaults to (x) => x.value || x.id
 * - getLabel: (item) => string  Defaults to (x) => x.label || x.title || String(x)
 * - placeholder: string
 * - disabled: boolean
 * - id: string
 */
export default function RemoteSelect({
  fetcher,
  value,
  onChange,
  getValue = (x) => x?.value ?? x?.id ?? x?.code ?? '',
  getLabel = (x) => x?.label ?? x?.title ?? x?.name ?? String(x ?? ''),
  placeholder = 'Select an option',
  disabled = false,
  id,
  enabled = true,
}) {
  const { options, loading, error } = useRemoteOptions({ fetcher, enabled });

  // Ensure options are distinct by the value derived from getValue
  const uniqueOptions = React.useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const opt of options || []) {
      const key = String(getValue(opt) ?? '');
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(opt);
    }
    return out;
  }, [options, getValue]);

  return (
    <div className="space-y-1">
      <Select
        value={value || ''}
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={loading ? 'Loading…' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {uniqueOptions.map((opt) => {
            const v = getValue(opt);
            const label = getLabel(opt);
            return (
              <SelectItem key={v} value={String(v)}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && !loading && options.length === 0 && (
        <div className="text-xs text-destructive">{error}</div>
      )}
    </div>
  );
}
