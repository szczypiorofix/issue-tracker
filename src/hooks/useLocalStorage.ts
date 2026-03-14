import { useState, useEffect } from 'react';
import { z, ZodSafeParseResult } from 'zod';

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    schema: z.ZodType<T>,
): [T, (value: T | ((val: T) => T)) => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            if (!item) return initialValue;

            const parsed = JSON.parse(item) as z.core.ParseContext<z.core.$ZodIssue>;

            const result: ZodSafeParseResult<T> = schema.safeParse(parsed);

            if (result.success) {
                return result.data;
            } else {
                console.warn(`Object structure error of "${key}". Return initialValue.`, result.error);
                return initialValue;
            }
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}
