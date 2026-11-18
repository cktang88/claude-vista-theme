// Trees: far stands drawn as one flat shape per ridge, and tall near pines with a sunlit side that sway a little.

import { WIDTH, between, chance } from './kit'
import { NEAREST, skyline } from './land'

type Stand = { ridge: number; spacing: number; low: number; high: number; tiers: number; colour: string }

const STANDS: readonly Stand[] = [
  { ridge: 3, spacing: 15, low: 7, high: 13, tiers: 1, colour: '#5b9a8c' },
  { ridge: 4, spacing: 19, low: 14, high: 26, tiers: 2, colour: '#3f806c' },
  { ridge: 5, spacing: 27, low: 26, high: 52, tiers: 3, colour: '#2a6350' },
]

/** One small pine as stepped tiers: down the left side, across the foot, and back up the right side. */
function sprig(x: number, foot: number, height: number, tiers: number): string {
  const half = height * 0.3
  const left: string[] = []
  const right: string[] = []

  for (let tier = 1; tier <= tiers; tier += 1) {
    const y = Math.round(foot - height + (height * tier) / tiers)
    const reach = (half * tier) / tiers

    left.push(`${Math.round(x - reach)} ${y}`)
    right.unshift(`${Math.round(x + reach)} ${y}`)
    if (tier < tiers) {
      left.push(`${Math.round(x - reach * 0.45)} ${y}`)
      right.unshift(`${Math.round(x + reach * 0.45)} ${y}`)
    }
  }

  return `M${Math.round(x)} ${Math.round(foot - height)}L${left.join('L')}L${right.join('L')}Z`
}

/** The far trees standing along the ridges, thinning out in places like real woods. */
export function stands(seed: number, ridge: number): string {
  const stand = STANDS.find(entry => entry.ridge === ridge)

  if (stand === undefined) {
    return ''
  }

  const line = skyline(seed, ridge)
  let shape = ''

  for (let index = 0; index * stand.spacing < WIDTH + 40; index += 1) {
    const x = -20 + index * stand.spacing + stand.spacing * chance(seed, index, 41 + ridge)
    const isClearing = Math.sin(x / 140 + chance(seed, ridge, 42) * 6) > 0.55

    if (isClearing || chance(seed, index, 43 + ridge) < 0.18) {
      continue
    }

    shape += sprig(x, line(x) + 3, between(stand.low, stand.high, chance(seed, index, 44 + ridge)), stand.tiers)
  }

  return `<path d="${shape}" fill="${stand.colour}"/>`
}

/** The lower edge of one bough: needles hanging in points, a little higher in the middle than at the tips. */
function fringe(x: number, reach: number, droop: number, from: number, to: number): string {
  const teeth = 6
  const step = from < to ? 1 : -1
  let edge = ''

  for (let tooth = from; tooth !== to + step; tooth += step) {
    const across = -1 + (2 * tooth) / teeth
    const lifted = (tooth % 2 === 1 ? reach * 0.15 : 0) + (1 - Math.abs(across)) * reach * 0.12

    edge += `L${Math.round(x + reach * across)} ${Math.round(droop - lifted)}`
  }

  return edge
}

const BARK_GREENS = ['#1c4334', '#214b3a', '#183c2f']

/** A tall near pine: a trunk, drooping boughs, and a lighter right side where the sun catches it. */
function pine(seed: number, index: number, x: number, ground: number, height: number): string {
  const tiers = Math.max(6, Math.round(height / 30))
  const top = ground - height
  const spread = height * 0.2 + 14
  const girth = height * 0.012 + 2
  let dark = ''
  let lit = ''

  for (let tier = 0; tier < tiers; tier += 1) {
    const y = Math.round(top + height * 0.86 * (tier / tiers))
    const reach = spread * (0.14 + 0.86 * ((tier + 1) / tiers)) * between(0.82, 1.14, chance(seed, index * 31 + tier, 51))
    const droop = y + (height / tiers) * 1.55

    dark += `M${x} ${y}${fringe(x, reach, droop, 0, 6)}Z`
    lit += `M${x} ${y}${fringe(x, reach, droop, 6, 3)}Z`
  }

  const pace = between(6, 10, chance(seed, index, 52)).toFixed(1)
  const start = between(0, 9, chance(seed, index, 53)).toFixed(1)

  return (
    `<g class="sway" style="transform-origin:${x}px ${ground}px;animation-duration:${pace}s;animation-delay:-${start}s">` +
    `<path d="M${x - girth} ${ground + 6}L${x - 1} ${top + 8}L${x + 1} ${top + 8}L${x + girth} ${ground + 6}Z" fill="#15281f"/>` +
    `<path d="${dark}" fill="${height < 170 ? '#2a5a49' : BARK_GREENS[index % BARK_GREENS.length]}"/><path d="${lit}" fill="${height < 170 ? '#56977a' : '#3d7a5c'}" fill-opacity=".6"/></g>`
  )
}

/** The near pines. They stand tallest at both sides, so they frame the view and leave the middle open. */
export function pines(seed: number): string {
  const line = skyline(seed, NEAREST)
  const trees: { x: number; ground: number; height: number; index: number }[] = []

  for (let index = 0; index < 24; index += 1) {
    const x = Math.round(-10 + index * 70 + 50 * chance(seed, index, 61))
    const side = Math.abs(x - WIDTH / 2) / (WIDTH / 2)
    const height = (110 + 430 * side * side) * between(0.62, 1.18, chance(seed, index, 62))

    trees.push({ x, ground: Math.round(line(x)), height: Math.round(height), index })
  }

  // The shorter trees are drawn first, so the tall ones stand in front.
  return trees
    .sort((one, other) => one.height - other.height)
    .map(tree => pine(seed, tree.index, tree.x, tree.ground, tree.height))
    .join('')
}

const BLOOMS = ['#f6d776', '#ffffff', '#f2a7b5', '#fbe9a8', '#c9b6f2']

/** Grass tufts and wildflowers scattered down the near slope, larger the closer they are. */
export function meadow(seed: number): string {
  const line = skyline(seed, NEAREST)
  let blades = ''
  let blooms = ''

  for (let index = 0; index < 230; index += 1) {
    const x = Math.round(WIDTH * chance(seed, index, 71))
    const depth = chance(seed, index, 72) ** 1.7
    const y = Math.round(line(x) + 3 + depth * 300)
    const size = 0.7 + depth * 1.6
    const lean = Math.round(between(-5, 5, chance(seed, index, 73)) * size)
    const tall = Math.round(14 * size)

    blades += `M${x} ${y}q${lean} ${-tall / 2} ${lean - 3} ${-tall}M${x} ${y}q1 ${-tall / 2} ${lean + 1} ${-tall - 3}M${x} ${y}q4 ${-tall / 2} ${lean + 6} ${-tall + 2}`
    if (index % 2 === 0) {
      blooms += `<circle cx="${x + lean + 1}" cy="${y - tall - 4}" r="${(between(1.5, 2.6, chance(seed, index, 74)) * size).toFixed(1)}" fill="${BLOOMS[index % BLOOMS.length]}"/>`
    }
  }

  return `<path d="${blades}" fill="none" stroke="#4f8f70" stroke-width="1.3" stroke-linecap="round" stroke-opacity=".8"/>${blooms}`
}
