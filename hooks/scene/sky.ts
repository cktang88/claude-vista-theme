// The sky: a morning gradient, the sun with its glow and long rays, and clouds that drift across.

import { SUN, WIDTH, between, chance } from './kit'

export const SKY_STYLE =
  '.drift{animation:drift linear infinite}' +
  '@keyframes drift{from{transform:translateX(-340px)}to{transform:translateX(1940px)}}' +
  '.ray{animation:ray ease-in-out infinite alternate}' +
  '@keyframes ray{from{opacity:.25}to{opacity:.95}}' +
  `.halo{animation:halo 9s ease-in-out infinite alternate;transform-origin:${SUN.x}px ${SUN.y}px}` +
  '@keyframes halo{from{transform:scale(1);opacity:.55}to{transform:scale(1.3);opacity:.12}}'

export function skyFills(): string {
  return (
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fc1e6"/><stop offset=".45" stop-color="#bce0f0"/><stop offset=".8" stop-color="#f3efd8"/><stop offset="1" stop-color="#fdecc2"/></linearGradient>' +
    '<radialGradient id="glow"><stop offset="0" stop-color="#fff6d0" stop-opacity=".95"/><stop offset=".25" stop-color="#ffefbd" stop-opacity=".5"/><stop offset="1" stop-color="#ffefbd" stop-opacity="0"/></radialGradient>' +
    `<radialGradient id="beam" gradientUnits="userSpaceOnUse" cx="${SUN.x}" cy="${SUN.y}" r="1150"><stop offset=".05" stop-color="#fff8dc" stop-opacity=".5"/><stop offset="1" stop-color="#fff8dc" stop-opacity="0"/></radialGradient>` +
    '<radialGradient id="mist"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="puff" x1="0" y1="0" x2="0" y2="1"><stop offset=".35" stop-color="#fff"/><stop offset="1" stop-color="#dfecf5"/></linearGradient>' +
    '<linearGradient id="lake" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a9d5e2"/><stop offset=".7" stop-color="#dff1f0"/><stop offset="1" stop-color="#fff6d6"/></linearGradient>'
  )
}

export function sky(): string {
  return (
    `<rect x="-20" y="-20" width="${WIDTH + 40}" height="620" fill="url(#sky)"/>` +
    `<circle cx="${SUN.x}" cy="${SUN.y}" r="560" fill="url(#glow)"/>` +
    `<circle class="halo" cx="${SUN.x}" cy="${SUN.y}" r="80" fill="none" stroke="#fff7d4" stroke-width="10"/>` +
    `<circle cx="${SUN.x}" cy="${SUN.y}" r="56" fill="#fffbe8"/>`
  )
}

/** A warm wash laid over the far ridges near the sun, as bright air does. */
export function sunWash(): string {
  return `<circle cx="${SUN.x}" cy="${SUN.y}" r="430" fill="url(#glow)" fill-opacity=".55"/>`
}

/** Long rays of light that fan down and to the left from the sun, each one slowly growing and fading. */
export function rays(seed: number): string {
  let beams = ''

  for (let index = 0; index < 7; index += 1) {
    const angle = ((108 + index * 9.5 + 5 * chance(seed, index, 11)) * Math.PI) / 180
    const half = (between(1.2, 3.2, chance(seed, index, 12)) * Math.PI) / 180
    const end = (turn: number) => `${Math.round(SUN.x + 1300 * Math.cos(turn))} ${Math.round(SUN.y + 1300 * Math.sin(turn))}`
    const pace = between(7, 14, chance(seed, index, 13)).toFixed(1)

    beams += `<path class="ray" style="animation-duration:${pace}s;animation-delay:-${(index * 2.3).toFixed(1)}s" d="M${SUN.x} ${SUN.y}L${end(angle - half)}L${end(angle + half)}Z"/>`
  }

  return `<g fill="url(#beam)">${beams}</g>`
}

/** One cloud: a heap of round puffs, a blue-grey underside, and bright tops shaded a little toward the base. */
function cloud(seed: number, index: number): string {
  const width = between(170, 300, chance(seed, index, 21))
  const puffs = 5 + Math.floor(3 * chance(seed, index, 22))
  let shapes = `<ellipse cx="0" cy="-4" rx="${Math.round(width / 2)}" ry="15"/>`

  for (let puff = 0; puff < puffs; puff += 1) {
    const across = (puff + 0.5) / puffs
    const middle = 1 - Math.abs(across - 0.5) * 2
    const size = between(20, 34, chance(seed, index * 13 + puff, 23)) * (0.55 + 0.75 * middle)

    shapes += `<circle cx="${Math.round(-width * 0.42 + width * 0.84 * across)}" cy="${Math.round(-8 - size * 0.55)}" r="${Math.round(size)}"/>`
  }

  return `<g fill="#bfd6e6" transform="translate(-7 6)">${shapes}</g><g fill="url(#puff)">${shapes}</g>`
}

/** Thin streaks of high cloud near the horizon. */
function streaks(seed: number): string {
  let all = ''

  for (let index = 0; index < 6; index += 1) {
    const pace = Math.round(between(500, 760, chance(seed, index, 28)))
    const y = Math.round(between(250, 440, chance(seed, index, 29)))
    const length = Math.round(between(110, 240, chance(seed, index, 30)))

    all += `<ellipse class="drift" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace * ((index + 0.5) / 6))}s" cx="0" cy="${y}" rx="${length}" ry="${Math.round(between(3, 6, chance(seed, index, 20)))}" fill="#fff" fill-opacity=".55"/>`
  }

  return all
}

/** Clouds at different heights and sizes. The small low ones are far away, so they cross more slowly. */
export function clouds(seed: number): string {
  let all = streaks(seed)

  for (let index = 0; index < 9; index += 1) {
    const isFar = index % 3 === 0
    const y = isFar ? between(360, 440, chance(seed, index, 24)) : between(70, 290, chance(seed, index, 24))
    const scale = isFar ? between(0.35, 0.55, chance(seed, index, 25)) : between(0.8, 1.5, chance(seed, index, 25))
    const pace = Math.round(isFar ? between(620, 820, chance(seed, index, 26)) : between(260, 420, chance(seed, index, 26)))
    const start = Math.round(pace * ((index + chance(seed, index, 27)) / 9))

    all += `<g class="drift" style="animation-duration:${pace}s;animation-delay:-${start}s"><g transform="translate(0 ${Math.round(y)}) scale(${scale.toFixed(2)})" opacity="${isFar ? '.8' : '.96'}">${cloud(seed, index)}</g></g>`
  }

  return all
}
