// The land: seven ridges from snowy far peaks to the dark near slope, a lake in the valley, and mist between them.

import { WIDTH, between, chance } from './kit'

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
  rim: string
}

export const RIDGES: readonly Ridge[] = [
  { base: 520, lift: 0, swell: 14, jag: 225, grain: 135, top: '#b4cbe0', foot: '#e3edf2', rim: '#f4f8fb' },
  { base: 552, lift: 0, swell: 20, jag: 84, grain: 100, top: '#a2c5d3', foot: '#d6e7e8', rim: '#e6f1f1' },
  { base: 592, lift: 6, swell: 30, jag: 34, grain: 70, top: '#88b9bb', foot: '#c2dcd6', rim: '#d3e8e0' },
  { base: 642, lift: 22, swell: 34, jag: 14, grain: 60, top: '#6ea99c', foot: '#a7ccbe', rim: '#bfe0cf' },
  { base: 706, lift: 54, swell: 34, jag: 0, grain: 60, top: '#52937f', foot: '#86b7a3', rim: '#a8d2bb' },
  { base: 792, lift: 118, swell: 28, jag: 0, grain: 60, top: '#397862', foot: '#5f9a83', rim: '#8cc0a3' },
  { base: 908, lift: 255, swell: 14, jag: 0, grain: 60, top: '#1f4637', foot: '#2a5846', rim: '#5d9477' },
]

export const NEAREST = RIDGES.length - 1
const PEAKS = 0
const NODE_SHIFT = 100

export type Skyline = (x: number) => number

/** How high a ridge's top edge stands at each x (a smaller number is higher up). */
export function skyline(seed: number, index: number): Skyline {
  const ridge = RIDGES[index]!
  const turn = (salt: number) => chance(seed, index, salt) * Math.PI * 2
  const [first, second, third] = [turn(1), turn(2), turn(3)]
  const crag = (spacing: number, salt: number) => (x: number) => {
    const at = x / spacing + NODE_SHIFT
    const node = Math.floor(at)
    const share = at - node

    return between(chance(seed, index * 97 + node, salt), chance(seed, index * 97 + node + 1, salt), share)
  }
  const broad = crag(ridge.grain, 4)
  const fine = crag(ridge.grain / 3.4, 5)

  return x => {
    const side = (x - WIDTH / 2) / (WIDTH / 2)
    const roll = 0.5 * Math.sin(x / 260 + first) + 0.3 * Math.sin(x / 110 + second) + 0.2 * Math.sin(x / 47 + third)

    return ridge.base - ridge.lift * side * side - ridge.swell * roll - ridge.jag * (0.78 * broad(x) + 0.22 * fine(x))
  }
}

function along(line: Skyline, from: number, to: number, step: number): string {
  const points: string[] = []

  for (let x = from; x <= to; x += step) {
    points.push(`${Math.round(x)} ${Math.round(line(x))}`)
  }

  return points.join('L')
}

export function ridgeFills(): string {
  return RIDGES.map((ridge, index) => {
    const crest = ridge.base - ridge.jag - ridge.swell - ridge.lift

    return `<linearGradient id="ridge${index}" gradientUnits="userSpaceOnUse" x1="0" y1="${crest}" x2="0" y2="${ridge.base + 110}"><stop offset="0" stop-color="${ridge.top}"/><stop offset="1" stop-color="${ridge.foot}"/></linearGradient>`
  }).join('')
}

export function ridge(seed: number, index: number): string {
  const shape = RIDGES[index]!
  const edge = along(skyline(seed, index), -20, WIDTH + 20, shape.jag > 0 ? 8 : 14)
  const land = `<path d="M-20 1010L${edge}L${WIDTH + 20} 1010Z" fill="url(#ridge${index})" stroke="${shape.rim}" stroke-width="1.4" stroke-opacity=".7"/>`

  return land + (index <= 1 ? facets(seed, index) : '') + (index === PEAKS ? snow(seed) : '')
}

/** The shaded left face of each far peak, since the sun stands to the right. */
function facets(seed: number, index: number): string {
  const shape = RIDGES[index]!
  const line = skyline(seed, index)
  const height = (node: number) => chance(seed, index * 97 + node, 4)
  let faces = ''

  for (let node = NODE_SHIFT - 1; node <= NODE_SHIFT + WIDTH / shape.grain + 1; node += 1) {
    if (height(node) < height(node - 1) || height(node) < height(node + 1)) {
      continue
    }

    const x = (node - NODE_SHIFT) * shape.grain

    faces += `M${along(line, x - shape.grain * 0.92, x, 8)}L${Math.round(x)} ${Math.round(line(x))}L${Math.round(x - shape.grain * 0.22)} ${shape.base + 50}Z`
  }

  return `<path d="${faces}" fill="${index === PEAKS ? '#7f9cc0' : '#6d9db0'}" fill-opacity=".3"/>`
}

/** Snow on the highest far peaks: bright on the side that faces the sun, blue-grey on the other. */
function snow(seed: number): string {
  const line = skyline(seed, PEAKS)
  const grain = RIDGES[PEAKS]!.grain
  const height = (node: number) => chance(seed, PEAKS * 97 + node, 4)
  let caps = ''

  for (let node = NODE_SHIFT - 1; node <= NODE_SHIFT + WIDTH / grain + 1; node += 1) {
    if (height(node) < 0.4 || height(node) < height(node - 1) || height(node) < height(node + 1)) {
      continue
    }

    const x = (node - NODE_SHIFT) * grain
    const reach = between(34, 62, height(node))
    const floor = Math.max(line(x - reach), line(x + reach))
    const tip = line(x)
    const inside = (dx: number, share: number) => `${Math.round(x + dx)} ${Math.round(between(tip, floor, share))}`

    caps += `<path d="M${along(line, x - reach, x, 6)}L${inside(-reach * 0.1, 0.62)}L${inside(-reach * 0.34, 1.02)}L${inside(-reach * 0.62, 0.8)}Z" fill="#e4edf5"/>`
    caps += `<path d="M${along(line, x, x + reach, 6)}L${inside(reach * 0.72, 1.04)}L${inside(reach * 0.5, 0.74)}L${inside(reach * 0.26, 1.0)}L${inside(-reach * 0.1, 0.62)}Z" fill="#fff"/>`
  }

  return caps
}

/** A lake at the foot of the middle ridges. The next ridge covers its near shore. Sunlight glitters on it. */
export function lake(seed: number): string {
  let glints = ''

  for (let index = 0; index < 16; index += 1) {
    const x = between(940, 1330, chance(seed, index, 31))
    const y = between(752, 790, chance(seed, index, 32))
    const length = between(6, 22, chance(seed, index, 33))
    const pace = between(1.6, 4.2, chance(seed, index, 34))

    glints += `<path class="glint" style="animation-duration:${pace.toFixed(1)}s;animation-delay:-${(pace * chance(seed, index, 35)).toFixed(1)}s" d="M${Math.round(x)} ${Math.round(y)}h${Math.round(length)}"/>`
  }

  return `<ellipse cx="900" cy="780" rx="480" ry="34" fill="url(#lake)"/><g stroke="#fffdf0" stroke-width="1.6" stroke-linecap="round">${glints}</g>`
}

/** A soft band of mist that drifts slowly sideways. */
export function mist(x: number, y: number, width: number, pace: number, strength = 1): string {
  return `<ellipse class="mist" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace / 3)}s" cx="${x}" cy="${y}" rx="${width}" ry="${Math.round(width / 15)}" fill="url(#mist)" fill-opacity="${strength}"/>`
}
