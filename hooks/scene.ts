// The whole view, drawn back to front. It depends only on the session's seed, so it is never drawn again
// mid-session and nothing flickers.

import { HEIGHT, VALLEY, WIDTH } from './scene/kit'
import { NEAREST, RIDGES, fog, ridge, ridgeFills, river } from './scene/land'
import { LIFE_STYLE, eagle, farFlock, motes, nearFlock } from './scene/life'
import { SKY_STYLE, clouds, haze, rays, sky, skyFills } from './scene/sky'
import { grass, pines } from './scene/trees'

const STILL = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'

/** The app shows nothing at all for a picture over 131,072 characters, so a busy view gets a sparser forest. */
const LARGEST = 122_000

function draw(seed: number, thin: number): string {
  const land = (index: number) => ridge(seed, index, thin)

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMax slice">` +
    `<style>${SKY_STYLE}${LIFE_STYLE}${STILL}</style>` +
    `<defs>${skyFills()}${ridgeFills()}</defs>` +
    sky() +
    clouds(seed) +
    land(0) +
    land(1) +
    land(2) +
    haze(380, 0.9) +
    farFlock(seed) +
    land(3) +
    fog(VALLEY, 650, 580, 52, 52, 0.8) +
    land(4) +
    haze(280, 0.75) +
    land(5) +
    fog(VALLEY, 712, 620, 64, 44, 0.95) +
    land(6) +
    river(seed) +
    fog(VALLEY, 790, 640, 74, 58, 1) +
    rays(seed, 100, 205, 6, 0.6) +
    land(7) +
    fog(VALLEY, 900, 560, 60, 60, 0.5) +
    nearFlock(seed) +
    eagle() +
    land(NEAREST) +
    grass(seed) +
    `<g fill="${RIDGES[NEAREST]!.top}" stroke="#ff9a5a" stroke-opacity=".3" stroke-width="1.2">${pines(seed)}</g>` +
    motes(seed) +
    '</svg>'
  )
}

export function sceneSvg(seed: number): string {
  let picture = draw(seed, 1)

  for (let thin = 1.2; picture.length > LARGEST && thin < 3; thin += 0.2) {
    picture = draw(seed, thin)
  }

  return picture
}
