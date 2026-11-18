// One conifer as a ragged outline: a thin top, then boughs of uneven length that droop at the tip, drawn down the
// left side and back up the right. Every tree differs, so a row of them reads as real forest.

import { between, chance } from './kit'

type Bough = { tip: string; notch: string }

export function fir(seed: number, id: number, x: number, foot: number, height: number, tiers: number, fullness = 1): string {
  const top = foot - height
  const step = height / (tiers + 0.7)
  const trunk = Math.max(0.6, height * 0.012)
  const point = (px: number, py: number) => `${Math.round(px)} ${Math.round(py)}`
  const boughs = { left: [] as Bough[], right: [] as Bough[] }

  for (let tier = 1; tier <= tiers; tier += 1) {
    const y = top + step * tier
    const widest = (height * 0.15 * (tier / tiers) ** 0.75 + 1.2) * fullness

    for (const side of [-1, 1] as const) {
      const reach = widest * between(0.55, 1.2, chance(seed, id * 53 + tier, side + 3))
      const inner = reach * between(0.25, 0.45, chance(seed, id * 53 + tier, side + 6))

      boughs[side === -1 ? 'left' : 'right'].push({
        tip: point(x + side * reach, y + step * 0.3),
        notch: point(x + side * inner, y + step * 0.1),
      })
    }
  }

  const peak = point(x, top)
  let shape = `M${peak}`

  for (const bough of boughs.left) {
    shape += `L${bough.tip}L${bough.notch}`
  }
  shape += `L${point(x - trunk, foot)}L${point(x + trunk, foot)}`
  for (let tier = tiers - 1; tier >= 0; tier -= 1) {
    const bough = boughs.right[tier]!

    shape += `L${bough.notch}L${bough.tip}`
  }

  return `${shape}Z`
}
