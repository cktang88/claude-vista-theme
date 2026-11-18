// What moves in the air: two flocks of birds and a soaring eagle. The near firs sway.

import { between, chance } from './kit'

const SOAR = { x: 420, y: 330, wide: 110, tall: 42 } as const

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
  '@keyframes cross{from{transform:translate(-160px,300px)}to{transform:translate(1760px,210px)}}' +
  '.back{animation:back 150s linear infinite}' +
  '@keyframes back{from{transform:translate(1700px,470px)}to{transform:translate(-120px,430px)}}' +
  '.flap{animation:flap ease-in-out infinite alternate}' +
  '@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(-.35)}}' +
  '.soar{animation:soar 40s linear infinite}' +
  `@keyframes soar{${soarStops()}}` +
  '.sway{animation:sway ease-in-out infinite alternate}' +
  '@keyframes sway{from{transform:rotate(-.5deg)}to{transform:rotate(.6deg)}}'

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
