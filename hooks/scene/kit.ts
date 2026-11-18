// Shared by every part of the scene: the picture's size, where the sun stands, and small drawing helpers.

export const WIDTH = 1600
export const HEIGHT = 1000
export const SUN = { x: 1340, y: 418, size: 60 } as const

/** A fixed pseudo-random number from 0 to 1, so a session's seed always draws the same view. */
export function chance(seed: number, index: number, salt = 0): number {
  let value = (Math.imul(index + salt * 7919, 374761393) + Math.imul(seed, 668265263)) | 0
  value = Math.imul(value ^ (value >>> 13), 1274126177)
  value ^= value >>> 16
  return (value >>> 0) / 4294967296
}

export function between(low: number, high: number, share: number): number {
  return low + (high - low) * share
}
