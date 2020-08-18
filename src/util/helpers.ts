// Type-narrowing predicate for array filtering
export const isDefined = <T>(item: T | undefined): item is T => Boolean(item)
