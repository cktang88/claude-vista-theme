// The whole view, drawn back to front. It depends only on the session's seed, so it is never drawn again
// mid-session and nothing flickers.

import { HEIGHT, WIDTH } from './scene/kit'
import { NEAREST, lake, mist, ridge, ridgeFills } from './scene/land'
import { LIFE_STYLE, eagle, farFlock, motes, nearFlock } from './scene/life'
import { SKY_STYLE, clouds, rays, sky, skyFills, sunWash } from './scene/sky'
import { meadow, pines, stands } from './scene/trees'

const STILL = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'

export function sceneSvg(seed: number): string {
  const land = (index: number) => ridge(seed, index) + stands(seed, index)

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMax slice">` +
    `<style>${SKY_STYLE}${LIFE_STYLE}${STILL}</style>` +
    `<defs>${skyFills()}${ridgeFills()}</defs>` +
    sky() +
    clouds(seed) +
    land(0) +
    land(1) +
    sunWash() +
    farFlock(seed) +
    mist(520, 588, 520, 52) +
    land(2) +
    land(3) +
    rays(seed) +
    mist(1050, 700, 600, 44) +
    land(4) +
    lake(seed) +
    land(5) +
    mist(760, 880, 700, 60, 0.5) +
    nearFlock(seed) +
    eagle() +
    land(NEAREST) +
    meadow(seed) +
    pines(seed) +
    motes(seed) +
    '</svg>'
  )
}
