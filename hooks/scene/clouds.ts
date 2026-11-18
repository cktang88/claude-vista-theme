// The sea of clouds: rows of soft billows, one behind another. The far rows are small and a little gray, the near
// ones big and white. Each row rolls slowly sideways at its own pace, so the sea is never still.

import { chance } from './kit'

type Row = { level: number; swell: number; grain: number; top: string; under: string; pace: number }

const ROWS: readonly Row[] = [
  { level: 712, swell: 12, grain: 84, top: '#e9edee', under: '#d3dadc', pace: 150 },
  { level: 748, swell: 16, grain: 112, top: '#edf0f0', under: '#d5dcde', pace: 126 },
  { level: 792, swell: 22, grain: 148, top: '#f0f3f2', under: '#d6dddf', pace: 104 },
  { level: 842, swell: 28, grain: 190, top: '#f4f6f5', under: '#d9dfe1', pace: 88 },
  { level: 898, swell: 34, grain: 240, top: '#f8f9f8', under: '#dde3e4', pace: 74 },
  { level: 952, swell: 40, grain: 300, top: '#fbfcfb', under: '#e2e7e8', pace: 62 },
]

export const CLOUD_ROWS = ROWS.length

export const CLOUD_STYLE = '.roll{animation:roll ease-in-out infinite alternate}@keyframes roll{from{transform:translateX(-120px)}to{transform:translateX(120px)}}'

export function cloudFills(): string {
  return ROWS.map(
    (row, index) =>
      `<linearGradient id="row${index}" gradientUnits="userSpaceOnUse" x1="0" y1="${row.level - row.swell}" x2="0" y2="${row.level + 120}"><stop offset="0" stop-color="${row.top}"/><stop offset="1" stop-color="${row.under}"/></linearGradient>`,
  ).join('')
}

/** One row of billows. Its top edge is a chain of rounded heaps of two sizes. */
export function cloudRow(seed: number, index: number): string {
  const row = ROWS[index]!
  const first = chance(seed, index, 111) * 6
  const second = chance(seed, index, 112) * 6
  const edge: string[] = []

  for (let x = -280; x <= 1880; x += 12) {
    const heap = 0.62 * Math.abs(Math.sin(x / row.grain + first)) ** 0.75 + 0.38 * Math.abs(Math.sin(x / (row.grain * 0.37) + second)) ** 0.8

    edge.push(`${x} ${Math.round(row.level - row.swell * heap)}`)
  }

  return `<path class="roll" style="animation-duration:${row.pace}s;animation-delay:-${Math.round(row.pace * chance(seed, index, 113))}s" d="M-280 ${row.level + 240}L${edge.join('L')}L1880 ${row.level + 240}Z" fill="url(#row${index})" stroke="#ffffff" stroke-opacity=".8" stroke-width="1.4"/>`
}
