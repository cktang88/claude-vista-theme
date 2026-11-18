// The sky: a calm gray gradient, a sun that is only a white disc in the haze (nothing bright or colored, so it
// never pulls the eye), and thin streaks of high cloud.

import { SUN, WIDTH, between, chance } from './kit'

export const SKY_STYLE =
  '.drift{animation:drift linear infinite}' +
  '@keyframes drift{from{transform:translateX(-420px)}to{transform:translateX(2020px)}}'

export function skyFills(): string {
  return (
    '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dbe2e4"/><stop offset=".45" stop-color="#e8ecec"/><stop offset="1" stop-color="#f3f5f4"/></linearGradient>' +
    '<radialGradient id="glow"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="mist"><stop offset="0" stop-color="#f7f9f8" stop-opacity=".95"/><stop offset=".6" stop-color="#f1f4f3" stop-opacity=".7"/><stop offset="1" stop-color="#f1f4f3" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="streak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3ced3"/><stop offset="1" stop-color="#f4f6f5"/></linearGradient>'
  )
}

export function sky(): string {
  return (
    `<rect x="-20" y="-20" width="${WIDTH + 40}" height="760" fill="url(#sky)"/>` +
    `<circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.size * 2.6}" fill="url(#glow)"/>` +
    `<circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.size}" fill="#fbfcfb"/>`
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

    all += `<path class="drift" style="animation-duration:${pace}s;animation-delay:-${Math.round(pace * ((index + chance(seed, index, 27)) / 7))}s" d="${shape}" fill="url(#streak)" fill-opacity="${between(0.35, 0.7, chance(seed, index, 28)).toFixed(2)}"/>`
  }

  return all
}
