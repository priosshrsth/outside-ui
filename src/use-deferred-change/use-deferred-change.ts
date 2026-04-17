import { useCallback, useEffect, useRef, useState } from "react";

export type UseDeferredChangeOptions<T> = {
  /** The committed/external value. Updates to this reset the local view. */
  value: T;
  /** Called with the new value `delayMs` after the last internal change. */
  onChange: (next: T) => void;
  /** Debounce window in ms. Defaults to 300. */
  delayMs?: number;
};

/**
 * Gives instant UI feedback while debouncing an external onChange. Returns
 * `[currentValue, deferredOnChange]`:
 *   - `currentValue` updates synchronously on every call to
 *     `deferredOnChange`, so the UI stays snappy.
 *   - `onChange` only fires `delayMs` after the last call, letting you
 *     coalesce rapid user input (filter toggles, slider dragging, etc.).
 *
 * If `value` changes from outside (new server state, another control),
 * the internal view syncs to it and pending deferred calls are cancelled.
 */
export function useDeferredChange<T>({
  value,
  onChange,
  delayMs = 300,
}: UseDeferredChangeOptions<T>): readonly [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Keep the local view in sync with external updates.
  useEffect(() => {
    setInternal(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const deferredOnChange = useCallback(
    (next: T) => {
      setInternal(next);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        onChangeRef.current(next);
      }, delayMs);
    },
    [delayMs],
  );

  return [internal, deferredOnChange] as const;
}
