// A few thin trees on the near bank, in the spare manner of Ni Zan: slender trunks, a handful of branches, and
// leaves as short flat dabs. They are the one dark thing in the picture, and they keep to the corner.

import { INK, between, chance } from './kit'
import { bankTop } from './land'

type Tree = { wood: string; twigs: string; leaves: string; foot: { x: number; y: number } }

function thinTree(seed: number, id: number, x: number, foot: number, height: number): Tree {
  const lean = between(-0.26, 0.14, chance(seed, id, 61))
  const sway = chance(seed, id, 62) * 6
  const at = (share: number) => ({
    x: x + lean * height * share ** 1.4 + Math.sin(share * 4 + sway) * height * 0.022,
    y: foot - height * share,
  })
  const left: string[] = []
  const right: string[] = []

  for (let step = 0; step <= 10; step += 1) {
    const point = at(step / 10)
    const half = (height * 0.016 + 1.3) * (1 - 0.78 * (step / 10))

    left.push(`${Math.round(point.x - half)} ${Math.round(point.y)}`)
    right.unshift(`${Math.round(point.x + half)} ${Math.round(point.y)}`)
  }

  let twigs = ''
  let leaves = ''
  // A clump of leaves: short flat dabs packed into a low dome, thicker in the middle.
  const dab = (cx: number, cy: number, spread: number, count: number, salt: number) => {
    for (let leaf = 0; leaf < count; leaf += 1) {
      const reach = spread * Math.sqrt(chance(seed, id * 97 + salt * 13 + leaf, 63))
      const turn = chance(seed, id * 97 + salt * 13 + leaf, 64) * Math.PI * 2
      const length = Math.round(between(4, 8, chance(seed, id * 97 + salt * 13 + leaf, 65)))

      leaves += `M${Math.round(cx + reach * Math.cos(turn) - length / 2)} ${Math.round(cy - Math.abs(reach * Math.sin(turn)) * 0.55)}h${length}`
    }
  }
  const branches = 4 + Math.floor(3 * chance(seed, id, 66))

  for (let branch = 0; branch < branches; branch += 1) {
    const share = between(0.5, 0.97, (branch + chance(seed, id * 7 + branch, 67)) / branches)
    const from = at(share)
    const side = branch % 2 === 0 ? 1 : -1
    const length = height * between(0.12, 0.24, chance(seed, id * 7 + branch, 68)) * (1.15 - share * 0.5)
    const rise = between(0.4, 0.9, chance(seed, id * 7 + branch, 69))
    const end = { x: from.x + side * length * Math.cos(rise), y: from.y - length * Math.sin(rise) }

    twigs += `M${Math.round(from.x)} ${Math.round(from.y)}Q${Math.round(from.x + side * length * 0.5)} ${Math.round(from.y - length * 0.1)} ${Math.round(end.x)} ${Math.round(end.y)}`
    dab(end.x, end.y, length * 0.62, 12 + Math.floor(7 * chance(seed, id * 7 + branch, 70)), branch)
  }

  const crown = at(1)

  dab(crown.x, crown.y, height * 0.1, 16, 9)

  return { wood: `M${left.join('L')}L${right.join('L')}Z`, twigs, leaves, foot: { x, y: foot } }
}

/** The trees on the near bank. They sway a very little, each at its own slow pace. */
export function nearTrees(seed: number): string {
  let all = ''

  for (let index = 0; index < 5; index += 1) {
    const x = Math.round(1372 + index * 50 + between(-14, 14, chance(seed, index, 71)))
    const tree = thinTree(seed, index, x, Math.round(bankTop(x)) + 6, Math.round(between(210, 390, chance(seed, index, 72))))
    const pace = between(9, 14, chance(seed, index, 52)).toFixed(1)

    all +=
      `<g class="sway" style="transform-origin:${tree.foot.x}px ${tree.foot.y}px;animation-duration:${pace}s;animation-delay:-${between(0, 9, chance(seed, index, 53)).toFixed(1)}s">` +
      `<path d="${tree.wood}" fill="${INK}"/>` +
      `<path d="${tree.twigs}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="${tree.leaves}" fill="none" stroke="${INK}" stroke-opacity=".8" stroke-width="3.2" stroke-linecap="round"/></g>`
  }

  return all
}

/** Reeds on the small far-left bank. */
export function reeds(seed: number): string {
  let blades = ''

  for (let index = 0; index < 26; index += 1) {
    const x = Math.round(between(0, 250, chance(seed, index, 73)))
    const y = Math.round(950 + x * 0.17)
    const tall = Math.round(between(26, 70, chance(seed, index, 74)))
    const lean = Math.round(between(-4, 16, chance(seed, index, 75)))

    blades += `M${x} ${y}q${Math.round(lean / 3)} ${-Math.round(tall / 2)} ${lean} ${-tall}`
  }

  return `<path d="${blades}" fill="none" stroke="${INK}" stroke-opacity=".7" stroke-width="1.4" stroke-linecap="round"/>`
}
