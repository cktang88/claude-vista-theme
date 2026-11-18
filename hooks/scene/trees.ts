// The near trees: tall dark firs that stand highest at both sides and frame the view, a few bare snags among
// them, and grass along the edge of the near slope.

import { WIDTH, between, chance } from './kit'
import { fir } from './fir'
import { NEAREST, RIDGES, skyline } from './land'

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
  const line = skyline(seed, NEAREST)
  const trees: { x: number; height: number; index: number }[] = []

  for (let index = 0; index < 23; index += 1) {
    const x = Math.round(-14 + index * 72 + 54 * chance(seed, index, 61))
    const side = Math.abs(x - WIDTH / 2) / (WIDTH / 2)

    trees.push({ x, height: Math.round((120 + 500 * side ** 2.2) * between(0.6, 1.15, chance(seed, index, 62))), index })
  }

  // The shorter trees are drawn first, so the tall ones stand in front.
  return trees
    .sort((one, other) => one.height - other.height)
    .map(({ x, height, index }) => {
      const foot = Math.round(line(x)) + 8
      const isSnag = height > 200 && chance(seed, index, 63) < 0.14
      const shape = isSnag
        ? snag(seed, index, x, foot, Math.round(height * 0.7))
        : fir(seed, 9000 + index, x, foot, height, Math.min(34, Math.max(10, Math.round(height / 14))), between(0.85, 1.2, chance(seed, index, 64)))
      const pace = between(6, 10, chance(seed, index, 52)).toFixed(1)

      return `<path class="sway" style="transform-origin:${x}px ${foot}px;animation-duration:${pace}s;animation-delay:-${between(0, 9, chance(seed, index, 53)).toFixed(1)}s" d="${shape}"/>`
    })
    .join('')
}

/** Grass blades along the top of the near slope, dark against the lighter layer behind. */
export function grass(seed: number): string {
  const line = skyline(seed, NEAREST)
  let blades = ''

  for (let index = 0; index < 150; index += 1) {
    const x = Math.round(WIDTH * chance(seed, index, 71))
    const y = Math.round(line(x) + 6)
    const lean = Math.round(between(-7, 7, chance(seed, index, 73)))
    const tall = Math.round(between(9, 24, chance(seed, index, 72)))

    blades += `M${x} ${y}q${lean} ${-tall / 2} ${lean} ${-tall}M${x + 3} ${y}q1 ${-tall / 2} ${-lean / 2} ${-tall + 4}`
  }

  return `<path d="${blades}" fill="none" stroke="${RIDGES[NEAREST]!.top}" stroke-width="1.6" stroke-linecap="round"/>`
}
