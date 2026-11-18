// One conifer as a ragged outline: a thin top, then boughs of uneven length that droop at the tip, drawn down the
// left side and back up the right. Every tree differs, so a row of them reads as real forest.

import { between, chance } from './kit'

export function fir(seed: number, id: number, x: number, foot: number, height: number, tiers: number, fullness = 1): string {
  const top = foot - height
  const step = height / (tiers + 0.7)
  const trunk = Math.max(0.6, height * 0.012)
  const left: string[] = []
  const right: string[] = []

  for (let tier = 1; tier <= tiers; tier += 1) {
    const y = top + step * tier
    const widest = (height * 0.15 * (tier / tiers) ** 0.75 + 1.2) * fullness

    for (const side of [-1, 1] as const) {
      const reach = widest * between(0.55, 1.2, chance(seed, id * 53 + tier, side + 3))
      const tip = `${Math.round(x + side * reach)} ${Math.round(y + step * 0.3)}`
      const notch = `${Math.round(x + side * reach * between(0.25, 0.45, chance(seed, id * 53 + tier, side + 6)))} ${Math.round(y + step * 0.1)}`

      if (side === -1) {
        left.push(tip, notch)
      } else {
        right.unshift(notch, tip)
      }
    }
  }

  return `M${Math.round(x)} ${Math.round(top)}L${left.join('L')}L${Math.round(x - trunk)} ${Math.round(foot)}L${Math.round(x + trunk)} ${Math.round(foot)}L${right.join('L')}Z`
}
