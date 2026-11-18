// The whole view, drawn back to front: sky, then ranges of peaks with rows of cloud between them, then the dark
// ledge and firs at the corners. It depends only on the session's seed, so it is never drawn again mid-session
// and nothing flickers.

import { CLOUD_ROWS, CLOUD_STYLE, cloudFills, cloudRow } from './scene/clouds'
import { HEIGHT, WIDTH } from './scene/kit'
import { RANGES, ledgeShape, range, rangeFills, wisp } from './scene/land'
import { LIFE_STYLE, eagle, farFlock, nearFlock } from './scene/life'
import { SKY_STYLE, sky, skyFills, streaks } from './scene/sky'
import { pines } from './scene/trees'

const STILL = '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'

export function sceneSvg(seed: number): string {
  let land = ''

  // Each range stands in the cloud: one row of cloud behind its foot and the next in front.
  for (let index = 0; index < CLOUD_ROWS; index += 1) {
    land += (index < RANGES.length ? range(seed, index) : '') + cloudRow(seed, index) + (index === 0 ? farFlock(seed) : '')
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMax slice">` +
    `<style>${SKY_STYLE}${CLOUD_STYLE}${LIFE_STYLE}${STILL}</style>` +
    `<defs>${skyFills()}${rangeFills()}${cloudFills()}</defs>` +
    sky() +
    streaks(seed) +
    land +
    wisp(1490, 566, 230, 22, 70) +
    wisp(1400, 676, 190, 18, 96) +
    wisp(250, 606, 250, 20, 84) +
    nearFlock(seed) +
    eagle() +
    ledgeShape() +
    `<g fill="#252d32" stroke="#a9b8bd" stroke-opacity=".35" stroke-width="1.2">${pines(seed)}</g>` +
    '</svg>'
  )
}
