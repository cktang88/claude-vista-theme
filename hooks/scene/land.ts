// The land: eight layers on one warm ramp, from pale far peaks to the dark near slope. Each layer fades to a
// lighter foot, as fog does in a valley, and the nearer ones carry forest on their edge. A river runs in the valley.

import { SUN, WIDTH, between, chance } from './kit'
import { fir } from './fir'

type Forest = { spacing: number; low: number; high: number; tiers: number }

export type Ridge = {
  /** Where the top edge sits in the middle of the picture, and how far it rises toward both sides. */
  base: number
  lift: number
  /** How much the edge rolls, and how much it juts into peaks spaced `grain` apart. */
  swell: number
  jag: number
  grain: number
  top: string
  foot: string
  forest?: Forest
}

export const RIDGES: readonly Ridge[] = [
  { base: 512, lift: 0, swell: 12, jag: 255, grain: 150, top: '#f6b578', foot: '#fbd6a6' },
  { base: 545, lift: 0, swell: 18, jag: 115, grain: 110, top: '#f09d60', foot: '#f9c794' },
  { base: 588, lift: 0, swell: 26, jag: 62, grain: 80, top: '#e6814c', foot: '#f4b17e' },
  { base: 634, lift: 14, swell: 32, jag: 22, grain: 60, top: '#d5633e', foot: '#eb9a69', forest: { spacing: 10, low: 7, high: 17, tiers: 2 } },
  { base: 684, lift: 40, swell: 34, jag: 0, grain: 60, top: '#b74739', foot: '#da7b55', forest: { spacing: 12, low: 14, high: 34, tiers: 3 } },
  { base: 744, lift: 80, swell: 30, jag: 0, grain: 60, top: '#8f303a', foot: '#bd5948', forest: { spacing: 18, low: 26, high: 62, tiers: 5 } },
  { base: 818, lift: 150, swell: 24, jag: 0, grain: 60, top: '#611e35', foot: '#883041', forest: { spacing: 25, low: 40, high: 130, tiers: 10 } },
  { base: 918, lift: 265, swell: 14, jag: 0, grain: 60, top: '#2f1025', foot: '#3c1530' },
]

export const NEAREST = RIDGES.length - 1
const NODE_SHIFT = 100

export type Skyline = (x: number) => number

/** How high a layer's top edge stands at each x (a smaller number is higher up). */
export function skyline(seed: number, index: number): Skyline {
  const ridge = RIDGES[index]!
  const turn = (salt: number) => chance(seed, index, salt) * Math.PI * 2
  const [first, second, third] = [turn(1), turn(2), turn(3)]
  const crag = (spacing: number, salt: number) => (x: number) => {
    const at = x / spacing + NODE_SHIFT
    const node = Math.floor(at)

    return between(chance(seed, index * 97 + node, salt), chance(seed, index * 97 + node + 1, salt), at - node)
  }
  const broad = crag(ridge.grain, 4)
  const fine = crag(ridge.grain / 3.4, 5)

  return x => {
    const side = (x - WIDTH / 2) / (WIDTH / 2)
    const roll = 0.5 * Math.sin(x / 260 + first) + 0.3 * Math.sin(x / 110 + second) + 0.2 * Math.sin(x / 47 + third)
    // The far peaks stand lower near the sun, so it always sits in a gap between them.
    const gap = Math.min(1, 0.2 + Math.abs(x - SUN.x) / 320)

    return ridge.base - ridge.lift * side * side - ridge.swell * roll - ridge.jag * gap * (0.8 * broad(x) ** 1.5 + 0.2 * fine(x))
  }
}

function edge(line: Skyline, step: number): string {
  const points: string[] = []

  for (let x = -20; x <= WIDTH + 20; x += step) {
    points.push(`${Math.round(x)} ${Math.round(line(x))}`)
  }

  return points.join('L')
}

/** The forest on a layer's edge: firs of uneven height, with gaps, in the layer's own color. */
function forest(seed: number, index: number, line: Skyline, wood: Forest): string {
  let trees = ''

  for (let tree = 0; tree * wood.spacing < WIDTH + 40; tree += 1) {
    const x = -20 + (tree + chance(seed, tree, 41 + index)) * wood.spacing
    const isClearing = Math.sin(x / 170 + chance(seed, index, 42) * 6) > 0.72

    if (isClearing && chance(seed, tree, 43 + index) < 0.8) {
      continue
    }

    const height = between(wood.low, wood.high, chance(seed, tree, 44 + index) ** 1.6)

    trees += fir(seed, index * 1000 + tree, x, line(x) + 4, height, wood.tiers, between(0.8, 1.3, chance(seed, tree, 45 + index)))
  }

  return trees
}

export function ridgeFills(): string {
  return RIDGES.map((ridge, index) => {
    const crest = ridge.base - ridge.jag - ridge.swell - ridge.lift

    return `<linearGradient id="ridge${index}" gradientUnits="userSpaceOnUse" x1="0" y1="${crest}" x2="0" y2="${ridge.base + 96}"><stop offset=".35" stop-color="${ridge.top}"/><stop offset="1" stop-color="${ridge.foot}"/></linearGradient>`
  }).join('')
}

export function ridge(seed: number, index: number): string {
  const shape = RIDGES[index]!
  const line = skyline(seed, index)
  const trees = shape.forest === undefined ? '' : forest(seed, index, line, shape.forest)

  return `<path d="M-20 1010L${edge(line, shape.jag > 0 ? 8 : 14)}L${WIDTH + 20} 1010Z${trees}" fill="url(#ridge${index})"/>`
}

/** A river that winds toward us through the valley and carries the sky's light. Sun glitters on it. */
export function river(seed: number): string {
  let glints = ''

  for (let index = 0; index < 14; index += 1) {
    const along = chance(seed, index, 31)
    const x = between(1030, 760, along) + between(-40, 40, chance(seed, index, 32))
    const y = between(768, 842, along)
    const pace = between(1.6, 4.2, chance(seed, index, 34))

    glints += `<path class="glint" style="animation-duration:${pace.toFixed(1)}s;animation-delay:-${(pace * chance(seed, index, 35)).toFixed(1)}s" d="M${Math.round(x)} ${Math.round(y)}h${Math.round(between(5, 18, chance(seed, index, 33)))}"/>`
  }

  return (
    '<path d="M1042 748C1000 760 1100 774 1010 790C900 808 800 816 640 870L930 870C1000 836 1150 812 1128 786C1112 768 1070 762 1066 748Z" fill="url(#river)"/>' +
    `<g stroke="#fffaf0" stroke-width="1.5" stroke-linecap="round">${glints}</g>`
  )
}

/** A soft band of fog that drifts slowly sideways. */
export function mist(x: number, y: number, width: number, pace: number, strength = 1): string {
  return `<ellipse class="mist" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace / 3)}s" cx="${x}" cy="${y}" rx="${width}" ry="${Math.round(width / 15)}" fill="url(#mist)" fill-opacity="${strength}"/>`
}
