// Shared by every part of the scene: the picture's size, where the sun stands, and small drawing helpers.
// The sun stands low at the right, half behind the tall firs, so it never glares through the chat in the middle.
// The middle holds only calm sky and pale valley fog.

export const WIDTH = 1600
export const HEIGHT = 1000
/** The middle of the valley, where the fog lies. The app lays the chat over this part. */
export const VALLEY = 880
export const SUN = { x: 1446, y: 436, size: 44 } as const

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
