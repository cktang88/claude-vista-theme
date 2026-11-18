// Shared by every part of the scene: the picture's size, where the sun stands, the ink color, and small helpers.
// The picture follows the "one river, two banks" layout of the calmest old Chinese landscapes: low far hills,
// a wide empty water, and a near bank with a few thin trees in one corner. The app lays the chat over the empty
// middle, so the words sit on calm.

export const WIDTH = 1600
export const HEIGHT = 1000
export const SUN = { x: 1330, y: 236, size: 30 } as const
/** Where the far shore meets the water. */
export const WATER = 668
export const INK = '#2f3a40'
export const PAPER = '#eef0ef'

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
