// The sky at golden hour: a warm gradient, a low sun with a wide bloom, long rays, and thin streaks of cloud lit
// from below.

import { SUN, WIDTH, between, chance } from './kit'

export const SKY_STYLE =
  '.drift{animation:drift linear infinite}' +
  '@keyframes drift{from{transform:translateX(-420px)}to{transform:translateX(2020px)}}' +
  '.ray{animation:ray ease-in-out infinite alternate}' +
  '@keyframes ray{from{opacity:.2}to{opacity:.95}}' +
  `.halo{animation:halo 9s ease-in-out infinite alternate;transform-origin:${SUN.x}px ${SUN.y}px}` +
  '@keyframes halo{from{transform:scale(1);opacity:.5}to{transform:scale(1.35);opacity:.1}}'

export function skyFills(): string {
  return (
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9726b"/><stop offset=".3" stop-color="#ea9560"/><stop offset=".62" stop-color="#f9c173"/><stop offset="1" stop-color="#ffe9b3"/></linearGradient>' +
    '<radialGradient id="glow"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".16" stop-color="#ffe19a" stop-opacity=".85"/><stop offset=".5" stop-color="#ffcf80" stop-opacity=".32"/><stop offset="1" stop-color="#ffcf80" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="haze"><stop offset="0" stop-color="#ffedb8" stop-opacity=".6"/><stop offset=".45" stop-color="#ffd690" stop-opacity=".4"/><stop offset="1" stop-color="#ffd690" stop-opacity="0"/></radialGradient>' +
    `<radialGradient id="beam" gradientUnits="userSpaceOnUse" cx="${SUN.x}" cy="${SUN.y}" r="560"><stop offset=".06" stop-color="#fff2c4" stop-opacity=".55"/><stop offset="1" stop-color="#fff2c4" stop-opacity="0"/></radialGradient>` +
    '<radialGradient id="mist"><stop offset="0" stop-color="#fff0d2" stop-opacity=".95"/><stop offset=".55" stop-color="#ffe8c0" stop-opacity=".6"/><stop offset="1" stop-color="#ffe8c0" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="river" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#f3a66b"/><stop offset=".6" stop-color="#fbcf92"/><stop offset="1" stop-color="#ffe6b8"/></linearGradient>' +
    '<linearGradient id="cloud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9616f"/><stop offset=".55" stop-color="#f08f62"/><stop offset="1" stop-color="#ffd08c"/></linearGradient>'
  )
}

export function sky(): string {
  return (
    `<rect x="-20" y="-20" width="${WIDTH + 40}" height="640" fill="url(#sky)"/>` +
    `<circle cx="${SUN.x}" cy="${SUN.y}" r="430" fill="url(#glow)"/>` +
    `<circle class="halo" cx="${SUN.x}" cy="${SUN.y}" r="${SUN.size + 26}" fill="none" stroke="#fff6d2" stroke-width="12"/>` +
    `<circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.size}" fill="#fff4d0"/>`
  )
}

/** Bright air between the layers: everything near the sun is washed toward gold, as a low sun does. */
export function haze(reach: number, strength: number): string {
  return `<circle cx="${SUN.x}" cy="${SUN.y}" r="${reach}" fill="url(#haze)" fill-opacity="${strength}"/>`
}

/** Rays of light that fan out from the sun between two directions (in degrees, 90 is straight down). */
export function rays(seed: number, from: number, to: number, count: number, strength = 1): string {
  let beams = ''

  for (let index = 0; index < count; index += 1) {
    const angle = ((between(from, to, (index + 0.5 * chance(seed, index, 11 + from)) / count)) * Math.PI) / 180
    const half = (between(0.7, 2.1, chance(seed, index, 12 + from)) * Math.PI) / 180
    const end = (turn: number) => `${Math.round(SUN.x + 600 * Math.cos(turn))} ${Math.round(SUN.y + 600 * Math.sin(turn))}`
    const pace = between(7, 14, chance(seed, index, 13 + from)).toFixed(1)

    beams += `<path class="ray" style="animation-duration:${pace}s;animation-delay:-${(index * 2.3).toFixed(1)}s" d="M${SUN.x} ${SUN.y}L${end(angle - half)}L${end(angle + half)}Z"/>`
  }

  return `<g fill="url(#beam)" opacity="${strength}">${beams}</g>`
}

function lens(x: number, y: number, half: number, thick: number): string {
  return `M${x - half} ${y}C${x - half / 2} ${y - thick} ${x + half / 2} ${y - thick} ${x + half} ${y}C${x + half / 2} ${Math.round(y + thick * 0.45)} ${x - half / 2} ${Math.round(y + thick * 0.45)} ${x - half} ${y}Z`
}

/** Thin clouds in long streaks, dusky on top and lit gold underneath. They cross very slowly. */
export function clouds(seed: number): string {
  let all = ''

  for (let index = 0; index < 9; index += 1) {
    const y = Math.round(between(50, 390, chance(seed, index, 24)))
    const half = Math.round(between(150, 380, chance(seed, index, 21)))
    const thick = Math.round(between(9, 24, chance(seed, index, 22)))
    const pace = Math.round(between(520, 900, chance(seed, index, 26)))
    const shape =
      lens(0, y, half, thick) +
      lens(Math.round(half * 0.5), y + Math.round(thick * 0.7), Math.round(half * 0.6), Math.round(thick * 0.6)) +
      lens(Math.round(-half * 0.55), y - Math.round(thick * 0.6), Math.round(half * 0.5), Math.round(thick * 0.5))

    all += `<path class="drift" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace * ((index + chance(seed, index, 27)) / 9))}s" d="${shape}" fill="url(#cloud)" fill-opacity="${between(0.55, 0.9, chance(seed, index, 28)).toFixed(2)}"/>`
  }

  return all
}
