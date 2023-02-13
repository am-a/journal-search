// function to map over a Map's keys and values and return a new Map with the same keys
export const mapMap = <K, V, R>(m: Map<K, V>, mapFn: (value: V, key: K) => R): Map<K, R> =>
    new Map<K, R>(Array.from(m.entries()).map(([key, value]) => [key, mapFn(value, key)]));
