// The near firs: tall and dark, on the ledge at the two bottom corners, with a bare snag or two among them.
// They frame the view and stay out of the middle.

import { WIDTH, between, chance } from './kit'
import { fir } from './fir'
import { ledge } from './land'

/** A dead tree: a bare pole with a few short broken branches. */
function snag(seed: number, id: number, x: number, foot: number, height: number): string {
  const top = foot - height
  let shape = `M${x - 4} ${foot}L${x - 1} ${top}L${x + 1} ${top}L${x + 4} ${foot}Z`

  for (let branch = 0; branch < 5; branch += 1) {
    const y = Math.round(top + height * between(0.12, 0.7, chance(seed, id * 17 + branch, 54)))
    const side = branch % 2 === 0 ? 1 : -1
    const reach = Math.round(side * height * between(0.05, 0.13, chance(seed, id * 17 + branch, 55)))

    shape += `M${x} ${y + 5}L${x + reach} ${y - 8}L${x + reach} ${y - 5}L${x} ${y + 10}Z`
  }

  return shape
}

/** The near firs sway a little, each at its own pace. */
export function pines(seed: number): string {
  const trees: { x: number; height: number; index: number }[] = []

  for (let index = 0; index < 26; index += 1) {
    const x = Math.round(-14 + index * 64 + 46 * chance(seed, index, 61))
    const side = Math.abs(x - WIDTH / 2) / (WIDTH / 2)

    if (side > 0.72) {
      trees.push({ x, height: Math.round((70 + 520 * ((side - 0.72) / 0.28) ** 1.2) * between(0.6, 1.15, chance(seed, index, 62))), index })
    }
  }

  // The shorter trees are drawn first, so the tall ones stand in front.
  return trees
    .sort((one, other) => one.height - other.height)
    .map(({ x, height, index }) => {
      const foot = Math.round(ledge(x)) + 8
      const isSnag = height > 220 && chance(seed, index, 63) < 0.14
      const shape = isSnag
        ? snag(seed, index, x, foot, Math.round(height * 0.7))
        : fir(seed, 9000 + index, x, foot, height, Math.min(32, Math.max(8, Math.round(height / 15))), between(0.85, 1.2, chance(seed, index, 64)))
      const pace = between(6, 10, chance(seed, index, 52)).toFixed(1)

      return `<path class="sway" style="transform-origin:${x}px ${foot}px;animation-duration:${pace}s;animation-delay:-${between(0, 9, chance(seed, index, 53)).toFixed(1)}s" d="${shape}"/>`
    })
    .join('')
}
