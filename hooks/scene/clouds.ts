// The sea of mist: rows of soft low billows, one behind another. Each nearer row is a touch whiter than the one
// behind it and has no shading of its own, so the sea reads as one pale field and not as folds. Each row rolls
// slowly sideways at its own pace.

import { chance } from './kit'

type Row = { level: number; swell: number; grain: number; colour: string; pace: number }

const ROWS: readonly Row[] = [
  { level: 712, swell: 12, grain: 84, colour: '#e9eded', pace: 150 },
  { level: 748, swell: 16, grain: 112, colour: '#ecefef', pace: 126 },
  { level: 792, swell: 22, grain: 148, colour: '#eff2f1', pace: 104 },
  { level: 842, swell: 28, grain: 190, colour: '#f2f4f4', pace: 88 },
  { level: 898, swell: 34, grain: 240, colour: '#f5f7f6', pace: 74 },
  { level: 952, swell: 40, grain: 300, colour: '#f8f9f9', pace: 62 },
]

export const CLOUD_ROWS = ROWS.length

export const CLOUD_STYLE = '.roll{animation:roll ease-in-out infinite alternate}@keyframes roll{from{transform:translateX(-120px)}to{transform:translateX(120px)}}'

/** The rows have soft edges, as mist does. */
export function cloudFills(): string {
  return '<filter id="haze" x="-5%" y="-10%" width="110%" height="120%"><feGaussianBlur stdDeviation="5"/></filter>'
}

/** One row of mist. Its top edge is a chain of low rounded heaps of two sizes. */
export function cloudRow(seed: number, index: number): string {
  const row = ROWS[index]!
  const first = chance(seed, index, 111) * 6
  const second = chance(seed, index, 112) * 6
  const edge: string[] = []

  for (let x = -280; x <= 1880; x += 16) {
    const heap = 0.62 * Math.abs(Math.sin(x / row.grain + first)) ** 0.75 + 0.38 * Math.abs(Math.sin(x / (row.grain * 0.37) + second)) ** 0.8

    edge.push(`${x} ${Math.round(row.level - row.swell * heap)}`)
  }

  return `<path class="roll" style="animation-duration:${row.pace}s;animation-delay:-${Math.round(row.pace * chance(seed, index, 113))}s" d="M-280 ${row.level + 260}L${edge.join('L')}L1880 ${row.level + 260}Z" fill="${row.colour}" filter="url(#haze)"/>`
}
