// The sky: a calm warm gradient that is palest where the words sit, a small low sun at the right with a soft
// glow, and thin streaks of high cloud.

import { SUN, WIDTH, between, chance } from './kit'

export const SKY_STYLE =
  '.drift{animation:drift linear infinite}' +
  '@keyframes drift{from{transform:translateX(-420px)}to{transform:translateX(2020px)}}' +
  `.halo{animation:halo 9s ease-in-out infinite alternate;transform-origin:${SUN.x}px ${SUN.y}px}` +
  '@keyframes halo{from{transform:scale(1);opacity:.9}to{transform:scale(1.5);opacity:.3}}'

export function skyFills(): string {
  return (
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9a379"/><stop offset=".42" stop-color="#f8cfa3"/><stop offset="1" stop-color="#fff1dc"/></linearGradient>' +
    '<radialGradient id="glow"><stop offset="0" stop-color="#fff3cc" stop-opacity=".95"/><stop offset=".3" stop-color="#ffe2a6" stop-opacity=".5"/><stop offset="1" stop-color="#ffe2a6" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="mist"><stop offset="0" stop-color="#fff3e0" stop-opacity=".95"/><stop offset=".6" stop-color="#fde8cd" stop-opacity=".7"/><stop offset="1" stop-color="#fde8cd" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="streak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e59a7c"/><stop offset="1" stop-color="#ffe3b6"/></linearGradient>'
  )
}

export function sky(): string {
  return (
    `<rect x="-20" y="-20" width="${WIDTH + 40}" height="760" fill="url(#sky)"/>` +
    `<circle cx="${SUN.x}" cy="${SUN.y}" r="300" fill="url(#glow)"/>` +
    `<circle class="halo" cx="${SUN.x}" cy="${SUN.y}" r="${SUN.size + 30}" fill="url(#glow)"/>` +
    `<circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.size}" fill="#fff8e2"/>`
  )
}

function lens(x: number, y: number, half: number, thick: number): string {
  return `M${x - half} ${y}C${x - half / 2} ${y - thick} ${x + half / 2} ${y - thick} ${x + half} ${y}C${x + half / 2} ${Math.round(y + thick * 0.45)} ${x - half / 2} ${Math.round(y + thick * 0.45)} ${x - half} ${y}Z`
}

/** Thin clouds in long streaks high up, rosy on top and gold underneath. They cross very slowly. */
export function streaks(seed: number): string {
  let all = ''

  for (let index = 0; index < 7; index += 1) {
    const y = Math.round(between(40, 300, chance(seed, index, 24)))
    const half = Math.round(between(150, 360, chance(seed, index, 21)))
    const thick = Math.round(between(7, 18, chance(seed, index, 22)))
    const pace = Math.round(between(560, 940, chance(seed, index, 26)))
    const shape =
      lens(0, y, half, thick) +
      lens(Math.round(half * 0.5), y + Math.round(thick * 0.7), Math.round(half * 0.6), Math.round(thick * 0.6)) +
      lens(Math.round(-half * 0.55), y - Math.round(thick * 0.6), Math.round(half * 0.5), Math.round(thick * 0.5))

    all += `<path class="drift" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace * ((index + chance(seed, index, 27)) / 7))}s" d="${shape}" fill="url(#streak)" fill-opacity="${between(0.3, 0.6, chance(seed, index, 28)).toFixed(2)}"/>`
  }

  return all
}
