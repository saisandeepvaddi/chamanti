export function invariant(
  condition: boolean,
  message = 'Error'
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
