export function invariant(
  condition: boolean,
  message = 'Error'
): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function warn(condition: boolean, message = 'Warning') {
  if (!condition) {
    console.warn(message);
  }
}

export function error(condition: boolean, message = 'Error') {
  if (!condition) {
    console.error(message);
  }
}
