// The land: peaks that stand out of a sea of clouds like islands. The far ones are pale and small; the near ones
// are tall, warm on the side that faces the sun and deep red in shade, with firs on their ledges. Every peak
// fades into cloud at its foot. The tall peaks keep to the sides of the picture.

import { SUN, WIDTH, between, chance } from './kit'
import { fir } from './fir'

type Peak = { x: number; reach: number; rise: number }

type Range = {
  /** Where the range meets the cloud. */
  floor: number
  /** How the sides fall: above 1 a pointed cone, below 1 a tower with steep walls. */
  steep: number
  rock: string
  /** The hazier color the rock takes on near the cloud. */
  foot: string
  /** The color of the faces turned to the sun, on the near ranges. */
  lit?: string
  /** Firs on the ledges: how far apart, and how tall. */
  firs?: { spacing: number; low: number; high: number }
  peaks: readonly Peak[]
}

export const RANGES: readonly Range[] = [
  {
    floor: 704,
    steep: 1.3,
    rock: '#f5cda2',
    foot: '#fadfbe',
    peaks: [{ x: 330, reach: 250, rise: 250 }, { x: 590, reach: 150, rise: 100 }, { x: 870, reach: 170, rise: 60 }, { x: 1150, reach: 210, rise: 130 }, { x: 1590, reach: 260, rise: 330 }],
  },
  {
    floor: 736,
    steep: 1.15,
    rock: '#edae7b',
    foot: '#f6cda2',
    peaks: [{ x: 190, reach: 210, rise: 340 }, { x: 470, reach: 130, rise: 160 }, { x: 1040, reach: 120, rise: 52 }, { x: 1300, reach: 150, rise: 190 }],
  },
  {
    floor: 778,
    steep: 0.95,
    rock: '#c96a45',
    foot: '#eeab7c',
    lit: '#eb9a63',
    firs: { spacing: 16, low: 6, high: 13 },
    peaks: [{ x: 70, reach: 200, rise: 430 }, { x: 640, reach: 100, rise: 44 }, { x: 1560, reach: 210, rise: 500 }],
  },
  {
    floor: 826,
    steep: 0.8,
    rock: '#8d3436',
    foot: '#dd8d68',
    lit: '#d6683f',
    firs: { spacing: 13, low: 9, high: 24 },
    peaks: [{ x: -20, reach: 190, rise: 540 }, { x: 320, reach: 96, rise: 150 }, { x: 1266, reach: 84, rise: 210 }, { x: 1466, reach: 196, rise: 580 }],
  },
]

export type Skyline = (x: number) => number

/** How high a range stands at each x (a smaller number is higher up). Between peaks it sinks under the cloud. */
export function skyline(seed: number, index: number): Skyline {
  const range = RANGES[index]!
  const crag = (spacing: number, salt: number) => (x: number) => {
    const at = x / spacing + 100
    const node = Math.floor(at)

    return between(chance(seed, index * 97 + node, salt), chance(seed, index * 97 + node + 1, salt), at - node)
  }
  const broad = crag(70, 4)
  const middle = crag(24, 5)
  const fine = crag(9, 9)
  // A ridged value: highest halfway between two points, so it makes side summits with notches between them.
  const ridged = (value: number) => 1 - Math.abs(2 * value - 1)
  const peaks = range.peaks.map((peak, order) => {
    const lean = chance(seed, index * 11 + order, 10)

    return {
      x: peak.x + between(-22, 22, chance(seed, index * 11 + order, 6)),
      left: peak.reach * between(0.75, 1.25, lean),
      right: peak.reach * between(1.25, 0.75, lean),
      rise: peak.rise * between(0.9, 1.12, chance(seed, index * 11 + order, 7)),
    }
  })

  return x => {
    let height = -60

    for (const peak of peaks) {
      const off = Math.abs(x - peak.x) / (x < peak.x ? peak.left : peak.right)

      if (off < 1) {
        const body = peak.rise * (1 - off) ** range.steep * (0.62 + 0.42 * ridged(broad(x)))
        const teeth = peak.rise * 0.07 * ridged(middle(x)) + 5 * fine(x)

        height = Math.max(height, body + teeth * Math.min(1, off * 5) * (1 - off))
      }
    }

    return range.floor - height
  }
}

/** Where each peak of a range tops out, after the seed has moved it a little. */
function summits(seed: number, index: number): { x: number; reach: number }[] {
  return RANGES[index]!.peaks.map((peak, order) => ({ x: peak.x + between(-22, 22, chance(seed, index * 11 + order, 6)), reach: peak.reach }))
}

export function rangeFills(): string {
  return RANGES.map((range, index) => {
    const crest = range.floor - Math.max(...range.peaks.map(peak => peak.rise)) * 1.1
    const fade = (id: string, colour: string, end: string) =>
      `<linearGradient id="${id}${index}" gradientUnits="userSpaceOnUse" x1="0" y1="${Math.round(crest)}" x2="0" y2="${range.floor + 30}"><stop offset=".4" stop-color="${colour}"/><stop offset="1" ${end}/></linearGradient>`

    return (
      fade('rock', range.rock, `stop-color="${range.foot}"`) +
      (range.lit === undefined ? '' : fade('lit', range.lit, `stop-color="${range.lit}" stop-opacity="0"`))
    )
  }).join('')
}

/** The faces turned to the sun: from each summit, the side toward the sun, down to a ragged line inside the rock. */
function sunlit(seed: number, index: number, line: Skyline): string {
  const floor = RANGES[index]!.floor
  let faces = ''

  summits(seed, index).forEach((summit, order) => {
    const toward = SUN.x > summit.x ? 1 : -1
    const top = line(summit.x)
    const points: string[] = []

    for (let step = 0; step <= summit.reach; step += 7) {
      const x = summit.x + toward * (summit.reach - step)

      points.push(`${Math.round(x)} ${Math.round(line(x))}`)
    }
    // Back down from the summit along an inner ridge that wanders a little.
    for (let step = 1; step <= 6; step += 1) {
      const share = step / 6
      const wander = between(-0.1, 0.16, chance(seed, index * 31 + order * 7 + step, 8)) * summit.reach

      points.push(`${Math.round(summit.x + toward * (share * summit.reach * 0.22) + wander * share)} ${Math.round(between(top, floor + 30, share))}`)
    }
    faces += `M${points.join('L')}Z`
  })

  return `<path d="${faces}" fill="url(#lit${index})"/>`
}

/** Thin cracks that run down the rock from the skyline, so the faces read as stone and not as flat paper. */
function cracks(seed: number, index: number, line: Skyline): string {
  const floor = RANGES[index]!.floor
  let lines = ''

  summits(seed, index).forEach((summit, order) => {
    for (let crack = 0; crack < 9; crack += 1) {
      const x = summit.x + between(-0.7, 0.7, chance(seed, index * 41 + order * 13 + crack, 12)) * summit.reach
      const top = line(x)
      const length = between(0.12, 0.34, chance(seed, index * 41 + order * 13 + crack, 13)) * (floor - top)

      if (floor - top < 90) {
        continue
      }

      const lean = Math.round(between(-0.22, 0.22, chance(seed, index * 41 + order * 13 + crack, 14)) * length)

      lines += `M${Math.round(x)} ${Math.round(top + 6)}l${Math.round(lean / 2)} ${Math.round(length * 0.45)}l${lean} ${Math.round(length * 0.55)}`
    }
  })

  return `<path d="${lines}" fill="none" stroke="#5e1f2b" stroke-opacity=".3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`
}

/** Firs on the ledges, small against the rock, which is what shows how big the peaks are. */
function ledgeFirs(seed: number, index: number, line: Skyline, wood: { spacing: number; low: number; high: number }): string {
  const floor = RANGES[index]!.floor
  let trees = ''

  for (let tree = 0; tree * wood.spacing < WIDTH + 40; tree += 1) {
    const x = -20 + (tree + chance(seed, tree, 41 + index)) * wood.spacing
    const foot = line(x)

    if (foot > floor - 26 || chance(seed, tree, 43 + index) < 0.42) {
      continue
    }
    trees += fir(seed, index * 1000 + tree, x, foot + 3, between(wood.low, wood.high, chance(seed, tree, 44 + index) ** 1.5), 3, 1.1)
  }

  return trees
}

/** One range of peaks, with its sunlit faces and its firs. */
export function range(seed: number, index: number): string {
  const shape = RANGES[index]!
  const line = skyline(seed, index)
  const edge: string[] = []

  for (let x = -40; x <= WIDTH + 40; x += 6) {
    edge.push(`${x} ${Math.round(line(x))}`)
  }

  return (
    `<path d="M-40 ${shape.floor + 70}L${edge.join('L')}L${WIDTH + 40} ${shape.floor + 70}Z" fill="url(#rock${index})"/>` +
    (shape.lit === undefined ? '' : sunlit(seed, index, line) + cracks(seed, index, line)) +
    (shape.firs === undefined ? '' : `<path d="${ledgeFirs(seed, index, line, shape.firs)}" fill="#4a1a26"/>`)
  )
}

/** A soft ribbon of mist that lies across the waist of a peak and drifts a little. */
export function wisp(x: number, y: number, half: number, thick: number, pace: number): string {
  return `<ellipse class="roll" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace / 3)}s" cx="${x}" cy="${y}" rx="${half}" ry="${thick}" fill="url(#mist)"/>`
}

/** The dark ledge we stand on. It rises only at the two bottom corners and stays out of the middle. */
export function ledge(x: number): number {
  const side = Math.abs(x - WIDTH / 2) / (WIDTH / 2)

  return 1064 - 400 * side ** 3.2 - 8 * Math.sin(x / 37)
}

export function ledgeShape(): string {
  const edge: string[] = []

  for (let x = -20; x <= WIDTH + 20; x += 20) {
    edge.push(`${x} ${Math.round(ledge(x))}`)
  }

  return `<path d="M-20 1010L${edge.join('L')}L${WIDTH + 20} 1010Z" fill="#30131b"/>`
}
