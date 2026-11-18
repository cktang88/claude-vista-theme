// What moves in the air: two flocks of birds, a soaring eagle, and specks of light drifting up near the trees.

import { WIDTH, between, chance } from './kit'

const SOAR = { x: 430, y: 300, wide: 120, tall: 46 } as const

function soarStops(): string {
  let stops = ''

  for (let stop = 0; stop <= 8; stop += 1) {
    const turn = (stop / 8) * Math.PI * 2
    const x = Math.round(SOAR.x + SOAR.wide * Math.cos(turn))
    const y = Math.round(SOAR.y + SOAR.tall * Math.sin(turn))

    stops += `${stop * 12.5}%{transform:translate(${x}px,${y}px) rotate(${stop * 45 + 180}deg)}`
  }

  return stops
}

export const LIFE_STYLE =
  '.cross{animation:cross 95s linear infinite}' +
  '@keyframes cross{from{transform:translate(-160px,330px)}to{transform:translate(1760px,240px)}}' +
  '.back{animation:back 150s linear infinite}' +
  '@keyframes back{from{transform:translate(1700px,455px)}to{transform:translate(-120px,420px)}}' +
  '.flap{animation:flap ease-in-out infinite alternate}' +
  '@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(-.35)}}' +
  '.soar{animation:soar 40s linear infinite}' +
  `@keyframes soar{${soarStops()}}` +
  '.mote{animation:mote linear infinite}' +
  '@keyframes mote{0%{transform:translate(0,0);opacity:0}15%{opacity:.9}80%{opacity:.7}100%{transform:translate(40px,-180px);opacity:0}}' +
  '.sway{animation:sway ease-in-out infinite alternate}' +
  '@keyframes sway{from{transform:rotate(-.5deg)}to{transform:rotate(.6deg)}}' +
  '.mist{animation:mist ease-in-out infinite alternate}' +
  '@keyframes mist{from{transform:translateX(-70px)}to{transform:translateX(70px)}}' +
  '.glint{animation:glint ease-in-out infinite alternate}' +
  '@keyframes glint{from{opacity:.1}to{opacity:1}}'

/** A flock in a loose V. Each bird beats its wings at its own pace. */
function flock(seed: number, salt: number, count: number, size: number): string {
  let birds = ''

  for (let index = 0; index < count; index += 1) {
    const rank = Math.ceil(index / 2)
    const wing = index % 2 === 0 ? 1 : -1
    const x = Math.round(-rank * 19 + 6 * chance(seed, index, salt))
    const y = Math.round(wing * rank * 11 + 5 * chance(seed, index, salt + 1))
    const pace = between(0.45, 0.75, chance(seed, index, salt + 2)).toFixed(2)

    birds += `<g transform="translate(${x} ${y}) scale(${size})"><path class="flap" style="animation-duration:${pace}s;animation-delay:-${(index * 0.17).toFixed(2)}s" d="M-10 1Q-5 -7 0 0Q5 -7 10 1"/></g>`
  }

  return `<g fill="none" stroke="#4a1a2c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${birds}</g>`
}

/** The near flock crosses the sky left to right. The far one, smaller, goes the other way low over the peaks. */
export function nearFlock(seed: number): string {
  return `<g class="cross" style="animation-delay:-${Math.round(95 * chance(seed, 1, 81))}s">${flock(seed, 82, 7, 1)}</g>`
}

export function farFlock(seed: number): string {
  return `<g class="back" style="animation-delay:-${Math.round(150 * chance(seed, 2, 81))}s" opacity=".7">${flock(seed, 86, 5, 0.5)}</g>`
}

/** An eagle gliding in a wide slow circle, seen from far below. */
export function eagle(): string {
  return '<g class="soar"><path d="M0 -3C-9 -6 -27 -8 -42 -2C-29 -2 -14 2 -4 4L-3 11L0 7L3 11L4 4C14 2 29 -2 42 -2C27 -8 9 -6 0 -3Z" fill="#4a1a2c" transform="scale(.62)"/></g>'
}

/** Specks of light that rise and fade, as pollen does in a sunbeam. */
export function motes(seed: number): string {
  let specks = ''

  for (let index = 0; index < 22; index += 1) {
    const x = Math.round(WIDTH * chance(seed, index, 91))
    const y = Math.round(between(560, 930, chance(seed, index, 92)))
    const pace = between(9, 18, chance(seed, index, 93))

    specks += `<circle class="mote" style="animation-duration:${pace.toFixed(1)}s;animation-delay:-${(pace * chance(seed, index, 94)).toFixed(1)}s" cx="${x}" cy="${y}" r="${between(1.2, 2.6, chance(seed, index, 95)).toFixed(1)}"/>`
  }

  return `<g fill="#ffe6a8">${specks}</g>`
}
