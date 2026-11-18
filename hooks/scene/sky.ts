// The paper, a pale sun, and the mist: soft bands that lie along the feet of the hills and across the water and
// drift very slowly. Most of the picture is left empty on purpose.

import { INK, PAPER, SUN, WATER, WIDTH, between, chance } from './kit'

export const SKY_STYLE =
  '.roll{animation:roll ease-in-out infinite alternate}' +
  '@keyframes roll{from{transform:translateX(-90px)}to{transform:translateX(90px)}}' +
  '.breathe{animation:breathe ease-in-out infinite alternate}' +
  '@keyframes breathe{from{opacity:.25}to{opacity:1}}'

export function skyFills(): string {
  return (
    `<linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6eaeb"/><stop offset=".5" stop-color="${PAPER}"/><stop offset="1" stop-color="#e9eced"/></linearGradient>` +
    `<radialGradient id="mist"><stop offset="0" stop-color="${PAPER}" stop-opacity=".96"/><stop offset=".6" stop-color="${PAPER}" stop-opacity=".7"/><stop offset="1" stop-color="${PAPER}" stop-opacity="0"/></radialGradient>` +
    '<radialGradient id="sun"><stop offset="0" stop-color="#d9c2b7"/><stop offset=".82" stop-color="#d9c2b7" stop-opacity=".92"/><stop offset="1" stop-color="#d9c2b7" stop-opacity="0"/></radialGradient>'
  )
}

export function paper(): string {
  return `<rect x="-20" y="-20" width="${WIDTH + 40}" height="1040" fill="url(#paper)"/><circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.size}" fill="url(#sun)"/>`
}

/** One soft band of mist. */
export function mist(x: number, y: number, half: number, thick: number, pace: number): string {
  return `<ellipse class="roll" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace / 3)}s" cx="${x}" cy="${y}" rx="${half}" ry="${thick}" fill="url(#mist)"/>`
}

/** A few faint lines on the water that come and go, the only sign that it is water. */
export function ripples(seed: number): string {
  let lines = ''

  for (let index = 0; index < 12; index += 1) {
    const x = Math.round(between(120, 1300, chance(seed, index, 31)))
    const y = Math.round(between(WATER + 40, 960, chance(seed, index, 32)))
    const pace = between(9, 18, chance(seed, index, 34))

    lines += `<path class="breathe" style="animation-duration:${pace.toFixed(1)}s;animation-delay:-${(pace * chance(seed, index, 35)).toFixed(1)}s" d="M${x} ${y}h${Math.round(between(50, 200, chance(seed, index, 33)))}"/>`
  }

  return `<g stroke="${INK}" stroke-opacity=".16" stroke-width="1.2" stroke-linecap="round">${lines}</g>`
}
