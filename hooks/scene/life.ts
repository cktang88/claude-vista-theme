// The only living things in the air: one far line of geese that crosses the sky very slowly.

import { INK, between, chance } from './kit'

export const LIFE_STYLE =
  '.cross{animation:cross 210s linear infinite}' +
  '@keyframes cross{from{transform:translate(-160px,330px)}to{transform:translate(1760px,250px)}}' +
  '.flap{animation:flap ease-in-out infinite alternate}' +
  '@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(-.3)}}' +
  '.sway{animation:sway ease-in-out infinite alternate}' +
  '@keyframes sway{from{transform:rotate(-.3deg)}to{transform:rotate(.35deg)}}'

/** Geese in a loose V. Each bird beats its wings at its own pace. */
export function geese(seed: number): string {
  let birds = ''

  for (let index = 0; index < 7; index += 1) {
    const rank = Math.ceil(index / 2)
    const wing = index % 2 === 0 ? 1 : -1
    const x = Math.round(-rank * 17 + 6 * chance(seed, index, 82))
    const y = Math.round(wing * rank * 9 + 5 * chance(seed, index, 83))
    const pace = between(0.7, 1.1, chance(seed, index, 84)).toFixed(2)

    birds += `<g transform="translate(${x} ${y}) scale(.7)"><path class="flap" style="animation-duration:${pace}s;animation-delay:-${(index * 0.17).toFixed(2)}s" d="M-10 1Q-5 -7 0 0Q5 -7 10 1"/></g>`
  }

  return `<g class="cross" style="animation-delay:-${Math.round(210 * chance(seed, 1, 81))}s" fill="none" stroke="${INK}" stroke-opacity=".55" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${birds}</g>`
}
