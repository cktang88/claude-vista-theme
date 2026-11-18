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
  { base: 478, lift: 0, swell: 10, jag: 170, grain: 230, top: '#f8c48c', foot: '#fcdcae' },
  { base: 512, lift: 0, swell: 12, jag: 255, grain: 150, top: '#f5b174', foot: '#fbd3a0' },
  { base: 548, lift: 0, swell: 18, jag: 115, grain: 110, top: '#ef9a5c', foot: '#f8c490' },
  { base: 590, lift: 0, swell: 26, jag: 62, grain: 80, top: '#e57f49', foot: '#f3ae7a' },
  { base: 636, lift: 14, swell: 32, jag: 22, grain: 60, top: '#d4623c', foot: '#ea9866', forest: { spacing: 12, low: 7, high: 17, tiers: 2 } },
  { base: 690, lift: 50, swell: 34, jag: 0, grain: 60, top: '#b74a36', foot: '#d97a52', forest: { spacing: 14, low: 14, high: 34, tiers: 3 } },
  { base: 752, lift: 100, swell: 30, jag: 0, grain: 60, top: '#923635', foot: '#bd5c45', forest: { spacing: 19, low: 26, high: 62, tiers: 5 } },
  { base: 872, lift: 232, swell: 24, jag: 0, grain: 60, top: '#66242d', foot: '#8c3539', forest: { spacing: 26, low: 40, high: 130, tiers: 9 } },
  { base: 996, lift: 366, swell: 12, jag: 0, grain: 60, top: '#30131b', foot: '#3e1922' },
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
function forest(seed: number, index: number, line: Skyline, wood: Forest, thin: number): string {
  const spacing = wood.spacing * thin
  let trees = ''

  for (let tree = 0; tree * spacing < WIDTH + 40; tree += 1) {
    const x = -20 + (tree + chance(seed, tree, 41 + index)) * spacing
    const isClearing = Math.sin(x / 170 + chance(seed, index, 42) * 6) > 0.72

    if (isClearing && chance(seed, tree, 43 + index) < 0.8) {
      continue
    }

    // Trees in the middle of the valley are farther off, so they are smaller. That also keeps the middle light.
    const far = 0.45 + 0.55 * Math.min(1, (Math.abs(x - WIDTH / 2) / (WIDTH / 2)) * 2)
    const height = between(wood.low, wood.high, chance(seed, tree, 44 + index) ** 1.6) * far

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

/** One layer. The bare far ranges get a thin bright edge where the low sun catches them. `thin` spaces the forest out. */
export function ridge(seed: number, index: number, thin = 1): string {
  const shape = RIDGES[index]!
  const line = skyline(seed, index)
  const trees = shape.forest === undefined ? '' : forest(seed, index, line, shape.forest, thin)
  const glow = shape.forest === undefined && index !== NEAREST ? ' stroke="#ffe9bb" stroke-opacity=".6" stroke-width="1.4"' : ''

  return `<path d="M-20 1010L${edge(line, shape.jag > 0 ? 8 : 14)}L${WIDTH + 20} 1010Z${trees}" fill="url(#ridge${index})"${glow}/>`
}

/** A river that winds toward us through the valley and carries the sky's light. Sun glitters on it. */
export function river(seed: number): string {
  let glints = ''

  for (let index = 0; index < 14; index += 1) {
    const along = chance(seed, index, 31)
    const x = between(930, 700, along) + between(-40, 40, chance(seed, index, 32))
    const y = between(776, 900, along)
    const pace = between(1.6, 4.2, chance(seed, index, 34))

    glints += `<path class="glint" style="animation-duration:${pace.toFixed(1)}s;animation-delay:-${(pace * chance(seed, index, 35)).toFixed(1)}s" d="M${Math.round(x)} ${Math.round(y)}h${Math.round(between(5, 18, chance(seed, index, 33)))}"/>`
  }

  return (
    '<path d="M930 756C880 768 990 784 900 802C800 822 700 842 520 930L900 930C960 880 1070 830 1040 798C1026 780 962 772 956 756Z" fill="url(#river)"/>' +
    `<g stroke="#fffaf0" stroke-width="1.5" stroke-linecap="round">${glints}</g>`
  )
}

/** A bank of sunlit fog that fills the valley and drifts slowly sideways. The ridges stand out of it at the sides. */
export function fog(x: number, y: number, width: number, depth: number, pace: number, strength = 1): string {
  return `<ellipse class="mist" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace / 3)}s" cx="${x}" cy="${y}" rx="${width}" ry="${depth}" fill="url(#mist)" fill-opacity="${strength}"/>`
}
