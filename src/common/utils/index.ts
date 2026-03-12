export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isEmpty(value: unknown): boolean {
  if (isNullOrUndefined(value)) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

export function parseBoolean(value: string | boolean): boolean {
  if (typeof value === 'boolean') return value;
  return value === 'true' || value === '1';
}
