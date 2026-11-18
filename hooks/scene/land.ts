// The far shore: four rows of soft rounded hills in thinner and thinner ink, as mist takes them. They stand low
// across the middle and taller at both sides. Each row fades to nothing at its foot. The still water below
// holds a faint mirror of them.

import { INK, WATER, WIDTH, chance } from './kit'

type Row = { base: number; tall: number; ink: number; soft: number }

const ROWS: readonly Row[] = [
  { base: 474, tall: 150, ink: 0.14, soft: 3 },
  { base: 526, tall: 190, ink: 0.22, soft: 2.2 },
  { base: 584, tall: 235, ink: 0.33, soft: 1.4 },
  { base: 646, tall: 270, ink: 0.48, soft: 0.7 },
]

export const HILL_ROWS = ROWS.length

/** How high a row of hills stands at each x (a smaller number is higher up). */
function skyline(seed: number, index: number): (x: number) => number {
  const row = ROWS[index]!
  const turn = (salt: number) => chance(seed, index, salt) * Math.PI * 2
  const [first, second, third] = [turn(1), turn(2), turn(3)]

  return x => {
    const side = Math.abs(x - WIDTH / 2) / (WIDTH / 2)
    const lift = 0.24 + 0.76 * side ** 1.6
    // Round tops with soft dips between them, as in the old "cloudy mountains".
    const humps = 0.52 * Math.abs(Math.sin(x / 230 + first)) + 0.3 * Math.abs(Math.sin(x / 97 + second)) + 0.18 * (0.5 + 0.5 * Math.sin(x / 41 + third))

    return row.base - row.tall * lift * (0.2 + 0.8 * humps)
  }
}

export function hillFills(): string {
  return ROWS.map((row, index) => {
    const fade = (id: string, from: number, to: number, strength: number) =>
      `<linearGradient id="${id}${index}" gradientUnits="userSpaceOnUse" x1="0" y1="${from}" x2="0" y2="${to}"><stop offset="0" stop-color="${INK}" stop-opacity="${strength.toFixed(2)}"/><stop offset=".55" stop-color="${INK}" stop-opacity="${(strength * 0.55).toFixed(2)}"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></linearGradient>`

    return (
      fade('hill', row.base - row.tall, row.base + 26, row.ink) +
      fade('mirror', WATER, WATER + row.tall * 0.5, row.ink * 0.2) +
      `<filter id="soft${index}" x="-5%" y="-20%" width="110%" height="140%"><feGaussianBlur stdDeviation="${row.soft}"/></filter>`
    )
  }).join('')
}

/** One row of hills and, for the nearer rows, its mirror in the water. */
export function hills(seed: number, index: number): string {
  const row = ROWS[index]!
  const line = skyline(seed, index)
  const top: string[] = []
  const mirrored: string[] = []

  for (let x = -40; x <= WIDTH + 40; x += 10) {
    const y = line(x)

    top.push(`${x} ${Math.round(y)}`)
    mirrored.push(`${x} ${Math.round(WATER + (row.base - y) * 0.46)}`)
  }

  const land = `<path d="M-40 ${row.base + 40}L${top.join('L')}L${WIDTH + 40} ${row.base + 40}Z" fill="url(#hill${index})" filter="url(#soft${index})"/>`

  return index < 2 ? land : `${land}<path d="M-40 ${WATER}L${mirrored.join('L')}L${WIDTH + 40} ${WATER}Z" fill="url(#mirror${index})" filter="url(#soft${index})"/>`
}

/** The near bank: a low dark shore in the bottom right corner, and a smaller one far left. */
export function bankTop(x: number): number {
  return 1000 - 132 * Math.max(0, (x - 1150) / 450) ** 0.8
}

export function banks(): string {
  const edge: string[] = []

  for (let x = 1150; x <= WIDTH + 30; x += 30) {
    edge.push(`${x} ${Math.round(bankTop(x) + 4 * Math.sin(x / 23))}`)
  }

  return (
    `<path d="M1150 1010L${edge.join('L')}L${WIDTH + 30} 1010Z" fill="${INK}" fill-opacity=".86"/>` +
    `<path d="M-20 1010L-20 946C70 950 190 972 320 1010Z" fill="${INK}" fill-opacity=".8"/>`
  )
}
