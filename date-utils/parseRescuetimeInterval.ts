export function parseRescuetimeInterval(
  stringValue: string | undefined,
): number {
  if (!stringValue) {
    throw new Error(`value must be a string`);
  }

  const value = stringValue.toLowerCase();

  if (value === 'no time') {
    return 0;
  }

  const seconds = value.split(' ').reduce((s, t) => {
    if (/^\d+h$/.test(t)) {
      return s + Number.parseInt(t.slice(0, -1)) * 60 * 60;
    } else if (/^\d+m$/.test(t)) {
      return s + Number.parseInt(t.slice(0, -1)) * 60;
    } else if (/^\d+s$/.test(t)) {
      return s + Number.parseInt(t.slice(0, -1));
    } else {
      throw new Error(`Unknown format: ${t}`);
    }
  }, 0);

  return Math.round(seconds);
}
