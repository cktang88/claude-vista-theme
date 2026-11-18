// Shared by every part of the scene: the picture's size, where the sun stands, and small drawing helpers.
// The picture is built on the "one-corner" rule of old landscape painting: the subject keeps to the sides and
// the middle is left as empty sky and cloud. The app lays the chat over the middle, so the words sit on calm.

export const WIDTH = 1600
export const HEIGHT = 1000
export const SUN = { x: 1338, y: 505, size: 40 } as const

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
