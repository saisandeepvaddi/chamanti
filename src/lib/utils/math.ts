export function isPowerOf2(value: number) {
  return (value & (value - 1)) === 0;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
