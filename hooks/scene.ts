// The whole view, drawn back to front. It depends only on the session's seed, so it is never drawn again
// mid-session and nothing flickers.

import { HEIGHT, WIDTH } from './scene/kit'
import { NEAREST, RIDGES, mist, ridge, ridgeFills, river } from './scene/land'
import { LIFE_STYLE, eagle, farFlock, motes, nearFlock } from './scene/life'
import { SKY_STYLE, clouds, haze, rays, sky, skyFills } from './scene/sky'
import { grass, pines } from './scene/trees'

const STILL = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'

export function sceneSvg(seed: number): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMax slice">` +
    `<style>${SKY_STYLE}${LIFE_STYLE}${STILL}</style>` +
    `<defs>${skyFills()}${ridgeFills()}</defs>` +
    sky() +
    rays(seed, 190, 345, 5, 0.4) +
    clouds(seed) +
    ridge(seed, 0) +
    ridge(seed, 1) +
    haze(560, 0.9) +
    farFlock(seed) +
    ridge(seed, 2) +
    mist(520, 612, 520, 52, 0.45) +
    ridge(seed, 3) +
    haze(400, 0.75) +
    ridge(seed, 4) +
    mist(1000, 720, 600, 44, 0.3) +
    ridge(seed, 5) +
    river(seed) +
    haze(280, 0.6) +
    rays(seed, 25, 165, 8, 0.8) +
    ridge(seed, 6) +
    mist(760, 892, 700, 60, 0.22) +
    nearFlock(seed) +
    eagle() +
    ridge(seed, NEAREST) +
    grass(seed) +
    `<g fill="${RIDGES[NEAREST]!.top}" stroke="#ff9a5a" stroke-opacity=".28" stroke-width="1.2">${pines(seed)}</g>` +
    motes(seed) +
    '</svg>'
  )
}
