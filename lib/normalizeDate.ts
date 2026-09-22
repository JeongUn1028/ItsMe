export function normalizeDate(input: string) {
  if (!input) {
    return new Date().toISOString().slice(0, 10);
  }

  return input.slice(0, 10);
}
